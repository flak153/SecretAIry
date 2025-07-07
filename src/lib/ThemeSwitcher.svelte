<script lang="ts">
	import Icon from './Icon.svelte';
	import { onMount } from 'svelte';
	
	let showDropdown = $state(false);
	let currentTheme = $state('wintry');
	
	const themes = [
		// Clean & Modern
		{ name: 'wintry', label: 'Wintry', colors: ['#3b82f6', '#1e293b'], style: 'modern' },
		{ name: 'rocket', label: 'Rocket', colors: ['#8b5cf6', '#1e1b4b'], style: 'modern' },
		{ name: 'seafoam', label: 'Seafoam', colors: ['#10b981', '#064e3b'], style: 'modern' },
		{ name: 'mint', label: 'Mint', colors: ['#14b8a6', '#042f2e'], style: 'modern' },
		{ name: 'nouveau', label: 'Nouveau', colors: ['#ef4444', '#1f2937'], style: 'modern' },
		
		// Retro & Vintage
		{ name: 'vintage', label: 'Vintage', colors: ['#f59e0b', '#451a03'], style: 'retro' },
		{ name: 'sahara', label: 'Sahara', colors: ['#f97316', '#431407'], style: 'retro' },
		{ name: 'legacy', label: 'Legacy', colors: ['#84cc16', '#1a2e05'], style: 'retro' },
		
		// Bold & Dramatic
		{ name: 'crimson', label: 'Crimson', colors: ['#dc2626', '#450a0a'], style: 'bold' },
		{ name: 'rose', label: 'Rose', colors: ['#f43f5e', '#4c0519'], style: 'bold' },
		{ name: 'cerberus', label: 'Cerberus', colors: ['#f97316', '#18181b'], style: 'bold' },
		{ name: 'fennec', label: 'Fennec', colors: ['#eab308', '#422006'], style: 'bold' },
		
		// Elegant & Professional
		{ name: 'hamlindigo', label: 'Hamlindigo', colors: ['#6366f1', '#1e1b4b'], style: 'elegant' },
		{ name: 'reign', label: 'Reign', colors: ['#a855f7', '#1e1b4b'], style: 'elegant' },
		{ name: 'concord', label: 'Concord', colors: ['#8b5cf6', '#581c87'], style: 'elegant' },
		
		// Unique & Creative
		{ name: 'catppuccin', label: 'Catppuccin', colors: ['#f5c2e7', '#1e1e2e'], style: 'creative' },
		{ name: 'vox', label: 'Vox', colors: ['#f472b6', '#1f2937'], style: 'creative' },
		{ name: 'mona', label: 'Mona', colors: ['#06b6d4', '#083344'], style: 'creative' },
	];
	
	function setTheme(themeName: string) {
		currentTheme = themeName;
		localStorage.setItem('theme', themeName);
		// Set theme on both body and documentElement to ensure it works
		document.body.setAttribute('data-theme', themeName);
		document.documentElement.setAttribute('data-theme', themeName);
		showDropdown = false;
	}
	
	onMount(() => {
		// Get saved theme or default
		const savedTheme = localStorage.getItem('theme') || 'wintry';
		setTheme(savedTheme);
	});
	
	// Close dropdown when clicking outside
	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (!target.closest('.theme-switcher')) {
			showDropdown = false;
		}
	}
	
	$effect(() => {
		if (showDropdown) {
			document.addEventListener('click', handleClickOutside);
			return () => document.removeEventListener('click', handleClickOutside);
		}
	});
</script>

<div class="relative theme-switcher">
	<button
		class="btn btn-sm preset-tonal-surface"
		onclick={() => showDropdown = !showDropdown}
	>
		<Icon name="palette" size={16} />
		<span class="hidden sm:inline ml-2">Theme</span>
	</button>
	
	{#if showDropdown}
		<div class="absolute right-0 mt-2 w-64 bg-surface-100-900 rounded-container-token shadow-xl border border-surface-300-700 z-50">
			<div class="p-2 max-h-96 overflow-y-auto">
				<!-- Modern Themes -->
				<div class="mb-4">
					<h3 class="text-xs font-medium opacity-50 px-3 mb-2">Clean & Modern</h3>
					{#each themes.filter(t => t.style === 'modern') as theme}
						<button
							class="w-full text-left px-3 py-2 rounded hover:bg-surface-200 dark:hover:bg-surface-800 flex items-center gap-3 {currentTheme === theme.name ? 'bg-surface-200 dark:bg-surface-800' : ''}"
							onclick={() => setTheme(theme.name)}
						>
							<div class="flex gap-1">
								{#each theme.colors as color}
									<div 
										class="w-4 h-4 rounded-full" 
										style="background-color: {color}"
									></div>
								{/each}
							</div>
							<span class="text-sm">{theme.label}</span>
						</button>
					{/each}
				</div>
				
				<!-- Retro Themes -->
				<div class="mb-4">
					<h3 class="text-xs font-medium opacity-50 px-3 mb-2">Retro & Vintage</h3>
					{#each themes.filter(t => t.style === 'retro') as theme}
						<button
							class="w-full text-left px-3 py-2 rounded hover:bg-surface-200 dark:hover:bg-surface-800 flex items-center gap-3 {currentTheme === theme.name ? 'bg-surface-200 dark:bg-surface-800' : ''}"
							onclick={() => setTheme(theme.name)}
						>
							<div class="flex gap-1">
								{#each theme.colors as color}
									<div 
										class="w-4 h-4 rounded-full" 
										style="background-color: {color}"
									></div>
								{/each}
							</div>
							<span class="text-sm">{theme.label}</span>
						</button>
					{/each}
				</div>
				
				<!-- Bold Themes -->
				<div class="mb-4">
					<h3 class="text-xs font-medium opacity-50 px-3 mb-2">Bold & Dramatic</h3>
					{#each themes.filter(t => t.style === 'bold') as theme}
						<button
							class="w-full text-left px-3 py-2 rounded hover:bg-surface-200 dark:hover:bg-surface-800 flex items-center gap-3 {currentTheme === theme.name ? 'bg-surface-200 dark:bg-surface-800' : ''}"
							onclick={() => setTheme(theme.name)}
						>
							<div class="flex gap-1">
								{#each theme.colors as color}
									<div 
										class="w-4 h-4 rounded-full" 
										style="background-color: {color}"
									></div>
								{/each}
							</div>
							<span class="text-sm">{theme.label}</span>
						</button>
					{/each}
				</div>
				
				<!-- Elegant Themes -->
				<div class="mb-4">
					<h3 class="text-xs font-medium opacity-50 px-3 mb-2">Elegant & Professional</h3>
					{#each themes.filter(t => t.style === 'elegant') as theme}
						<button
							class="w-full text-left px-3 py-2 rounded hover:bg-surface-200 dark:hover:bg-surface-800 flex items-center gap-3 {currentTheme === theme.name ? 'bg-surface-200 dark:bg-surface-800' : ''}"
							onclick={() => setTheme(theme.name)}
						>
							<div class="flex gap-1">
								{#each theme.colors as color}
									<div 
										class="w-4 h-4 rounded-full" 
										style="background-color: {color}"
									></div>
								{/each}
							</div>
							<span class="text-sm">{theme.label}</span>
						</button>
					{/each}
				</div>
				
				<!-- Creative Themes -->
				<div>
					<h3 class="text-xs font-medium opacity-50 px-3 mb-2">Unique & Creative</h3>
					{#each themes.filter(t => t.style === 'creative') as theme}
						<button
							class="w-full text-left px-3 py-2 rounded hover:bg-surface-200 dark:hover:bg-surface-800 flex items-center gap-3 {currentTheme === theme.name ? 'bg-surface-200 dark:bg-surface-800' : ''}"
							onclick={() => setTheme(theme.name)}
						>
							<div class="flex gap-1">
								{#each theme.colors as color}
									<div 
										class="w-4 h-4 rounded-full" 
										style="background-color: {color}"
									></div>
								{/each}
							</div>
							<span class="text-sm">{theme.label}</span>
						</button>
					{/each}
				</div>
			</div>
		</div>
	{/if}
</div>