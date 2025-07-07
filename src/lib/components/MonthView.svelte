<script lang="ts">
	import EventPopover from './EventPopover.svelte';
	
	interface Props {
		currentDate: Date;
		selectedDate: Date;
		onSelectDate: (date: Date) => void;
		events: any; // Will be typed properly with Convex
	}
	
	let { currentDate, selectedDate, onSelectDate, events }: Props = $props();
	let hoveredDay = $state(null);
	let popoverPosition = $state({ x: 0, y: 0 });
	let hoverTimeout = null;
	
	// Get calendar days for month view
	function getMonthDays(date: Date) {
		const year = date.getFullYear();
		const month = date.getMonth();
		const firstDay = new Date(year, month, 1);
		const lastDay = new Date(year, month + 1, 0);
		const startDate = new Date(firstDay);
		startDate.setDate(startDate.getDate() - firstDay.getDay());
		
		const days = [];
		const current = new Date(startDate);
		
		while (current <= lastDay || current.getDay() !== 0) {
			days.push(new Date(current));
			current.setDate(current.getDate() + 1);
		}
		
		return days;
	}
	
	// Calculate time allocation for a day
	function getDayAllocation(date: Date) {
		const dateStr = date.toDateString();
		const work = events.work.filter(e => e.date.toDateString() === dateStr).reduce((sum, e) => sum + e.hours, 0);
		const personal = events.personal.filter(e => e.date.toDateString() === dateStr).reduce((sum, e) => sum + e.hours, 0);
		const chores = events.chores.filter(e => e.date.toDateString() === dateStr).reduce((sum, e) => sum + e.hours, 0);
		
		return { work, personal, chores, total: work + personal + chores };
	}
</script>

<div class="card preset-filled-surface-200-800 p-4 h-full flex flex-col">
	<h2 class="text-lg font-semibold mb-3">Month Overview</h2>
	<div class="grid grid-cols-7 gap-1 text-xs flex-1">
		<!-- Week day headers -->
		{#each ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as day}
			<div class="text-center font-medium p-1">{day}</div>
		{/each}
		
		<!-- Calendar days with time bars -->
		{#each getMonthDays(currentDate) as day}
			{@const allocation = getDayAllocation(day)}
			{@const isToday = day.toDateString() === new Date().toDateString()}
			{@const isSelected = day.toDateString() === selectedDate.toDateString()}
			{@const maxHours = 12}
			{@const workWidth = Math.min((allocation.work / maxHours) * 100, 100)}
			{@const personalWidth = Math.min((allocation.personal / maxHours) * 100, 100 - workWidth)}
			{@const choresWidth = Math.min((allocation.chores / maxHours) * 100, 100 - workWidth - personalWidth)}
			<button
				class="aspect-square p-1 rounded hover:bg-surface-200-800 cursor-pointer relative {isToday ? 'ring-2 ring-primary-500' : ''} {isSelected ? 'bg-surface-200-800' : ''}"
				onclick={() => onSelectDate(day)}
			>
				<div class="text-xs {day.getMonth() !== currentDate.getMonth() ? 'opacity-50' : ''}">
					{day.getDate()}
				</div>
				
				<!-- Time allocation bars -->
				<div class="absolute bottom-1 left-1 right-1 h-3 bg-surface-300-700 rounded-sm overflow-hidden">
					<div class="flex h-full">
						{#if allocation.work > 0}
							<div class="event-work" style="width: {workWidth}%"></div>
						{/if}
						{#if allocation.personal > 0}
							<div class="event-personal" style="width: {personalWidth}%"></div>
						{/if}
						{#if allocation.chores > 0}
							<div class="event-chores" style="width: {choresWidth}%"></div>
						{/if}
					</div>
				</div>
			</button>
		{/each}
	</div>
	
	<!-- Legend -->
	<div class="flex gap-4 mt-4 text-xs">
		<div class="flex items-center gap-1">
			<div class="w-3 h-3 event-work rounded"></div>
			<span>Work</span>
		</div>
		<div class="flex items-center gap-1">
			<div class="w-3 h-3 event-personal rounded"></div>
			<span>Personal</span>
		</div>
		<div class="flex items-center gap-1">
			<div class="w-3 h-3 event-chores rounded"></div>
			<span>Chores</span>
		</div>
	</div>
</div>

<style>
	.w-3 {
		width: 0.75rem;
	}
	.h-3 {
		height: 0.75rem;
	}
	
	/* Event colors that use theme-aware CSS variables */
	.event-work {
		background-color: var(--color-primary-500);
	}
	
	.event-personal {
		background-color: var(--color-secondary-500);
	}
	
	.event-chores {
		background-color: var(--color-tertiary-500);
	}
	
	/* Glassmorphic style overrides */
	:global([data-style="glassmorphic"]) .event-work {
		background-color: var(--event-work-color, var(--color-primary-500));
	}
	
	:global([data-style="glassmorphic"]) .event-personal {
		background-color: var(--event-personal-color, var(--color-secondary-500));
	}
	
	:global([data-style="glassmorphic"]) .event-chores {
		background-color: var(--event-chores-color, var(--color-tertiary-500));
	}
</style>