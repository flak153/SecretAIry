<script lang="ts">
	import Card from '$lib/components/Card.svelte';
</script>

<div class="container mx-auto p-8 space-y-8">
	<h1 class="h1">Theme System Test</h1>
	
	<section class="space-y-4">
		<h2 class="h2">Typography</h2>
		<p>This is regular body text using <code>--base-font-color</code>.</p>
		<p class="text-sm opacity-75">This is smaller, muted text.</p>
		<a href="#test">This is a link using anchor colors</a>
	</section>

	<section class="space-y-4">
		<h2 class="h2">Surface Colors</h2>
		<div class="grid grid-cols-3 gap-4">
			<Card variant="default">
				<h3 class="h3">Default Card</h3>
				<p>Uses surface-100/900</p>
			</Card>
			<Card variant="soft">
				<h3 class="h3">Soft Card</h3>
				<p>Uses surface-50/800</p>
			</Card>
			<div class="card bg-surface-200 dark:bg-surface-800 p-4">
				<h3 class="h3">Custom Surface</h3>
				<p>Uses surface-200/800</p>
			</div>
		</div>
	</section>

	<section class="space-y-4">
		<h2 class="h2">Accent Colors</h2>
		<div class="grid grid-cols-3 gap-4">
			<div class="card variant-filled-primary p-4">
				<h3 class="h3">Primary</h3>
				<p>Filled variant</p>
			</div>
			<div class="card variant-filled-secondary p-4">
				<h3 class="h3">Secondary</h3>
				<p>Filled variant</p>
			</div>
			<div class="card variant-filled-tertiary p-4">
				<h3 class="h3">Tertiary</h3>
				<p>Filled variant</p>
			</div>
		</div>
		<div class="grid grid-cols-3 gap-4">
			<div class="card variant-filled-success p-4">
				<h3 class="h3">Success</h3>
				<p>Status variant</p>
			</div>
			<div class="card variant-filled-warning p-4">
				<h3 class="h3">Warning</h3>
				<p>Status variant</p>
			</div>
			<div class="card variant-filled-error p-4">
				<h3 class="h3">Error</h3>
				<p>Status variant</p>
			</div>
		</div>
	</section>

	<section class="space-y-4">
		<h2 class="h2">Buttons</h2>
		<div class="flex gap-4 flex-wrap">
			<button class="btn">Default</button>
			<button class="btn variant-filled-primary">Primary</button>
			<button class="btn variant-filled-secondary">Secondary</button>
			<button class="btn variant-filled-tertiary">Tertiary</button>
			<button class="btn variant-filled-surface">Surface</button>
		</div>
	</section>

	<section class="space-y-4">
		<h2 class="h2">Form Elements</h2>
		<div class="grid grid-cols-2 gap-4">
			<label>
				<span>Input Field</span>
				<input type="text" class="input" placeholder="Type something..." />
			</label>
			<label>
				<span>Select Field</span>
				<select class="select">
					<option>Option 1</option>
					<option>Option 2</option>
				</select>
			</label>
		</div>
		<label>
			<span>Textarea</span>
			<textarea class="textarea" rows={3} placeholder="Type a message..."></textarea>
		</label>
	</section>

	<section class="space-y-4">
		<h2 class="h2">Badges</h2>
		<div class="flex gap-2 flex-wrap">
			<span class="badge">Default</span>
			<span class="badge variant-filled-primary">Primary</span>
			<span class="badge variant-filled-secondary">Secondary</span>
			<span class="badge variant-filled-tertiary">Tertiary</span>
			<span class="badge variant-filled-success">Success</span>
			<span class="badge variant-filled-warning">Warning</span>
			<span class="badge variant-filled-error">Error</span>
		</div>
	</section>
</div>
</script>

<style>
	/* Page-specific styles if needed */
</style>