<script lang="ts">
	import EventPopover from './EventPopover.svelte';
	
	interface Props {
		events: any; // Will be typed properly with Convex
		selectedDate: Date;
	}
	
	let { events, selectedDate }: Props = $props();
	let hoveredEvent = $state(null);
	let popoverPosition = $state({ x: 0, y: 0 });
	let hoverTimeout = null;
	
	// Mock other people's calendars
	const otherCalendars = [
		{
			name: 'Boss',
			color: 'var(--color-tertiary-400)',
			events: [
				{ start: 9, duration: 2 }, // 9-11 AM
				{ start: 14, duration: 3 }, // 2-5 PM
			]
		},
		{
			name: 'Sarah',
			color: 'var(--color-tertiary-600)',
			events: [
				{ start: 10, duration: 1 }, // 10-11 AM
				{ start: 13, duration: 2 }, // 1-3 PM
				{ start: 17, duration: 1 }, // 5-6 PM (our lunch)
			]
		}
	];
	
	// Get events for selected date
	function getSelectedDateEvents() {
		const dateStr = selectedDate.toDateString();
		const dayEvents = [];
		
		// Collect all events for selected date
		events.work.filter(e => e.date.toDateString() === dateStr).forEach(e => 
			dayEvents.push({ ...e, type: 'work' })
		);
		events.personal.filter(e => e.date.toDateString() === dateStr).forEach(e => 
			dayEvents.push({ ...e, type: 'personal' })
		);
		events.chores.filter(e => e.date.toDateString() === dateStr).forEach(e => 
			dayEvents.push({ ...e, type: 'chores' })
		);
		
		// Add mock times (in real app, these would come from the events)
		let currentTime = new Date(selectedDate);
		currentTime.setHours(9, 0, 0, 0);
		
		return dayEvents.map(event => ({
			...event,
			startTime: new Date(currentTime),
			endTime: new Date(currentTime.setHours(currentTime.getHours() + event.hours))
		}));
	}
	
	// Get current time position
	function getCurrentTimePosition() {
		const now = new Date();
		const hours = now.getHours() + now.getMinutes() / 60;
		return (hours / 24) * 100;
	}
	
	// Get upcoming events
	let allEvents = $derived(getSelectedDateEvents());
	let upcomingEvents = $derived(allEvents.filter(e => e.startTime > new Date()));
	let currentPosition = $derived(getCurrentTimePosition());
	let isToday = $derived(selectedDate.toDateString() === new Date().toDateString());
</script>

<div class="card preset-filled-surface-200-800 p-4 h-full flex flex-col">
	<!-- Header with title and legend -->
	<div class="flex justify-between items-center mb-3">
		<h2 class="text-lg font-semibold">
			{isToday ? "Today's" : selectedDate.toLocaleDateString('en-US', { weekday: 'long' }) + "'s"} Timeline
		</h2>
		
		<!-- Next event and calendar legend -->
		<div class="flex items-center gap-6 text-sm">
			<!-- Next event -->
			<div class="flex items-center gap-2">
				<span class="font-medium">Next:</span>
				{#if upcomingEvents.length > 0}
					<div class="event-{upcomingEvents[0].type} event-item text-white px-2 py-1 rounded text-xs">
						{upcomingEvents[0].title}
					</div>
					<span class="opacity-75 text-xs">
						{Math.floor((upcomingEvents[0].startTime.getTime() - Date.now()) / 60000)}m
					</span>
				{:else}
					<span class="opacity-50 text-xs">No more events today</span>
				{/if}
			</div>
			
			<!-- Calendar legend -->
			<div class="flex gap-3 text-xs">
				{#each otherCalendars as calendar}
					<div class="flex items-center gap-1">
						<div class="w-4 h-1.5 rounded-full" style="background-color: {calendar.color}"></div>
						<span class="opacity-75">{calendar.name}</span>
					</div>
				{/each}
			</div>
		</div>
	</div>
	
	<!-- Timeline ticker -->
	<div class="relative flex-1 min-h-0">
		<div class="absolute inset-0 overflow-x-auto overflow-y-hidden">
			<div class="relative h-full" style="min-width: 1440px">
				<!-- Time markers -->
				<div class="absolute inset-0 flex">
					{#each Array(24) as _, hour}
						<div class="flex-1 border-l border-surface-300-700 relative" style="min-width: 60px">
							<span class="absolute top-2 left-1 text-sm font-medium opacity-60">
								{#if hour === 0}
									12am
								{:else if hour < 12}
									{hour}am
								{:else if hour === 12}
									12pm
								{:else}
									{hour - 12}pm
								{/if}
							</span>
						</div>
					{/each}
				</div>
				
				<!-- Current time indicator (only show if today) -->
				{#if isToday}
					<div 
						class="absolute top-0 bottom-0 bg-red-500 z-20" 
						style="left: {currentPosition}%; width: 2px;"
					>
						<div class="absolute left-1/2 -translate-x-1/2 text-xs text-red-500 font-medium whitespace-nowrap" style="top: -24px;">
							{new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
						</div>
					</div>
				{/if}
				
				<!-- My events on timeline (primary focus) -->
				<div class="absolute top-10 left-0 right-0" style="height: calc(100% - 60px);">
					{#each allEvents as event}
						{@const startHour = event.startTime.getHours() + event.startTime.getMinutes() / 60}
						{@const duration = event.hours}
						{@const leftPosition = (startHour / 24) * 100}
						{@const width = (duration / 24) * 100}
						<div 
							role="button"
							tabindex="0"
							class="event-{event.type} event-item absolute rounded-lg text-white text-sm px-3 py-2 overflow-hidden shadow-lg flex items-center justify-center cursor-pointer"
							style="left: {leftPosition}%; width: {width}%; height: 40px; top: 0"
							title="{event.title} - {event.startTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}"
							onmouseenter={(e) => {
								clearTimeout(hoverTimeout);
								hoveredEvent = event;
								const rect = e.currentTarget.getBoundingClientRect();
								popoverPosition = { x: rect.left + rect.width / 2, y: rect.top };
							}}
							onmouseleave={() => {
								hoverTimeout = setTimeout(() => {
									hoveredEvent = null;
								}, 200); // 200ms delay
							}}
						>
							<div class="font-semibold truncate">{event.title}</div>
						</div>
					{/each}
				</div>
				
				<!-- Other people's calendars (thin horizontal lines) -->
				<div class="absolute left-0 right-0" style="bottom: 8px; height: 30px;">
					{#each otherCalendars as calendar, idx}
						{#each calendar.events as event}
							{@const leftPosition = (event.start / 24) * 100}
							{@const width = (event.duration / 24) * 100}
							<div 
								class="absolute h-3 rounded-full opacity-80"
								style="left: {leftPosition}%; width: {width}%; background-color: {calendar.color}; top: {idx * 14}px"
								title="{calendar.name}: Busy"
							></div>
						{/each}
					{/each}
				</div>
			</div>
		</div>
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
