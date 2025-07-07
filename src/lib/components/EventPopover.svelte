<script lang="ts">
	import Icon from '$lib/Icon.svelte';
	
	interface Props {
		event: {
			title: string;
			type: 'work' | 'personal' | 'chores';
			date: Date;
			startTime?: Date;
			endTime?: Date;
			hours: number;
			description?: string;
			location?: string;
			attendees?: string[];
			reminders?: string[];
		};
		x: number;
		y: number;
		visible: boolean;
		onHover?: () => void;
		onLeave?: () => void;
	}
	
	let { event, x, y, visible, onHover, onLeave }: Props = $props();
	
	// Get event type label and icon
	function getEventTypeInfo(type: string) {
		switch (type) {
			case 'work':
				return { label: 'Work', icon: 'briefcase' };
			case 'personal':
				return { label: 'Personal', icon: 'user' };
			case 'chores':
				return { label: 'Chores', icon: 'home' };
			default:
				return { label: 'Event', icon: 'calendar' };
		}
	}
	
	let typeInfo = $derived(getEventTypeInfo(event.type));
	
	// Format date and time
	function formatDateTime(date: Date, startTime?: Date, endTime?: Date) {
		const dateStr = date.toLocaleDateString('en-US', { 
			weekday: 'long',
			month: 'long',
			day: 'numeric',
			year: 'numeric'
		});
		
		if (startTime && endTime) {
			const start = startTime.toLocaleTimeString('en-US', { 
				hour: 'numeric', 
				minute: '2-digit' 
			});
			const end = endTime.toLocaleTimeString('en-US', { 
				hour: 'numeric', 
				minute: '2-digit' 
			});
			return { date: dateStr, time: `${start} - ${end}` };
		}
		
		return { date: dateStr, time: `${event.hours} hours` };
	}
	
	let dateTime = $derived(formatDateTime(event.date, event.startTime, event.endTime));
	
	// Calculate position to prevent going above viewport
	let adjustedY = $derived(() => {
		const popoverHeight = 400; // Approximate max height
		const minY = popoverHeight + 20; // Minimum Y to stay on screen
		return Math.max(y, minY);
	});
</script>

{#if visible}
	<div 
		role="tooltip"
		class="event-popover absolute z-50 w-80 max-h-[80vh]"
		style="left: {x}px; top: {adjustedY()}px; transform: translate(-50%, -100%) translateY(-12px);"
		onmouseenter={() => onHover?.()}
		onmouseleave={() => onLeave?.()}
	>
		<div class="card event-{event.type}-popover rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
			<!-- Header with event type color -->
			<div class="event-{event.type} px-4 py-3 text-white flex-shrink-0">
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-2">
						<Icon name={typeInfo.icon} size={16} />
						<span class="text-sm font-medium opacity-90">{typeInfo.label}</span>
					</div>
					<div class="text-xs opacity-75">{event.hours}h</div>
				</div>
				<h3 class="text-lg font-semibold mt-1 line-clamp-2">{event.title}</h3>
			</div>
			
			<!-- Content -->
			<div class="p-4 space-y-3 overflow-y-auto flex-1">
				<!-- Date and Time -->
				<div class="flex items-start gap-3">
					<Icon name="calendar" size={16} class="mt-0.5 opacity-50" />
					<div class="flex-1">
						<div class="text-sm font-medium">{dateTime.date}</div>
						<div class="text-xs opacity-75">{dateTime.time}</div>
					</div>
				</div>
				
				<!-- Location (if provided) -->
				{#if event.location}
					<div class="flex items-start gap-3">
						<Icon name="mapPin" size={16} class="mt-0.5 opacity-50" />
						<div class="flex-1 text-sm">{event.location}</div>
					</div>
				{/if}
				
				<!-- Description (if provided) -->
				{#if event.description}
					<div class="flex items-start gap-3">
						<Icon name="fileText" size={16} class="mt-0.5 opacity-50" />
						<div class="flex-1 text-sm opacity-90 whitespace-pre-wrap break-words">{event.description}</div>
					</div>
				{/if}
				
				<!-- Attendees (if provided) -->
				{#if event.attendees && event.attendees.length > 0}
					<div class="flex items-start gap-3">
						<Icon name="users" size={16} class="mt-0.5 opacity-50" />
						<div class="flex-1">
							<div class="text-xs font-medium opacity-75 mb-1">Attendees</div>
							<div class="flex flex-wrap gap-1">
								{#each event.attendees as attendee}
									<span class="text-xs px-2 py-0.5 rounded-full bg-surface-200 dark:bg-surface-700">
										{attendee}
									</span>
								{/each}
							</div>
						</div>
					</div>
				{/if}
				
				<!-- Reminders (if provided) -->
				{#if event.reminders && event.reminders.length > 0}
					<div class="flex items-start gap-3">
						<Icon name="bell" size={16} class="mt-0.5 opacity-50" />
						<div class="flex-1">
							<div class="text-xs font-medium opacity-75 mb-1">Reminders</div>
							<div class="space-y-1">
								{#each event.reminders as reminder}
									<div class="text-xs opacity-75">{reminder}</div>
								{/each}
							</div>
						</div>
					</div>
				{/if}
			</div>
			
			<!-- Quick Actions -->
			<div class="border-t border-surface-300 dark:border-surface-700 px-4 py-3 flex-shrink-0">
				<div class="flex gap-2">
					<button class="btn btn-sm preset-tonal-surface flex-1 text-xs hover:scale-105 transition-transform">
						<Icon name="pencil" size={14} class="mr-1" />
						Edit
					</button>
					<button class="btn btn-sm preset-tonal-surface flex-1 text-xs hover:scale-105 transition-transform">
						<Icon name="copy" size={14} class="mr-1" />
						Duplicate
					</button>
					<button class="btn btn-sm preset-tonal-error flex-1 text-xs hover:scale-105 transition-transform">
						<Icon name="trash" size={14} class="mr-1" />
						Delete
					</button>
				</div>
			</div>
		</div>
		
		<!-- Arrow pointing down -->
		<div class="absolute left-1/2 -translate-x-1/2 -bottom-2 w-0 h-0 
			border-l-8 border-l-transparent
			border-r-8 border-r-transparent
			border-t-8 border-t-surface-200 dark:border-t-surface-800">
		</div>
	</div>
{/if}

<style>
	.event-popover {
		animation: popover-in 0.2s ease-out;
	}
	
	@keyframes popover-in {
		from {
			opacity: 0;
			transform: translate(-50%, -100%) translateY(-8px) scale(0.95);
		}
		to {
			opacity: 1;
			transform: translate(-50%, -100%) translateY(-12px) scale(1);
		}
	}
	
	/* Glassmorphic popover styles */
	:global([data-style="glassmorphic"]) .event-work-popover {
		background: rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		border: 1px solid rgba(255, 255, 255, 0.2);
	}
	
	:global([data-style="glassmorphic"]) .event-personal-popover {
		background: rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		border: 1px solid rgba(255, 255, 255, 0.2);
	}
	
	:global([data-style="glassmorphic"]) .event-chores-popover {
		background: rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		border: 1px solid rgba(255, 255, 255, 0.2);
	}
	
	/* Custom scrollbar for popover content */
	.overflow-y-auto {
		scrollbar-width: thin;
		scrollbar-color: var(--color-surface-400) transparent;
	}
	
	.overflow-y-auto::-webkit-scrollbar {
		width: 6px;
	}
	
	.overflow-y-auto::-webkit-scrollbar-track {
		background: transparent;
	}
	
	.overflow-y-auto::-webkit-scrollbar-thumb {
		background-color: var(--color-surface-400);
		border-radius: 3px;
	}
	
	.overflow-y-auto::-webkit-scrollbar-thumb:hover {
		background-color: var(--color-surface-500);
	}
	
	/* Ensure line-clamp works */
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>