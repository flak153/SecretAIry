<script lang="ts">
	import '../app.css';
	import ThemeSwitcher from '$lib/ThemeSwitcher.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';

	let { children } = $props();
</script>

<!-- App Shell -->
<div class="min-h-screen bg-surface-50 dark:bg-surface-950">
	<!-- Sidebar -->
	<Sidebar />
	
	<!-- Page Content -->
	<main class="ml-16 transition-all duration-300">
		{@render children()}
	</main>
</div>

<style>
	.ml-16 {
		margin-left: 4rem;
	}
</style>
