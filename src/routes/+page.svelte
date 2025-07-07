<script lang="ts">
	import Icon from '$lib/Icon.svelte';
	import ThemeSwitcher from '$lib/ThemeSwitcher.svelte';
	import MonthView from '$lib/components/MonthView.svelte';
	import WeekView from '$lib/components/WeekView.svelte';
	import DayView from '$lib/components/DayView.svelte';
	import AIAssistant from '$lib/components/AIAssistant.svelte';
	import TaskManager from '$lib/components/TaskManagerConvex.svelte';
	import ModeSwitcher from '$lib/components/ModeSwitcher.svelte';
	import ConvexTest from '$lib/components/ConvexTest.svelte';
	import { calendarStore } from '$lib/stores/calendar.svelte';
	import { useQuery } from '$lib/convex.svelte';
	import { api } from '$lib/convex-api';
	
	// Calendar state - single source of truth
	let selectedDate = $state(new Date());
	let showChatbox = $state(true);
	
	// For demo, using hardcoded userId - in production, get from auth
	const userId = "demo-user";
	
	// Query events from Convex
	const startOfMonth = $derived((() => {
		const date = new Date(selectedDate);
		date.setDate(1);
		date.setHours(0, 0, 0, 0);
		return date.toISOString();
	})());
	
	const endOfMonth = $derived((() => {
		const date = new Date(selectedDate);
		date.setMonth(date.getMonth() + 1, 0);
		date.setHours(23, 59, 59, 999);
		return date.toISOString();
	})());
	
	const eventsQuery = useQuery(api.events.getEvents, { 
		userId, 
		startDate: startOfMonth, 
		endDate: endOfMonth 
	});
	
	// Navigation functions
	function navigatePrevMonth() {
		const newDate = new Date(selectedDate);
		newDate.setMonth(newDate.getMonth() - 1);
		newDate.setDate(1); // Go to first day of previous month
		selectedDate = newDate;
	}
	
	function navigateNextMonth() {
		const newDate = new Date(selectedDate);
		newDate.setMonth(newDate.getMonth() + 1);
		newDate.setDate(1); // Go to first day of next month
		selectedDate = newDate;
	}
	
	function navigatePrevWeek() {
		const newDate = new Date(selectedDate);
		newDate.setDate(newDate.getDate() - 7);
		selectedDate = newDate;
	}
	
	function navigateNextWeek() {
		const newDate = new Date(selectedDate);
		newDate.setDate(newDate.getDate() + 7);
		selectedDate = newDate;
	}
	
	function navigatePrevDay() {
		const newDate = new Date(selectedDate);
		newDate.setDate(newDate.getDate() - 1);
		selectedDate = newDate;
	}
	
	function navigateNextDay() {
		const newDate = new Date(selectedDate);
		newDate.setDate(newDate.getDate() + 1);
		selectedDate = newDate;
	}
	
	function navigateToday() {
		selectedDate = new Date();
	}
	
	function handleSelectDate(date: Date) {
		selectedDate = date;
	}
	
	// Format helpers
	function formatMonthYear(date: Date) {
		return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
	}
	
	function getWeekNumber(date: Date) {
		const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
		const dayNum = d.getUTCDay() || 7;
		d.setUTCDate(d.getUTCDate() + 4 - dayNum);
		const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
		return Math.ceil((((d - yearStart) / 86400000) + 1)/7);
	}
	
	function formatDayDate(date: Date) {
		return date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
	}
	
	// Transform Convex events to the expected format
	let events = $derived(
		eventsQuery.loading || !eventsQuery.value
			? (calendarStore.events.length > 0 ? calendarStore.getEventsByCalendar() : {
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
			})
			: (() => {
				// Transform Convex events
				const convexEvents = eventsQuery.value || [];
				const work = convexEvents.filter(e => e.calendar === 'work').map(e => ({
					date: new Date(e.startTime),
					hours: calculateHours(e),
					title: e.title,
					startTime: e.startTime,
					endTime: e.endTime,
					allDay: e.allDay,
					location: e.location,
					description: e.description
				}));
				
				const personal = convexEvents.filter(e => e.calendar === 'personal').map(e => ({
					date: new Date(e.startTime),
					hours: calculateHours(e),
					title: e.title,
					startTime: e.startTime,
					endTime: e.endTime,
					allDay: e.allDay,
					location: e.location,
					description: e.description
				}));
				
				return { work, personal, chores: [] };
			})()
	);
	
	function calculateHours(event: any): number {
		if (event.allDay) return 8;
		const start = new Date(event.startTime);
		const end = new Date(event.endTime);
		return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
	}
</script>

<div class="h-screen flex flex-col bg-surface-50 dark:bg-surface-950">
	<!-- Header -->
	<header class="border-b border-surface-300 dark:border-surface-700 bg-surface-100 dark:bg-surface-900">
		<div class="container mx-auto px-4 py-3">
			<div class="flex items-center justify-between">
				<!-- Navigation -->
				<div class="flex items-center gap-2">
					<div class="flex items-center gap-1">
						<button class="btn btn-sm preset-tonal-surface" onclick={navigatePrevMonth}>
							<Icon name="chevronLeft" size={16} />
						</button>
						<button class="btn btn-sm preset-filled-primary-500 px-4" onclick={navigateToday}>
							{formatMonthYear(selectedDate)}
						</button>
						<button class="btn btn-sm preset-tonal-surface" onclick={navigateNextMonth}>
							<Icon name="chevronRight" size={16} />
						</button>
					</div>
					
					<div class="w-px h-6 bg-surface-300 dark:bg-surface-700 mx-2"></div>
					
					<div class="flex items-center gap-1">
						<button class="btn btn-sm preset-tonal-surface" onclick={navigatePrevWeek}>
							<Icon name="chevronLeft" size={14} />
						</button>
						<span class="text-sm px-2 font-medium">Week {getWeekNumber(selectedDate)}</span>
						<button class="btn btn-sm preset-tonal-surface" onclick={navigateNextWeek}>
							<Icon name="chevronRight" size={14} />
						</button>
					</div>
					
					<div class="flex items-center gap-1">
						<button class="btn btn-sm preset-tonal-surface" onclick={navigatePrevDay}>
							<Icon name="chevronLeft" size={14} />
						</button>
						<span class="text-sm px-2 font-medium">{formatDayDate(selectedDate)}</span>
						<button class="btn btn-sm preset-tonal-surface" onclick={navigateNextDay}>
							<Icon name="chevronRight" size={14} />
						</button>
					</div>
				</div>
				
				<!-- Actions -->
				<div class="flex items-center gap-2">
					<ModeSwitcher />
				</div>
			</div>
		</div>
	</header>
	
	<!-- Main Content Grid -->
	<div class="flex-1 flex overflow-hidden">
		<div class="flex-1 grid grid-rows-[1fr_200px] gap-4 p-4 overflow-hidden">
			<!-- Top Row: Month View and Week/Task stacked -->
			<div class="grid grid-cols-[2fr_3fr] gap-4 min-h-0">
				<MonthView currentDate={selectedDate} {selectedDate} onSelectDate={handleSelectDate} events={events} />
				<div class="grid grid-rows-2 gap-4 min-h-0">
					<WeekView currentDate={selectedDate} events={events} />
					<TaskManager />
				</div>
			</div>
			
			<!-- Bottom Row: Day View -->
			<DayView events={events} selectedDate={selectedDate} />
		</div>
		
		<!-- Right Sidebar: AI Assistant -->
		{#if showChatbox}
			<aside class="w-80 h-full border-l border-surface-300 dark:border-surface-700 transition-all duration-300 pl-4 pr-2 py-2">
				<AIAssistant isOpen={true} />
			</aside>
		{/if}
	</div>
</div>