<script lang="ts">
	import { TagsInput } from '@skeletonlabs/skeleton-svelte';
	
	interface Task {
		id: string;
		text: string;
		done: boolean;
	}
	
	let tasks = $state<Task[]>([
		{ id: '1', text: 'Review meeting notes', done: false },
		{ id: '2', text: 'Email Sarah', done: false },
		{ id: '3', text: 'Prepare slides', done: false },
		{ id: '4', text: 'Call dentist', done: false },
		{ id: '5', text: 'Buy groceries', done: false },
		{ id: '6', text: 'Team standup 10am', done: false },
		{ id: '7', text: 'Update project timeline', done: false },
		{ id: '8', text: 'Review code PR', done: false }
	]);
	
	// Active tasks for TagsInput
	let activeTags = $derived(tasks.filter(t => !t.done).map(t => t.text));
	
	// Update tasks when tags change
	function handleActiveChange(e: any) {
		const newTags = e.value;
		const removedTags = activeTags.filter(tag => !newTags.includes(tag));
		
		// Delete removed tags
		removedTags.forEach(tag => {
			tasks = tasks.filter(t => t.text !== tag);
		});
		
		// Add new tags as tasks
		newTags.forEach(tag => {
			if (!tasks.some(t => t.text === tag)) {
				tasks.push({
					id: Date.now().toString(),
					text: tag,
					done: false
				});
			}
		});
		
		// Update state
		activeTags = newTags;
		tasks = [...tasks];
	}
	
	// Re-sync tags when tasks change
	$effect(() => {
		activeTags = tasks.filter(t => !t.done).map(t => t.text);
	});
</script>

<div class="card preset-filled-surface-200-800 h-full flex flex-col">
	<div class="p-2 border-b border-surface-200 dark:border-surface-700 flex-shrink-0">
		<div class="flex items-center justify-between">
			<h2 class="text-sm font-semibold">Today's Tasks</h2>
			<p class="text-xs text-surface-600 dark:text-surface-400">{activeTags.length} active</p>
		</div>
	</div>
	
	<div class="flex-1 overflow-y-auto p-3 min-h-0">
		<TagsInput 
			value={activeTags} 
			onValueChange={handleActiveChange} 
			placeholder="Add task..."
			base="grid !h-auto"
			inputBase="px-3 py-2 text-sm bg-surface-50 dark:bg-surface-800 border border-surface-300 dark:border-surface-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-surface-500 dark:placeholder-surface-400"
			tagBase="chip"
			tagBackground="preset-tonal-primary"
			tagClasses="text-xs rounded-full"
			class="h-full"
		>
			{#snippet buttonDelete()}
				<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
				</svg>
			{/snippet}
		</TagsInput>
	</div>
</div>

<style>
	/* Compact input styling */
	:global(.tags-input input) {
		font-size: 0.75rem;
	}
	
	/* Make the tags container fill height */
	:global(.tags-input) {
		height: 100%;
		display: flex;
		flex-direction: column;
	}
	
	:global(.tags-input > div) {
		flex: 1;
		overflow-y: auto;
	}
</style>