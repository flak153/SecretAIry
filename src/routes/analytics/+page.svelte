<script lang="ts">
	import Icon from '$lib/Icon.svelte';
	
	// Mock data for analytics
	const timeAllocation = {
		work: 45,
		personal: 30,
		chores: 25
	};
	
	const weeklyHours = [
		{ day: 'Mon', work: 8, personal: 2, chores: 1 },
		{ day: 'Tue', work: 7, personal: 3, chores: 2 },
		{ day: 'Wed', work: 9, personal: 1, chores: 1 },
		{ day: 'Thu', work: 6, personal: 4, chores: 2 },
		{ day: 'Fri', work: 8, personal: 3, chores: 1 },
		{ day: 'Sat', work: 2, personal: 6, chores: 3 },
		{ day: 'Sun', work: 0, personal: 5, chores: 4 }
	];
	
	const productivityScore = 78;
	const tasksCompleted = 23;
	const meetingsAttended = 12;
	const freeTimeHours = 14;
	
	// Calculate percentages for pie chart
	const total = timeAllocation.work + timeAllocation.personal + timeAllocation.chores;
	const workPercentage = (timeAllocation.work / total) * 100;
	const personalPercentage = (timeAllocation.personal / total) * 100;
	const choresPercentage = (timeAllocation.chores / total) * 100;
	
	// For the circular progress chart
	const circumference = 2 * Math.PI * 40; // radius = 40
	const strokeDashoffset = circumference - (productivityScore / 100) * circumference;
	
	// Calculate pie chart paths
	function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
		const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
		return {
			x: centerX + (radius * Math.cos(angleInRadians)),
			y: centerY + (radius * Math.sin(angleInRadians))
		};
	}
	
	function describeArc(x, y, radius, startAngle, endAngle) {
		const start = polarToCartesian(x, y, radius, endAngle);
		const end = polarToCartesian(x, y, radius, startAngle);
		const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
		return [
			"M", start.x, start.y,
			"A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
		].join(" ");
	}
	
	// Calculate angles for pie slices
	const workAngle = (workPercentage / 100) * 360;
	const personalAngle = (personalPercentage / 100) * 360;
	const choresAngle = (choresPercentage / 100) * 360;
</script>

<div class="container mx-auto p-6 space-y-6">
	<!-- Header -->
	<div class="flex justify-between items-center mb-8">
		<div>
			<h1 class="text-3xl font-bold">Analytics Dashboard</h1>
			<p class="text-surface-600 dark:text-surface-400 mt-1">Track your time and productivity</p>
		</div>
		<div class="flex gap-2">
			<button class="btn btn-sm preset-tonal-surface">This Week</button>
			<button class="btn btn-sm preset-tonal-surface">This Month</button>
			<button class="btn btn-sm preset-tonal-surface">This Year</button>
		</div>
	</div>
	
	<!-- Stats Cards -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
		<div class="card preset-filled-surface-100-900 p-6">
			<div class="flex items-start justify-between">
				<div>
					<p class="text-sm text-surface-600 dark:text-surface-400">Productivity Score</p>
					<p class="text-3xl font-bold mt-2">{productivityScore}%</p>
					<p class="text-xs text-green-600 dark:text-green-400 mt-1">↑ 5% from last week</p>
				</div>
				<div class="w-12 h-12 rounded-full bg-primary-500/10 flex items-center justify-center">
					<Icon name="pieChart" size={24} class="text-primary-500" />
				</div>
			</div>
		</div>
		
		<div class="card preset-filled-surface-100-900 p-6">
			<div class="flex items-start justify-between">
				<div>
					<p class="text-sm text-surface-600 dark:text-surface-400">Tasks Completed</p>
					<p class="text-3xl font-bold mt-2">{tasksCompleted}</p>
					<p class="text-xs text-surface-600 dark:text-surface-400 mt-1">This week</p>
				</div>
				<div class="w-12 h-12 rounded-full bg-secondary-500/10 flex items-center justify-center">
					<svg class="w-6 h-6 text-secondary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
					</svg>
				</div>
			</div>
		</div>
		
		<div class="card preset-filled-surface-100-900 p-6">
			<div class="flex items-start justify-between">
				<div>
					<p class="text-sm text-surface-600 dark:text-surface-400">Meetings</p>
					<p class="text-3xl font-bold mt-2">{meetingsAttended}</p>
					<p class="text-xs text-surface-600 dark:text-surface-400 mt-1">This week</p>
				</div>
				<div class="w-12 h-12 rounded-full bg-tertiary-500/10 flex items-center justify-center">
					<Icon name="users" size={24} class="text-tertiary-500" />
				</div>
			</div>
		</div>
		
		<div class="card preset-filled-surface-100-900 p-6">
			<div class="flex items-start justify-between">
				<div>
					<p class="text-sm text-surface-600 dark:text-surface-400">Free Time</p>
					<p class="text-3xl font-bold mt-2">{freeTimeHours}h</p>
					<p class="text-xs text-red-600 dark:text-red-400 mt-1">↓ 2h from last week</p>
				</div>
				<div class="w-12 h-12 rounded-full bg-success-500/10 flex items-center justify-center">
					<svg class="w-6 h-6 text-success-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
				</div>
			</div>
		</div>
	</div>
	
	<!-- Charts Row -->
	<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
		<!-- Time Allocation Pie Chart -->
		<div class="card preset-filled-surface-100-900 p-6">
			<h3 class="text-lg font-semibold mb-4">Time Allocation</h3>
			<div class="relative h-64 flex items-center justify-center">
				<!-- Simple bar chart representation -->
				<div class="flex flex-col gap-4 w-full max-w-sm">
					<div class="space-y-1">
						<div class="flex justify-between text-sm">
							<span>Work</span>
							<span>{timeAllocation.work}h</span>
						</div>
						<div class="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-8 overflow-hidden">
							<div 
								class="h-full bg-primary-500 transition-all duration-500"
								style="width: {workPercentage}%"
							></div>
						</div>
					</div>
					<div class="space-y-1">
						<div class="flex justify-between text-sm">
							<span>Personal</span>
							<span>{timeAllocation.personal}h</span>
						</div>
						<div class="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-8 overflow-hidden">
							<div 
								class="h-full bg-secondary-500 transition-all duration-500"
								style="width: {personalPercentage}%"
							></div>
						</div>
					</div>
					<div class="space-y-1">
						<div class="flex justify-between text-sm">
							<span>Chores</span>
							<span>{timeAllocation.chores}h</span>
						</div>
						<div class="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-8 overflow-hidden">
							<div 
								class="h-full bg-tertiary-500 transition-all duration-500"
								style="width: {choresPercentage}%"
							></div>
						</div>
					</div>
				</div>
			</div>
		</div>
		
		<!-- Weekly Activity Chart -->
		<div class="card preset-filled-surface-100-900 p-6 lg:col-span-2">
			<h3 class="text-lg font-semibold mb-4">Weekly Activity</h3>
			<div class="h-64 relative">
				<div class="absolute inset-0 flex items-end justify-between gap-2">
					{#each weeklyHours as day}
						{@const maxHeight = 12}
						{@const workHeight = (day.work / maxHeight) * 100}
						{@const personalHeight = (day.personal / maxHeight) * 100}
						{@const choresHeight = (day.chores / maxHeight) * 100}
						<div class="flex-1 flex flex-col items-center gap-1">
							<div class="w-full flex flex-col gap-1" style="height: 100%">
								<div 
									class="w-full bg-tertiary-500 rounded-t transition-all hover:opacity-80"
									style="height: {choresHeight}%; margin-top: auto"
									title="{day.chores}h chores"
								></div>
								<div 
									class="w-full bg-secondary-500 transition-all hover:opacity-80"
									style="height: {personalHeight}%"
									title="{day.personal}h personal"
								></div>
								<div 
									class="w-full bg-primary-500 rounded-b transition-all hover:opacity-80"
									style="height: {workHeight}%"
									title="{day.work}h work"
								></div>
							</div>
							<span class="text-xs text-surface-600 dark:text-surface-400 mt-2">{day.day}</span>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
	
	<!-- Insights Section -->
	<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
		<div class="card preset-filled-surface-100-900 p-6">
			<h3 class="text-lg font-semibold mb-4">Productivity Insights</h3>
			<div class="space-y-4">
				<div class="flex items-start gap-3">
					<div class="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
					<div>
						<p class="font-medium">Most productive day: Wednesday</p>
						<p class="text-sm text-surface-600 dark:text-surface-400">You completed 8 tasks and attended 3 meetings</p>
					</div>
				</div>
				<div class="flex items-start gap-3">
					<div class="w-2 h-2 rounded-full bg-yellow-500 mt-2"></div>
					<div>
						<p class="font-medium">Time optimization opportunity</p>
						<p class="text-sm text-surface-600 dark:text-surface-400">Consider batching similar tasks on Tuesday mornings</p>
					</div>
				</div>
				<div class="flex items-start gap-3">
					<div class="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
					<div>
						<p class="font-medium">Work-life balance</p>
						<p class="text-sm text-surface-600 dark:text-surface-400">You're maintaining a healthy 45/55 work-personal ratio</p>
					</div>
				</div>
			</div>
		</div>
		
		<div class="card preset-filled-surface-100-900 p-6">
			<h3 class="text-lg font-semibold mb-4">Upcoming Recommendations</h3>
			<div class="space-y-4">
				<div class="flex items-start gap-3">
					<div class="w-8 h-8 rounded-full bg-primary-500/10 flex items-center justify-center flex-shrink-0">
						<Icon name="calendar" size={16} class="text-primary-500" />
					</div>
					<div>
						<p class="font-medium">Schedule focus time</p>
						<p class="text-sm text-surface-600 dark:text-surface-400">Block 2-3 hours tomorrow morning for deep work</p>
					</div>
				</div>
				<div class="flex items-start gap-3">
					<div class="w-8 h-8 rounded-full bg-secondary-500/10 flex items-center justify-center flex-shrink-0">
						<Icon name="users" size={16} class="text-secondary-500" />
					</div>
					<div>
						<p class="font-medium">Meeting optimization</p>
						<p class="text-sm text-surface-600 dark:text-surface-400">Consider making Thursday's standup async</p>
					</div>
				</div>
				<div class="flex items-start gap-3">
					<div class="w-8 h-8 rounded-full bg-tertiary-500/10 flex items-center justify-center flex-shrink-0">
						<svg class="w-4 h-4 text-tertiary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
						</svg>
					</div>
					<div>
						<p class="font-medium">Productivity trend</p>
						<p class="text-sm text-surface-600 dark:text-surface-400">Your efficiency peaks between 9-11 AM</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	/* Custom animations for charts */
</style>