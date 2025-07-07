<script lang="ts">
	interface Props {
		currentDate: Date;
		events: any; // Will be typed properly with Convex
	}
	
	let { currentDate, events }: Props = $props();
	
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
			dayEvents.push({ ...e, type: 'work', color: 'bg-blue-500' })
		);
		events.personal.filter(e => e.date.toDateString() === dateStr).forEach(e => 
			dayEvents.push({ ...e, type: 'personal', color: 'bg-green-500' })
		);
		events.chores.filter(e => e.date.toDateString() === dateStr).forEach(e => 
			dayEvents.push({ ...e, type: 'chores', color: 'bg-orange-500' })
		);
		
		return dayEvents.sort((a, b) => a.date.getTime() - b.date.getTime());
	}
	
	let weekDays = $derived(getWeekDays(currentDate));
</script>

<div class="card p-4 h-full flex flex-col">
	<h2 class="text-lg font-semibold mb-3">Week Schedule</h2>
	<div class="grid grid-cols-7 gap-2 flex-1 overflow-auto">
		{#each weekDays as day}
			{@const dayEvents = getDayEvents(day)}
			{@const isToday = day.toDateString() === new Date().toDateString()}
			<div class="border-l-2 {isToday ? 'border-primary-500' : 'border-surface-300-700'} pl-2">
				<div class="font-medium text-sm mb-1">
					{day.toLocaleDateString('en-US', { weekday: 'short' })}
				</div>
				<div class="text-xs opacity-75 mb-2">{day.getDate()}</div>
				
				<div class="space-y-1">
					{#each dayEvents as event}
						<div class="{event.color} text-white text-xs p-1 rounded truncate" title={event.title}>
							{event.title}
						</div>
					{/each}
					{#if dayEvents.length === 0}
						<div class="text-xs opacity-50 italic">Free</div>
					{/if}
				</div>
			</div>
		{/each}
	</div>
</div>