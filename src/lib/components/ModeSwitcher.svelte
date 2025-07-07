<script lang="ts">
	import { themeStore } from '$lib/stores/theme.svelte';
	import Portal from './Portal.svelte';
	
	let showDropdown = $state(false);
	let buttonRef: HTMLButtonElement;
	
	// Get current mode icon
	const modeIcons = {
		light: `<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
			<path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd" />
		</svg>`,
		dark: `<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
			<path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
		</svg>`,
		system: `<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
			<path d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" />
		</svg>`
	};
	
	function selectMode(mode: 'light' | 'dark' | 'system') {
		themeStore.setMode(mode);
		showDropdown = false;
	}
	
	// Close dropdown when clicking outside
	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (!target.closest('.mode-switcher')) {
			showDropdown = false;
		}
	}
	
	$effect(() => {
		if (showDropdown) {
			document.addEventListener('click', handleClickOutside);
			return () => document.removeEventListener('click', handleClickOutside);
		}
	});
	
	// Get dropdown position
	let dropdownPosition = $state({ top: 0, left: 0 });
	
	$effect(() => {
		if (showDropdown && buttonRef) {
			const rect = buttonRef.getBoundingClientRect();
			dropdownPosition = {
				top: rect.bottom + 8,
				left: rect.right - 160 // 160px is the dropdown width
			};
		}
	});
</script>

<div class="mode-switcher relative">
	<button
		bind:this={buttonRef}
		class="btn btn-sm variant-ghost-surface rounded-lg p-2"
		onclick={() => showDropdown = !showDropdown}
		aria-label="Change theme mode"
		aria-expanded={showDropdown}
	>
		{@html modeIcons[themeStore.mode]}
		<svg class="w-3 h-3 ml-1 transition-transform {showDropdown ? 'rotate-180' : ''}" fill="currentColor" viewBox="0 0 20 20">
			<path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
		</svg>
	</button>
	
	{#if showDropdown}
		<Portal>
			<div class="fixed w-40 rounded-lg bg-surface-100 dark:bg-surface-800 shadow-xl border border-surface-300 dark:border-surface-600 overflow-hidden z-[99999]" 
				style="top: {dropdownPosition.top}px; left: {dropdownPosition.left}px;">
			<button
				class="w-full px-4 py-2 text-left text-sm hover:bg-surface-200 dark:hover:bg-surface-700 flex items-center gap-3 {themeStore.mode === 'light' ? 'bg-surface-200 dark:bg-surface-700' : ''}"
				onclick={() => selectMode('light')}
			>
				{@html modeIcons.light}
				<span>Light</span>
			</button>
			<button
				class="w-full px-4 py-2 text-left text-sm hover:bg-surface-200 dark:hover:bg-surface-700 flex items-center gap-3 {themeStore.mode === 'dark' ? 'bg-surface-200 dark:bg-surface-700' : ''}"
				onclick={() => selectMode('dark')}
			>
				{@html modeIcons.dark}
				<span>Dark</span>
			</button>
			<button
				class="w-full px-4 py-2 text-left text-sm hover:bg-surface-200 dark:hover:bg-surface-700 flex items-center gap-3 {themeStore.mode === 'system' ? 'bg-surface-200 dark:bg-surface-700' : ''}"
				onclick={() => selectMode('system')}
			>
				{@html modeIcons.system}
				<span>System</span>
			</button>
			</div>
		</Portal>
	{/if}
</div>

<style>
	.rotate-180 {
		transform: rotate(180deg);
	}
</style>