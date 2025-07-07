<script lang="ts">
	import Icon from '$lib/Icon.svelte';
	
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

<div class="card preset-filled-surface-200-800 h-full flex flex-col overflow-hidden">
	<div class="p-3 border-b border-surface-200 dark:border-surface-700 flex-shrink-0">
		<h2 class="text-base font-semibold">AI Secretary</h2>
		<p class="text-xs text-surface-600 dark:text-surface-400">Your intelligent calendar assistant</p>
	</div>
		
	<div class="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-3 min-h-0">
		<!-- Chat messages -->
		{#each messages as message}
			<div class="flex gap-2 {message.role === 'user' ? 'flex-row-reverse' : ''}">
				<div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 {message.role === 'assistant' ? 'bg-gradient-to-br from-primary-400 to-primary-600 text-white' : 'bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-300'}">
					{message.role === 'assistant' ? 'AI' : 'You'}
				</div>
				<div class="flex-1 max-w-[85%]">
					<div class="{message.role === 'assistant' ? 'bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-700' : 'bg-primary-500/10 dark:bg-primary-400/10 border border-primary-500/20'} rounded-lg p-3 backdrop-blur-sm">
						<p class="text-sm leading-relaxed">{message.content}</p>
						{#if message.list}
							<ul class="text-sm space-y-1 mt-3 ml-2">
								{#each message.list as item}
									<li class="flex items-start gap-2">
										<span class="text-primary-500 mt-0.5">•</span>
										<span>{item}</span>
									</li>
								{/each}
							</ul>
						{/if}
					</div>
					<span class="text-xs text-surface-500 dark:text-surface-400 mt-1 ml-2 block">
						{new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
					</span>
				</div>
			</div>
		{/each}
		
		<!-- Typing indicator -->
		{#if false}
			<div class="flex gap-2">
				<div class="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-xs font-semibold text-white flex-shrink-0">
					AI
				</div>
				<div class="bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-lg p-3">
					<div class="flex gap-1">
						<span class="w-2 h-2 bg-surface-400 rounded-full animate-bounce" style="animation-delay: 0ms"></span>
						<span class="w-2 h-2 bg-surface-400 rounded-full animate-bounce" style="animation-delay: 150ms"></span>
						<span class="w-2 h-2 bg-surface-400 rounded-full animate-bounce" style="animation-delay: 300ms"></span>
					</div>
				</div>
			</div>
		{/if}
	</div>
		
	<!-- Chat input -->
	<div class="p-3 border-t border-surface-200 dark:border-surface-700 flex-shrink-0">
		<form class="flex gap-2" onsubmit={sendMessage}>
			<input
				type="text"
				placeholder="Ask about meetings, schedule time, set reminders..."
				class="flex-1 px-3 py-2 text-sm bg-surface-50 dark:bg-surface-800 border border-surface-300 dark:border-surface-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-surface-500 dark:placeholder-surface-400"
				bind:value={inputValue}
			/>
			<button 
				type="submit" 
				class="btn preset-filled-primary-500 rounded-lg p-2 hover:scale-105 transition-transform flex-shrink-0"
				disabled={!inputValue.trim()}
			>
				<Icon name="chevronRight" size={20} />
			</button>
		</form>
	</div>
</div>

