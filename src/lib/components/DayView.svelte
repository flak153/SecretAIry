<script lang="ts">
	interface Props {
		events: any; // Will be typed properly with Convex
	}
	
	let { events }: Props = $props();
	
	// Get events for today
	function getTodayEvents() {
		const now = new Date();
		const dateStr = now.toDateString();
		const todayEvents = [];
		
		// Collect all events for today
		events.work.filter(e => e.date.toDateString() === dateStr).forEach(e => 
			todayEvents.push({ ...e, type: 'work', color: 'bg-blue-500' })
		);
		events.personal.filter(e => e.date.toDateString() === dateStr).forEach(e => 
			todayEvents.push({ ...e, type: 'personal', color: 'bg-green-500' })
		);
		events.chores.filter(e => e.date.toDateString() === dateStr).forEach(e => 
			todayEvents.push({ ...e, type: 'chores', color: 'bg-orange-500' })
		);
		
		// Add mock times (in real app, these would come from the events)
		let currentTime = new Date(now);
		currentTime.setHours(9, 0, 0, 0);
		
		return todayEvents.map(event => ({
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
	let allEvents = $derived(getTodayEvents());
	let upcomingEvents = $derived(allEvents.filter(e => e.startTime > new Date()));
	let currentPosition = $derived(getCurrentTimePosition());
</script>

<div class="card p-4 h-full flex flex-col">
	<h2 class="text-lg font-semibold mb-3">Today's Timeline</h2>
	
	<!-- Timeline ticker -->
	<div class="relative flex-1 min-h-0">
		<div class="absolute inset-0 overflow-x-auto overflow-y-hidden">
			<div class="relative h-full" style="min-width: 1440px">
				<!-- Time markers -->
				<div class="absolute inset-0 flex">
					{#each Array(24) as _, hour}
						<div class="flex-1 border-l border-surface-300-700 relative" style="min-width: 60px">
							<span class="absolute -top-6 left-1 text-xs opacity-50">
								{hour === 0 ? '12am' : hour < 12 ? `${hour}am` : hour === 12 ? '12pm' : `${hour-12}pm`}
							</span>
						</div>
					{/each}
				</div>
				
				<!-- Current time indicator -->
				<div 
					class="absolute top-0 bottom-0 bg-red-500 z-10" 
					style="left: {currentPosition}%; width: 2px;"
				>
					<div class="absolute left-1/2 -translate-x-1/2 text-xs text-red-500 font-medium whitespace-nowrap" style="top: -24px;">
						{new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
					</div>
				</div>
				
				<!-- Events on timeline -->
				<div class="absolute top-8 left-0 right-0 h-16">
					{#each allEvents as event}
						{@const startHour = event.startTime.getHours() + event.startTime.getMinutes() / 60}
						{@const duration = event.hours}
						{@const leftPosition = (startHour / 24) * 100}
						{@const width = (duration / 24) * 100}
						<div 
							class="{event.color} absolute h-12 rounded text-white text-xs p-1 overflow-hidden"
							style="left: {leftPosition}%; width: {width}%"
							title={event.title}
						>
							<div class="font-medium truncate">{event.title}</div>
							<div class="opacity-75">
								{event.startTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
	
	<!-- Next up -->
	<div class="mt-4 pt-4 border-t border-surface-300-700 flex items-center gap-4">
		<span class="text-sm font-medium">Next:</span>
		{#if upcomingEvents.length > 0}
			<div class="flex items-center gap-2">
				<div class="{upcomingEvents[0].color} text-white px-2 py-1 rounded text-sm">
					{upcomingEvents[0].title}
				</div>
				<span class="text-sm opacity-75">
					in {Math.floor((upcomingEvents[0].startTime.getTime() - Date.now()) / 60000)} minutes
				</span>
			</div>
		{:else}
			<span class="text-sm opacity-50">No more events today</span>
		{/if}
	</div>
</div>

