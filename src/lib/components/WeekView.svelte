<script lang="ts">
	import EventPopover from './EventPopover.svelte';
	
	interface Props {
		currentDate: Date;
		events: any; // Will be typed properly with Convex
	}
	
	let { currentDate, events }: Props = $props();
	let hoveredEvent = $state(null);
	let popoverPosition = $state({ x: 0, y: 0 });
	let hoverTimeout = null;
	
	// Get week days
	function getWeekDays(date: Date) {
		const weekStart = new Date(date);
		weekStart.setDate(date.getDate() - date.getDay());
		
		const days = [];
		for (let i = 0; i < 7; i++) {
			const day = new Date(weekStart);
			day.setDate(weekStart.getDate() + i);
			days.push(day);
		}
		return days;
	}
	
	// Get events for a specific day
	function getDayEvents(date: Date) {
		const dateStr = date.toDateString();
		const dayEvents = [];
		
		events.work.filter(e => e.date.toDateString() === dateStr).forEach(e => 
			dayEvents.push({ ...e, type: 'work' })
		);
		events.personal.filter(e => e.date.toDateString() === dateStr).forEach(e => 
			dayEvents.push({ ...e, type: 'personal' })
		);
		events.chores.filter(e => e.date.toDateString() === dateStr).forEach(e => 
			dayEvents.push({ ...e, type: 'chores' })
		);
		
		return dayEvents.sort((a, b) => a.date.getTime() - b.date.getTime());
	}
	
	let weekDays = $derived(getWeekDays(currentDate));
</script>

<div class="card preset-filled-surface-200-800 p-3 h-full flex flex-col">
	<h2 class="text-base font-semibold mb-2">Week Schedule</h2>
	<div class="grid grid-cols-7 gap-1 flex-1 overflow-auto text-xs">
		{#each weekDays as day}
			{@const dayEvents = getDayEvents(day)}
			{@const isToday = day.toDateString() === new Date().toDateString()}
			<div class="border-l {isToday ? 'border-primary-500' : 'border-surface-300-700'} pl-1">
				<div class="font-medium mb-1">
					{day.toLocaleDateString('en-US', { weekday: 'short' })}
				</div>
				<div class="opacity-75">{day.getDate()}</div>
				
				<div class="space-y-0.5 mt-1">
					{#each dayEvents.slice(0, 3) as event}
						<div 
							role="button"
							tabindex="0"
							class="event-{event.type} event-item text-white px-1 py-0.5 rounded truncate cursor-pointer" 
							title={event.title}
							onmouseenter={(e) => {
								clearTimeout(hoverTimeout);
								hoveredEvent = event;
								const rect = e.currentTarget.getBoundingClientRect();
								popoverPosition = { x: rect.left + rect.width / 2, y: rect.top };
							}}
							onmouseleave={() => {
								hoverTimeout = setTimeout(() => {
									hoveredEvent = null;
								}, 200);
							}}
						>
							{event.title}
						</div>
					{/each}
					{#if dayEvents.length > 3}
						<div class="opacity-50 italic">+{dayEvents.length - 3}</div>
					{/if}
					{#if dayEvents.length === 0}
						<div class="opacity-50 italic">Free</div>
					{/if}
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
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
	
	/* Glassmorphic event items */
	:global([data-style="glassmorphic"]) .event-item {
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.1);
	}
</style>

<!-- Event Popover -->
{#if hoveredEvent}
	<EventPopover 
		event={hoveredEvent} 
		x={popoverPosition.x} 
		y={popoverPosition.y} 
		visible={true}
		onHover={() => clearTimeout(hoverTimeout)}
		onLeave={() => {
			hoverTimeout = setTimeout(() => {
				hoveredEvent = null;
			}, 200);
		}}
	/>
{/if}