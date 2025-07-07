<script lang="ts">
	import { onMount } from 'svelte';
	
	let currentTheme = $state('wintry');
	let currentStyle = $state('default');
	
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
	
	const styles = [
		{ 
			name: 'default', 
			label: 'Default',
			description: 'Clean and simple interface'
		},
		{ 
			name: 'glassmorphic', 
			label: 'Glassmorphic',
			description: 'Frosted glass effects with blur and transparency'
		},
		{ 
			name: 'material', 
			label: 'Material Design',
			description: 'Google Material Design inspired with shadows and depth'
		},
		{ 
			name: 'brutalist', 
			label: 'Brutalist',
			description: 'Bold, harsh lines and strong contrasts'
		},
		{ 
			name: 'neumorphic', 
			label: 'Neumorphic',
			description: 'Soft, extruded plastic look with inset shadows'
		},
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
	
	onMount(() => {
		const savedTheme = localStorage.getItem('theme') || 'wintry';
		const savedStyle = localStorage.getItem('style') || 'default';
		setTheme(savedTheme);
		setStyle(savedStyle);
	});
</script>

<div class="space-y-8">
	<!-- Style Selection -->
	<div>
		<h3 class="text-lg font-semibold mb-4">Interface Style</h3>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			{#each styles as style}
				<button
					class="text-left p-4 rounded-container-token border-2 transition-all {currentStyle === style.name ? 'border-primary-500 bg-surface-200-800' : 'border-surface-300-700 hover:border-surface-400-600'}"
					onclick={() => setStyle(style.name)}
				>
					<h4 class="font-medium mb-1">{style.label}</h4>
					<p class="text-sm opacity-75">{style.description}</p>
				</button>
			{/each}
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
	
	<!-- Preview -->
	<div>
		<h3 class="text-lg font-semibold mb-4">Preview</h3>
		<div class="card p-6 space-y-4">
			<!-- Buttons -->
			<div class="space-y-2">
				<h4 class="text-sm font-medium opacity-75">Buttons</h4>
				<div class="flex gap-3 flex-wrap">
					<button class="btn btn-sm preset-filled-primary-500">Primary</button>
					<button class="btn btn-sm preset-tonal-primary">Secondary</button>
					<button class="btn btn-sm preset-outlined-primary-500">Outlined</button>
				</div>
			</div>
			
			<!-- Cards -->
			<div class="space-y-2">
				<h4 class="text-sm font-medium opacity-75">Cards</h4>
				<div class="card p-4">
					<p class="text-sm mb-2">This is a nested card component.</p>
					<p class="text-xs opacity-75">Style: {currentStyle} | Theme: {currentTheme}</p>
				</div>
			</div>
			
			<!-- Inputs -->
			<div class="space-y-2">
				<h4 class="text-sm font-medium opacity-75">Form Elements</h4>
				<div class="space-y-3">
					<div class="input-group">
						<input type="text" placeholder="Text input" class="w-full" />
						<label class="input-label">Label</label>
					</div>
					<div class="flex gap-3 items-center">
						<div class="switch">
							<div class="switch-thumb"></div>
						</div>
						<span class="text-sm">Toggle switch</span>
					</div>
				</div>
			</div>
			
			<!-- Progress -->
			<div class="space-y-2">
				<h4 class="text-sm font-medium opacity-75">Progress</h4>
				<div class="progress-track">
					<div class="progress-fill" style="width: 60%"></div>
				</div>
			</div>
			
			<!-- Badge -->
			<div class="space-y-2">
				<h4 class="text-sm font-medium opacity-75">Badges</h4>
				<div class="flex gap-2">
					<span class="badge">Default</span>
					<span class="badge bg-primary-500 text-white">Primary</span>
					<span class="badge bg-success-500 text-white">Success</span>
				</div>
			</div>
		</div>
	</div>
</div>

