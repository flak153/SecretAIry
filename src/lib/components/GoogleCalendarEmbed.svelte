<script lang="ts">
	import Icon from '$lib/Icon.svelte';
	
	let calendarUrl = $state('');
	let showInstructions = $state(false);
	let isEmbedded = $state(false);
	
	// Load saved calendar URL from localStorage
	$effect(() => {
		if (typeof window !== 'undefined') {
			const saved = localStorage.getItem('google-calendar-url');
			if (saved) {
				calendarUrl = saved;
				isEmbedded = true;
			}
		}
	});
	
	function saveCalendarUrl() {
		if (calendarUrl && typeof window !== 'undefined') {
			localStorage.setItem('google-calendar-url', calendarUrl);
			isEmbedded = true;
		}
	}
	
	function removeCalendar() {
		if (typeof window !== 'undefined') {
			localStorage.removeItem('google-calendar-url');
			calendarUrl = '';
			isEmbedded = false;
		}
	}
</script>

<div class="card preset-filled-surface-100-900 p-4">
	<div class="flex items-center justify-between mb-4">
		<h3 class="text-lg font-semibold">Google Calendar</h3>
		{#if isEmbedded}
			<button 
				class="btn btn-sm preset-tonal-surface"
				onclick={removeCalendar}
			>
				Remove
			</button>
		{/if}
	</div>
	
	{#if !isEmbedded}
		<div class="space-y-4">
			<p class="text-sm text-surface-600 dark:text-surface-400">
				Embed your Google Calendar without any API keys!
			</p>
			
			<button
				class="btn btn-sm preset-tonal-primary w-full"
				onclick={() => showInstructions = !showInstructions}
			>
				<Icon name="help" size={16} class="mr-2" />
				How to get your calendar URL
			</button>
			
			{#if showInstructions}
				<div class="bg-surface-200 dark:bg-surface-800 rounded-lg p-4 text-sm space-y-2">
					<p class="font-semibold">Instructions:</p>
					<ol class="list-decimal list-inside space-y-1 text-surface-700 dark:text-surface-300">
						<li>Go to <a href="https://calendar.google.com" target="_blank" class="text-primary-500 underline">Google Calendar</a></li>
						<li>Click the gear icon → Settings</li>
						<li>Select your calendar from the left sidebar</li>
						<li>Scroll to "Integrate calendar"</li>
						<li>Copy the "Public URL to this calendar" or use the embed code</li>
						<li>Paste the URL below</li>
					</ol>
				</div>
			{/if}
			
			<div class="space-y-2">
				<label for="calendar-url" class="text-sm font-medium">Calendar URL:</label>
				<input
					id="calendar-url"
					type="url"
					bind:value={calendarUrl}
					placeholder="https://calendar.google.com/calendar/embed?src=..."
					class="input"
				/>
			</div>
			
			<button
				class="btn preset-filled-primary-500 w-full"
				onclick={saveCalendarUrl}
				disabled={!calendarUrl}
			>
				<Icon name="calendar" size={16} class="mr-2" />
				Add Calendar
			</button>
		</div>
	{:else}
		<div class="space-y-4">
			<p class="text-sm text-surface-600 dark:text-surface-400">
				Your calendar is embedded below:
			</p>
			
			<!-- Google Calendar Embed -->
			<div class="rounded-lg overflow-hidden border border-surface-300 dark:border-surface-700">
				<iframe
					src={calendarUrl}
					style="border: 0"
					width="100%"
					height="400"
					frameborder="0"
					scrolling="no"
					title="Google Calendar"
				></iframe>
			</div>
		</div>
	{/if}
</div>

<style>
	.input {
		width: 100%;
		padding: 0.5rem 0.75rem;
		background-color: rgb(var(--color-surface-50));
		border: 1px solid rgb(var(--color-surface-300));
		border-radius: 0.375rem;
		font-size: 0.875rem;
		transition: all 0.2s;
	}
	
	:global(.dark) .input {
		background-color: rgb(var(--color-surface-800));
		border-color: rgb(var(--color-surface-600));
		color: white;
	}
	
	.input:focus {
		outline: none;
		border-color: rgb(var(--color-primary-500));
		box-shadow: 0 0 0 3px rgb(var(--color-primary-500) / 0.1);
	}
</style>