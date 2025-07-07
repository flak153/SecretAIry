<script lang="ts">
	import Icon from '$lib/Icon.svelte';
	import ThemeSwitcher from '$lib/ThemeSwitcher.svelte';
	import MonthView from '$lib/components/MonthView.svelte';
	import WeekView from '$lib/components/WeekView.svelte';
	import DayView from '$lib/components/DayView.svelte';
	import AIAssistant from '$lib/components/AIAssistant.svelte';
	
	// Calendar state
	let currentDate = $state(new Date());
	let selectedDate = $state(new Date());
	let showChatbox = $state(true);
	
	// Navigation functions
	function navigatePrev() {
		const newDate = new Date(currentDate);
		newDate.setMonth(newDate.getMonth() - 1);
		currentDate = newDate;
	}
	
	function navigateNext() {
		const newDate = new Date(currentDate);
		newDate.setMonth(newDate.getMonth() + 1);
		currentDate = newDate;
	}
	
	function navigateToday() {
		currentDate = new Date();
		selectedDate = new Date();
	}
	
	function handleSelectDate(date: Date) {
		selectedDate = date;
	}
	
	// Format helpers
	function formatMonthYear(date: Date) {
		return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
	}
	
	// Mock events (will be replaced with Convex data)
	const mockEvents = {
		work: [
			{ date: new Date(), hours: 6, title: 'Client meetings' },
			{ date: new Date(Date.now() + 86400000), hours: 8, title: 'Project development' },
			{ date: new Date(Date.now() + 172800000), hours: 4, title: 'Team standup' },
		],
		personal: [
			{ date: new Date(), hours: 2, title: 'Gym' },
			{ date: new Date(), hours: 1, title: 'Lunch with Sarah' },
			{ date: new Date(Date.now() + 86400000), hours: 3, title: 'Shopping' },
		],
		chores: [
			{ date: new Date(), hours: 1, title: 'Grocery shopping' },
			{ date: new Date(Date.now() + 172800000), hours: 2, title: 'House cleaning' },
		]
	};
</script>

<div class="h-screen flex flex-col bg-surface-50 dark:bg-surface-950">
	<!-- Header -->
	<header class="border-b border-surface-300 dark:border-surface-700 bg-surface-100 dark:bg-surface-900">
		<div class="container mx-auto px-4 py-3">
			<div class="flex items-center justify-between">
				<!-- Navigation -->
				<div class="flex items-center gap-2">
					<button class="btn btn-sm preset-tonal-surface" onclick={navigatePrev}>
						<Icon name="chevronLeft" size={16} />
					</button>
					<button class="btn btn-sm preset-filled-primary-500" onclick={navigateToday}>Today</button>
					<button class="btn btn-sm preset-tonal-surface" onclick={navigateNext}>
						<Icon name="chevronRight" size={16} />
					</button>
					
					<span class="ml-4 font-medium">{formatMonthYear(currentDate)}</span>
				</div>
				
				<!-- Actions -->
				<div class="flex items-center gap-2">
					<button class="btn btn-sm preset-tonal-surface" onclick={() => showChatbox = !showChatbox}>
						<Icon name="message" size={16} class="mr-2" />
						AI Assistant
					</button>
				</div>
			</div>
		</div>
	</header>
	
	<!-- Main Content Grid -->
	<div class="flex-1 flex overflow-hidden">
		<div class="flex-1 grid grid-rows-[1fr_200px] gap-4 p-4 overflow-hidden">
			<!-- Top Row: Month and Week Views -->
			<div class="grid grid-cols-[2fr_3fr] gap-4 overflow-hidden">
				<MonthView {currentDate} {selectedDate} onSelectDate={handleSelectDate} events={mockEvents} />
				<WeekView {currentDate} events={mockEvents} />
			</div>
			
			<!-- Bottom Row: Day View -->
			<DayView events={mockEvents} />
		</div>
		
		<!-- AI Assistant Sidebar -->
		<AIAssistant isOpen={showChatbox} />
	</div>
</div>