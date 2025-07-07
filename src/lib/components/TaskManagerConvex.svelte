<script lang="ts">
	import { TagsInput } from '@skeletonlabs/skeleton-svelte';
	import { useQuery, useMutation } from '$lib/convex.svelte';
	import { api } from '$lib/convex-api';
	
	// For demo, using a hardcoded userId - in production, get from auth
	const userId = "demo-user";
	
	// Query tasks from Convex
	const tasksQuery = useQuery(api.tasks.getTasks, { userId });
	
	// Mutations
	const addTask = useMutation(api.tasks.addTask);
	const toggleTask = useMutation(api.tasks.toggleTask);
	const deleteTask = useMutation(api.tasks.deleteTask);
	
	// Derived state for tags
	let activeTags = $derived(
		tasksQuery.value?.filter(t => !t.completed).map(t => t.text) || []
	);
	
	let completedTags = $derived(
		tasksQuery.value?.filter(t => t.completed).map(t => t.text) || []
	);
	
	// Handle adding new tasks
	async function handleActiveChange(e: any) {
		const newTags = e.value;
		const currentTags = activeTags;
		
		// Find added tags
		const addedTags = newTags.filter((tag: string) => !currentTags.includes(tag));
		
		// Find removed tags (this handles the case where TagsInput removes a tag)
		const removedTags = currentTags.filter((tag: string) => !newTags.includes(tag));
		
		// Add new tasks
		for (const tag of addedTags) {
			await addTask({ userId, text: tag });
		}
		
		// Complete removed tasks
		for (const tag of removedTags) {
			await handleTaskComplete(tag);
		}
	}
	
	// Handle completing tasks
	async function handleTaskComplete(taskText: string) {
		console.log('Completing task:', taskText);
		const task = tasksQuery.value?.find(t => t.text === taskText && !t.completed);
		console.log('Found task:', task);
		if (task) {
			await toggleTask({ taskId: task._id });
		}
	}
	
	// Handle uncompleting tasks
	async function handleTaskUncomplete(taskText: string) {
		const task = tasksQuery.value?.find(t => t.text === taskText && t.completed);
		if (task) {
			await toggleTask({ taskId: task._id });
		}
	}
	
	// Handle deleting tasks
	async function handleTaskDelete(taskText: string, isCompleted: boolean) {
		const task = tasksQuery.value?.find(t => t.text === taskText && t.completed === isCompleted);
		if (task) {
			await deleteTask({ taskId: task._id });
		}
	}
</script>

<div class="card preset-filled-surface-200-800 p-4 flex flex-col h-full">
	<h2 class="text-lg font-semibold mb-3 flex items-center justify-between">
		<span>Tasks</span>
		{#if tasksQuery.loading}
			<span class="text-xs opacity-50">Loading...</span>
		{:else if tasksQuery.error}
			<span class="text-xs text-error-500">Error</span>
		{:else}
			<span class="text-xs opacity-50">
				{activeTags.length} active{completedTags.length > 0 ? `, ${completedTags.length} done` : ''}
			</span>
		{/if}
	</h2>
	
	<div class="space-y-4 flex-1 overflow-y-auto">
		<!-- Active Tasks -->
		<div>
			<TagsInput 
				value={activeTags} 
				onValueChange={handleActiveChange}
				placeholder="Add task..."
				base="grid !h-auto"
				inputBase="px-3 py-2 text-sm bg-surface-50 dark:bg-surface-800 border border-surface-300 dark:border-surface-600 rounded-lg focus:border-primary-500 dark:focus:border-primary-500 focus:outline-none"
				tagBase="chip"
				tagBackground="preset-tonal-primary"
				tagClasses="text-xs rounded-full"
			>
				<span slot="empty" class="text-sm opacity-50 p-2">No active tasks</span>
			</TagsInput>
		</div>
		
		<!-- Completed Tasks -->
		{#if completedTags.length > 0}
			<div>
				<h3 class="text-sm font-medium opacity-50 mb-2">Completed ({completedTags.length})</h3>
				<TagsInput 
					value={completedTags}
					disabled={true}
					base="grid !h-auto opacity-60"
					inputBase="hidden"
					tagBase="chip"
					tagBackground="preset-filled-surface"
					tagClasses="text-xs rounded-full line-through"
				/>
			</div>
		{/if}
	</div>
</div>