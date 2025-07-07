<script lang="ts">
	import ThemeSettings from '$lib/components/ThemeSettings.svelte';
	import GoogleCalendarAuth from '$lib/components/GoogleCalendarAuth.svelte';
</script>

<div class="container mx-auto max-w-4xl p-6">
	<h1 class="text-2xl font-bold mb-6">Settings</h1>
	
	<div class="space-y-6">
		<!-- Theme Settings -->
		<div class="card preset-filled-surface-200-800 p-6">
			<h2 class="text-lg font-semibold mb-4">Appearance</h2>
			<ThemeSettings />
		</div>
		
		<!-- Calendar Settings -->
		<GoogleCalendarAuth />
		
		<!-- AI Assistant Settings -->
		<div class="card preset-filled-surface-200-800 p-6">
			<h2 class="text-lg font-semibold mb-4">AI Assistant</h2>
			<div class="space-y-4">
				<div class="flex items-center justify-between">
					<div>
						<p class="font-medium">Auto-suggestions</p>
						<p class="text-sm opacity-75">Let AI suggest optimal meeting times</p>
					</div>
					<label class="flex items-center space-x-2">
						<input type="checkbox" class="checkbox" checked />
						<span class="sr-only">Enable auto-suggestions</span>
					</label>
				</div>
				<div class="flex items-center justify-between">
					<div>
						<p class="font-medium">Smart reminders</p>
						<p class="text-sm opacity-75">AI-powered reminder notifications</p>
					</div>
					<label class="flex items-center space-x-2">
						<input type="checkbox" class="checkbox" checked />
						<span class="sr-only">Enable smart reminders</span>
					</label>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.checkbox {
		width: 1rem;
		height: 1rem;
		border-radius: 0.25rem;
		border: 1px solid rgb(var(--color-surface-400));
		background-color: transparent;
		cursor: pointer;
	}
	
	.checkbox:checked {
		background-color: rgb(var(--color-primary-500));
		border-color: rgb(var(--color-primary-500));
	}
</style>