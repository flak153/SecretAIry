<script lang="ts">
	let activeTab = $state(0);
</script>

<div class="container mx-auto p-8 space-y-8">
	<!-- Hero Section -->
	<div class="card p-8 variant-glass-primary">
		<h1 class="h1 mb-4">Welcome to Secretairy</h1>
		<p class="text-lg">Built with SvelteKit, Skeleton UI, and Convex</p>
	</div>

	<!-- Tab Navigation -->
	<div class="card">
		<div class="tab-group border-b border-surface-300-600-token">
			<button
				class="tab {activeTab === 0 ? 'tab-active' : ''}"
				onclick={() => activeTab = 0}
			>
				Components
			</button>
			<button
				class="tab {activeTab === 1 ? 'tab-active' : ''}"
				onclick={() => activeTab = 1}
			>
				Features
			</button>
			<button
				class="tab {activeTab === 2 ? 'tab-active' : ''}"
				onclick={() => activeTab = 2}
			>
				Getting Started
			</button>
		</div>
		
		<!-- Tab Panels -->
		<div class="p-4">
			{#if activeTab === 0}
				<div class="space-y-4">
					<h2 class="h2">Skeleton UI Components</h2>
					
					<!-- Buttons -->
					<div class="card p-4">
						<h3 class="h3 mb-4">Buttons</h3>
						<div class="flex gap-2 flex-wrap">
							<button class="btn variant-filled">Primary</button>
							<button class="btn variant-filled-secondary">Secondary</button>
							<button class="btn variant-filled-tertiary">Tertiary</button>
							<button class="btn variant-filled-success">Success</button>
							<button class="btn variant-filled-warning">Warning</button>
							<button class="btn variant-filled-error">Error</button>
							<button class="btn variant-ghost">Ghost</button>
							<button class="btn variant-ringed">Ringed</button>
						</div>
					</div>

					<!-- Cards -->
					<div class="card p-4">
						<h3 class="h3 mb-4">Cards</h3>
						<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div class="card variant-filled-surface p-4">
								<h4 class="h4">Surface Card</h4>
								<p>Basic card with surface variant</p>
							</div>
							<div class="card variant-glass p-4">
								<h4 class="h4">Glass Card</h4>
								<p>Glassmorphism effect card</p>
							</div>
							<div class="card variant-soft p-4">
								<h4 class="h4">Soft Card</h4>
								<p>Soft variant card</p>
							</div>
						</div>
					</div>

					<!-- Badges -->
					<div class="card p-4">
						<h3 class="h3 mb-4">Badges</h3>
						<div class="flex gap-2 flex-wrap">
							<span class="badge variant-filled">Default</span>
							<span class="badge variant-filled-primary">Primary</span>
							<span class="badge variant-filled-secondary">Secondary</span>
							<span class="badge variant-filled-tertiary">Tertiary</span>
							<span class="badge variant-filled-success">Success</span>
							<span class="badge variant-filled-warning">Warning</span>
							<span class="badge variant-filled-error">Error</span>
						</div>
					</div>
				</div>
			{:else if activeTab === 1}
				<div class="space-y-4">
					<h2 class="h2">Key Features</h2>
					<ul class="list-disc list-inside space-y-2">
						<li>🎨 Beautiful, customizable themes</li>
						<li>🧩 Pre-built components ready to use</li>
						<li>🌓 Built-in dark mode support</li>
						<li>📱 Fully responsive design</li>
						<li>⚡ Powered by Tailwind CSS</li>
						<li>🔧 Highly customizable with CSS properties</li>
					</ul>
				</div>
			{:else if activeTab === 2}
				<div class="space-y-4">
					<h2 class="h2">Getting Started</h2>
					<ol class="list-decimal list-inside space-y-2">
						<li>Install dependencies with <code class="code">bun install</code></li>
						<li>Start the development server with <code class="code">bun run dev</code></li>
						<li>Open <a href="http://localhost:5173" class="anchor">http://localhost:5173</a></li>
						<li>Start building your app!</li>
					</ol>
					
					<div class="card variant-ghost-warning p-4 mt-4">
						<p><strong>Note:</strong> This project uses Bun as the package manager and Tailwind CSS v4.</p>
					</div>
				</div>
			{/if}
		</div>
	</div>

	<!-- Example Form -->
	<div class="card p-6">
		<h2 class="h2 mb-4">Example Form</h2>
		<form class="space-y-4">
			<label class="label">
				<span>Name</span>
				<input class="input" type="text" placeholder="Enter your name" />
			</label>
			
			<label class="label">
				<span>Email</span>
				<input class="input" type="email" placeholder="john@example.com" />
			</label>
			
			<label class="label">
				<span>Message</span>
				<textarea class="textarea" rows="4" placeholder="Enter your message"></textarea>
			</label>
			
			<button type="submit" class="btn variant-filled-primary">Submit</button>
		</form>
	</div>
</div>