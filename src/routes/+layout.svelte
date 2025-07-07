<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<!-- App Shell -->
<div class="app-shell">
	<!-- Header -->
	<header class="app-bar bg-surface-100-800-token shadow-sm">
		<div class="app-bar-slot-lead">
			<strong class="text-xl uppercase">SecretAIry</strong>
		</div>
		<div class="app-bar-slot-default"></div>
		<div class="app-bar-slot-trail">
			<a
				class="btn btn-sm variant-ghost-surface"
				href="https://skeleton.dev/"
				target="_blank"
				rel="noreferrer"
			>
				Skeleton
			</a>
		</div>
	</header>
	
	<!-- Page Content -->
	<main class="container mx-auto">
		{@render children()}
	</main>
</div>
