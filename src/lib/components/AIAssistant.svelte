<script lang="ts">
	interface Props {
		isOpen: boolean;
	}
	
	let { isOpen }: Props = $props();
	
	// Chat state
	let messages = $state([
		{
			role: 'assistant',
			content: 'Good morning! I see you have a busy day ahead. Your first meeting starts in 45 minutes.'
		},
		{
			role: 'user',
			content: 'Can you find me some free time this week?'
		},
		{
			role: 'assistant',
			content: 'I found several free slots this week:',
			list: ['Tomorrow: 2-4 PM', 'Wednesday: 10-11 AM', 'Thursday: All afternoon free', 'Friday: 3-5 PM']
		}
	]);
	
	let inputValue = $state('');
	
	function sendMessage(e: Event) {
		e.preventDefault();
		if (!inputValue.trim()) return;
		
		// Add user message
		messages = [...messages, { role: 'user', content: inputValue }];
		
		// Mock AI response (in real app, would call Convex action)
		setTimeout(() => {
			messages = [...messages, {
				role: 'assistant',
				content: 'I understand you want to schedule that. Let me check your calendar...'
			}];
		}, 1000);
		
		inputValue = '';
	}
</script>

{#if isOpen}
	<aside class="w-80 border-l border-surface-300 dark:border-surface-700 bg-surface-100 dark:bg-surface-900 flex flex-col">
		<div class="p-4 border-b border-surface-300 dark:border-surface-700">
			<h2 class="text-lg font-semibold">AI Secretary</h2>
			<p class="text-sm opacity-75">I'll help manage your calendar</p>
		</div>
		
		<div class="flex-1 overflow-auto p-4 space-y-4">
			<!-- Chat messages -->
			{#each messages as message}
				<div class="flex gap-3 {message.role === 'user' ? 'flex-row-reverse' : ''}">
					<div class="w-8 h-8 rounded-full {message.role === 'assistant' ? 'bg-primary-500' : 'bg-tertiary-500'} flex items-center justify-center text-sm">
						{message.role === 'assistant' ? 'AI' : 'You'}
					</div>
					<div class="flex-1">
						<div class="{message.role === 'assistant' ? 'bg-surface-200 dark:bg-surface-800' : 'bg-tertiary-500/20'} rounded p-3">
							<p class="text-sm">{message.content}</p>
							{#if message.list}
								<ul class="text-sm space-y-1 mt-2">
									{#each message.list as item}
										<li>• {item}</li>
									{/each}
								</ul>
							{/if}
						</div>
					</div>
				</div>
			{/each}
		</div>
		
		<!-- Chat input -->
		<div class="p-4 border-t border-surface-300 dark:border-surface-700">
			<form class="flex gap-2" onsubmit={sendMessage}>
				<input
					type="text"
					placeholder="Ask about your schedule..."
					class="flex-1 px-3 py-2 bg-surface-200-800 rounded-container-token text-sm"
					bind:value={inputValue}
				/>
				<button type="submit" class="btn btn-sm variant-filled">Send</button>
			</form>
		</div>
	</aside>
{/if}

<style>
	.w-8 {
		width: 2rem;
	}
	.h-8 {
		height: 2rem;
	}
</style>