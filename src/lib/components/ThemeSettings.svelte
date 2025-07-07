<script lang="ts">
	import { onMount } from 'svelte';
	
	let currentTheme = $state('wintry');
	let currentStyle = $state('glassmorphic');
	let useColorAccents = $state(true);
	let glassIntensity = $state(50); // 0-100 scale
	let accentIntensity = $state(30); // 0-100 scale for gradient mixing
	
	const themes = [
		// Clean & Modern
		{ name: 'wintry', label: 'Wintry', colors: ['#3b82f6', '#1e293b'], style: 'modern' },
		{ name: 'rocket', label: 'Rocket', colors: ['#8b5cf6', '#1e1b4b'], style: 'modern' },
		{ name: 'seafoam', label: 'Seafoam', colors: ['#10b981', '#064e3b'], style: 'modern' },
		{ name: 'mint', label: 'Mint', colors: ['#14b8a6', '#042f2e'], style: 'modern' },
		{ name: 'nouveau', label: 'Nouveau', colors: ['#ef4444', '#1f2937'], style: 'modern' },
		{ name: 'modern', label: 'Modern', colors: ['#ec4899', '#3b82f6'], style: 'modern' },
		
		// Retro & Vintage
		{ name: 'vintage', label: 'Vintage', colors: ['#f59e0b', '#451a03'], style: 'retro' },
		{ name: 'sahara', label: 'Sahara', colors: ['#f97316', '#431407'], style: 'retro' },
		{ name: 'legacy', label: 'Legacy', colors: ['#84cc16', '#1a2e05'], style: 'retro' },
		{ name: 'nosh', label: 'Nosh', colors: ['#dc2626', '#fef3c7'], style: 'retro' },
		
		// Bold & Dramatic
		{ name: 'crimson', label: 'Crimson', colors: ['#dc2626', '#450a0a'], style: 'bold' },
		{ name: 'rose', label: 'Rose', colors: ['#f43f5e', '#4c0519'], style: 'bold' },
		{ name: 'cerberus', label: 'Cerberus', colors: ['#7c3aed', '#dc2626'], style: 'bold' },
		{ name: 'fennec', label: 'Fennec', colors: ['#eab308', '#422006'], style: 'bold' },
		
		// Elegant & Professional
		{ name: 'hamlindigo', label: 'Hamlindigo', colors: ['#6366f1', '#1e1b4b'], style: 'elegant' },
		{ name: 'reign', label: 'Reign', colors: ['#facc15', '#6b7280'], style: 'elegant' },
		{ name: 'concord', label: 'Concord', colors: ['#8b5cf6', '#581c87'], style: 'elegant' },
		
		// Unique & Creative
		{ name: 'catppuccin', label: 'Catppuccin', colors: ['#f5c2e7', '#1e1e2e'], style: 'creative' },
		{ name: 'vox', label: 'Vox', colors: ['#f472b6', '#1f2937'], style: 'creative' },
		{ name: 'mona', label: 'Mona', colors: ['#06b6d4', '#083344'], style: 'creative' },
		{ name: 'pine', label: 'Pine', colors: ['#84cc16', '#991b1b'], style: 'creative' },
		{ name: 'terminus', label: 'Terminus', colors: ['#8b5cf6', '#06b6d4'], style: 'creative' },
	];
	
	const styles = [
		{ 
			name: 'glassmorphic', 
			label: 'Glassmorphic',
			description: 'Frosted glass effects with blur and transparency'
		},
		// { 
		// 	name: 'default', 
		// 	label: 'Default',
		// 	description: 'Clean and simple interface'
		// },
		// { 
		// 	name: 'material', 
		// 	label: 'Material Design',
		// 	description: 'Google Material Design inspired with shadows and depth'
		// },
		// { 
		// 	name: 'brutalist', 
		// 	label: 'Brutalist',
		// 	description: 'Bold, harsh lines and strong contrasts'
		// },
		// { 
		// 	name: 'neumorphic', 
		// 	label: 'Neumorphic',
		// 	description: 'Soft, extruded plastic look with inset shadows'
		// },
	];
	
	function setTheme(themeName: string) {
		currentTheme = themeName;
		localStorage.setItem('theme', themeName);
		// Set theme on both body and documentElement to ensure it works
		document.body.setAttribute('data-theme', themeName);
		document.documentElement.setAttribute('data-theme', themeName);
	}
	
	function setStyle(styleName: string) {
		currentStyle = styleName;
		localStorage.setItem('style', styleName);
		
		// Set the data-style attribute on the documentElement
		document.documentElement.setAttribute('data-style', styleName);
		document.body.setAttribute('data-style', styleName);
	}
	
	// Remove old color accents function since we're using intensity slider now
	
	function setGlassIntensity(value: number) {
		glassIntensity = value;
		localStorage.setItem('glassIntensity', value.toString());
		document.documentElement.style.setProperty('--glass-intensity', value.toString());
	}
	
	function setAccentIntensity(value: number) {
		accentIntensity = value;
		localStorage.setItem('accentIntensity', value.toString());
		document.documentElement.style.setProperty('--accent-intensity', value.toString());
	}

	onMount(() => {
		const savedTheme = localStorage.getItem('theme') || 'wintry';
		const savedStyle = localStorage.getItem('style') || 'glassmorphic';
		const savedIntensity = parseInt(localStorage.getItem('glassIntensity') || '50');
		const savedAccentIntensity = parseInt(localStorage.getItem('accentIntensity') || '30');
		setTheme(savedTheme);
		setStyle(savedStyle);
		setGlassIntensity(savedIntensity);
		setAccentIntensity(savedAccentIntensity);
	});
</script>

<div class="space-y-8">
	<!-- Style Selection -->
	<div>
		<h3 class="text-lg font-semibold mb-4">Interface Style</h3>
		<div class="flex items-start gap-4">
			<!-- Glassmorphic Style Button -->
			{#each styles as style}
				<button
					class="flex-1 text-left p-4 rounded-container-token border-2 transition-all {currentStyle === style.name ? 'border-primary-500 bg-surface-200-800' : 'border-surface-300-700 hover:border-surface-400-600'}"
					onclick={() => setStyle(style.name)}
				>
					<h4 class="font-medium mb-1">{style.label}</h4>
					<p class="text-sm opacity-75">{style.description}</p>
				</button>
			{/each}
			
			<!-- Glassmorphic Options (only for glassmorphic) -->
			{#if currentStyle === 'glassmorphic'}
				<div class="flex-1 space-y-4">
					<!-- Glass Intensity Slider -->
					<div class="p-4 rounded-container-token border-2 border-surface-300-700">
						<div class="space-y-2">
							<div class="flex items-center justify-between">
								<h4 class="font-medium">Glass Intensity</h4>
								<span class="text-sm font-mono bg-surface-200 dark:bg-surface-700 px-2 py-1 rounded">
									{glassIntensity}%
								</span>
							</div>
							<p class="text-sm opacity-75 mb-3">Control blur and transparency effects</p>
							<input
								type="range"
								min="0"
								max="100"
								step="5"
								bind:value={glassIntensity}
								oninput={() => setGlassIntensity(glassIntensity)}
								class="slider w-full"
							/>
							<div class="flex justify-between text-xs opacity-50">
								<span>Subtle</span>
								<span>Intense</span>
							</div>
						</div>
					</div>
					
					<!-- Color Accent Intensity Slider -->
					<div class="p-4 rounded-container-token border-2 border-surface-300-700">
						<div class="space-y-2">
							<div class="flex items-center justify-between">
								<h4 class="font-medium">Color Accents</h4>
								<span class="text-sm font-mono bg-surface-200 dark:bg-surface-700 px-2 py-1 rounded">
									{accentIntensity}%
								</span>
							</div>
							<p class="text-sm opacity-75 mb-3">Mix theme colors into backgrounds</p>
							<input
								type="range"
								min="0"
								max="100"
								step="5"
								bind:value={accentIntensity}
								oninput={() => setAccentIntensity(accentIntensity)}
								class="slider w-full"
							/>
							<div class="flex justify-between text-xs opacity-50">
								<span>None</span>
								<span>Vibrant</span>
							</div>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>
	
	<!-- Theme Colors -->
	<div>
		<h3 class="text-lg font-semibold mb-4">Color Theme</h3>
		
		<!-- Modern Themes -->
		<div class="mb-6">
			<h4 class="text-sm font-medium opacity-50 mb-3">Clean & Modern</h4>
			<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
				{#each themes.filter(t => t.style === 'modern') as theme}
					<button
						class="p-3 rounded-container-token border-2 transition-all {currentTheme === theme.name ? 'border-primary-500' : 'border-surface-300-700 hover:border-surface-400-600'}"
						onclick={() => setTheme(theme.name)}
					>
						<div class="flex gap-1 mb-2 justify-center">
							{#each theme.colors as color}
								<div 
									class="w-6 h-6 rounded-full" 
									style="background-color: {color}"
								></div>
							{/each}
						</div>
						<span class="text-sm">{theme.label}</span>
					</button>
				{/each}
			</div>
		</div>
		
		<!-- Retro Themes -->
		<div class="mb-6">
			<h4 class="text-sm font-medium opacity-50 mb-3">Retro & Vintage</h4>
			<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
				{#each themes.filter(t => t.style === 'retro') as theme}
					<button
						class="p-3 rounded-container-token border-2 transition-all {currentTheme === theme.name ? 'border-primary-500' : 'border-surface-300-700 hover:border-surface-400-600'}"
						onclick={() => setTheme(theme.name)}
					>
						<div class="flex gap-1 mb-2 justify-center">
							{#each theme.colors as color}
								<div 
									class="w-6 h-6 rounded-full" 
									style="background-color: {color}"
								></div>
							{/each}
						</div>
						<span class="text-sm">{theme.label}</span>
					</button>
				{/each}
			</div>
		</div>
		
		<!-- Bold Themes -->
		<div class="mb-6">
			<h4 class="text-sm font-medium opacity-50 mb-3">Bold & Dramatic</h4>
			<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
				{#each themes.filter(t => t.style === 'bold') as theme}
					<button
						class="p-3 rounded-container-token border-2 transition-all {currentTheme === theme.name ? 'border-primary-500' : 'border-surface-300-700 hover:border-surface-400-600'}"
						onclick={() => setTheme(theme.name)}
					>
						<div class="flex gap-1 mb-2 justify-center">
							{#each theme.colors as color}
								<div 
									class="w-6 h-6 rounded-full" 
									style="background-color: {color}"
								></div>
							{/each}
						</div>
						<span class="text-sm">{theme.label}</span>
					</button>
				{/each}
			</div>
		</div>
		
		<!-- Elegant Themes -->
		<div class="mb-6">
			<h4 class="text-sm font-medium opacity-50 mb-3">Elegant & Professional</h4>
			<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
				{#each themes.filter(t => t.style === 'elegant') as theme}
					<button
						class="p-3 rounded-container-token border-2 transition-all {currentTheme === theme.name ? 'border-primary-500' : 'border-surface-300-700 hover:border-surface-400-600'}"
						onclick={() => setTheme(theme.name)}
					>
						<div class="flex gap-1 mb-2 justify-center">
							{#each theme.colors as color}
								<div 
									class="w-6 h-6 rounded-full" 
									style="background-color: {color}"
								></div>
							{/each}
						</div>
						<span class="text-sm">{theme.label}</span>
					</button>
				{/each}
			</div>
		</div>
		
		<!-- Creative Themes -->
		<div>
			<h4 class="text-sm font-medium opacity-50 mb-3">Unique & Creative</h4>
			<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
				{#each themes.filter(t => t.style === 'creative') as theme}
					<button
						class="p-3 rounded-container-token border-2 transition-all {currentTheme === theme.name ? 'border-primary-500' : 'border-surface-300-700 hover:border-surface-400-600'}"
						onclick={() => setTheme(theme.name)}
					>
						<div class="flex gap-1 mb-2 justify-center">
							{#each theme.colors as color}
								<div 
									class="w-6 h-6 rounded-full" 
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
</div>

