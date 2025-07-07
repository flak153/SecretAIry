<script lang="ts">
	import { useQuery, useMutation } from '$lib/convex';
	import { api } from '../../../convex/_generated/api';
	
	// Simple query
	const greeting = useQuery(api.hello.getGreeting);
	
	// Query with args
	let name = $state('');
	const personalizedGreeting = $derived(
		name ? useQuery(api.hello.getPersonalizedGreeting, { name }) : null
	);
	
	// Mutation
	const saveMessage = useMutation(api.hello.saveMessage);
	let message = $state('');
	let saveResult = $state('');
	
	async function handleSave() {
		if (message) {
			const result = await saveMessage({ 
				text: message, 
				timestamp: Date.now() 
			});
			saveResult = result.message;
			message = '';
		}
	}
</script>

<div class="card preset-filled-surface-100-900 p-6 space-y-6">
	<h2 class="text-xl font-semibold">Convex Test</h2>
	
	<!-- Simple Query -->
	<div class="space-y-2">
		<h3 class="text-sm font-medium opacity-75">Simple Query:</h3>
		{#if $greeting === undefined}
			<p class="text-sm">Loading...</p>
		{:else if $greeting === null}
			<p class="text-sm text-error-500">Error loading greeting</p>
		{:else}
			<p class="text-lg">{$greeting}</p>
		{/if}
	</div>
	
	<!-- Query with Args -->
	<div class="space-y-2">
		<h3 class="text-sm font-medium opacity-75">Personalized Greeting:</h3>
		<input
			type="text"
			bind:value={name}
			placeholder="Enter your name"
			class="input"
		/>
		{#if name && $personalizedGreeting}
			<p class="text-lg">{$personalizedGreeting}</p>
		{/if}
	</div>
	
	<!-- Mutation -->
	<div class="space-y-2">
		<h3 class="text-sm font-medium opacity-75">Save a Message:</h3>
		<div class="flex gap-2">
			<input
				type="text"
				bind:value={message}
				placeholder="Type a message"
				class="input flex-1"
				onkeydown={(e) => e.key === 'Enter' && handleSave()}
			/>
			<button 
				class="btn preset-filled-primary-500"
				onclick={handleSave}
				disabled={!message}
			>
				Save
			</button>
		</div>
		{#if saveResult}
			<p class="text-sm text-success-500">{saveResult}</p>
		{/if}
	</div>
</div>

<style>
	.input {
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