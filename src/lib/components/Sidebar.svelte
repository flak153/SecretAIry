<script lang="ts">
	import Icon from '$lib/Icon.svelte';
	
	let isExpanded = $state(false);
	let currentPath = $state('/');
	
	// Navigation items
	const navItems = [
		{ icon: 'calendar', label: 'Calendar', path: '/' },
		{ icon: 'settings', label: 'Settings', path: '/settings' },
		{ icon: 'users', label: 'Contacts', path: '/contacts' },
		{ icon: 'pieChart', label: 'Analytics', path: '/analytics' },
		{ icon: 'bell', label: 'Notifications', path: '/notifications' },
	];
	
	// Check if we're in the browser
	$effect(() => {
		if (typeof window !== 'undefined') {
			currentPath = window.location.pathname;
		}
	});
</script>

<nav 
	class="fixed left-0 top-0 h-screen bg-surface-100 dark:bg-surface-900 border-r border-surface-300 dark:border-surface-700 transition-all duration-300 z-20"
	class:w-16={!isExpanded}
	class:w-64={isExpanded}
	onmouseenter={() => isExpanded = true}
	onmouseleave={() => isExpanded = false}
>
	<div class="flex flex-col h-full">
		<!-- Logo/Brand -->
		<div class="h-16 flex items-center px-4 border-b border-surface-300 dark:border-surface-700">
			<div class="flex items-center gap-3">
				<div class="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center flex-shrink-0">
					<span class="text-white font-bold">S</span>
				</div>
				{#if isExpanded}
					<span class="text-lg font-semibold">Secretairy</span>
				{/if}
			</div>
		</div>
		
		<!-- Navigation Items -->
		<div class="flex-1 py-4">
			{#each navItems as item}
				<a
					href={item.path}
					class="flex items-center gap-3 px-4 py-3 hover:bg-surface-200 dark:hover:bg-surface-800 transition-colors {currentPath === item.path ? 'bg-surface-200 dark:bg-surface-800 border-l-2 border-primary-500' : ''}"
				>
					<Icon name={item.icon} size={20} class="flex-shrink-0" />
					{#if isExpanded}
						<span class="text-sm font-medium">{item.label}</span>
					{/if}
				</a>
			{/each}
		</div>
		
		<!-- User Profile (optional) -->
		<div class="p-4 border-t border-surface-300 dark:border-surface-700">
			<div class="flex items-center gap-3">
				<div class="w-8 h-8 bg-surface-300 dark:bg-surface-700 rounded-full flex items-center justify-center flex-shrink-0">
					<span class="text-xs font-medium">JD</span>
				</div>
				{#if isExpanded}
					<div class="flex-1 min-w-0">
						<p class="text-sm font-medium truncate">John Doe</p>
						<p class="text-xs opacity-75 truncate">john@example.com</p>
					</div>
				{/if}
			</div>
		</div>
	</div>
</nav>

<style>
	.w-16 {
		width: 4rem;
	}
	
	.w-64 {
		width: 16rem;
	}
	
	.w-8 {
		width: 2rem;
	}
	
	.h-8 {
		height: 2rem;
	}
</style>