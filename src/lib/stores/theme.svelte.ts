// Theme store for reactive dark mode
class ThemeStore {
	mode = $state<'light' | 'dark' | 'system'>('system');
	
	constructor() {
		// Initialize from localStorage
		if (typeof window !== 'undefined') {
			const saved = localStorage.getItem('colorScheme') as 'light' | 'dark' | 'system' || 'system';
			this.mode = saved;
			this.applyMode();
			
			// Listen for system preference changes
			window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
				if (this.mode === 'system') {
					this.applyMode();
				}
			});
		}
	}
	
	setMode(mode: 'light' | 'dark' | 'system') {
		this.mode = mode;
		localStorage.setItem('colorScheme', mode);
		this.applyMode();
	}
	
	private applyMode() {
		const root = document.documentElement;
		root.classList.remove('dark');
		
		const shouldBeDark = this.mode === 'dark' || 
			(this.mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
		
		if (shouldBeDark) {
			root.classList.add('dark');
		}
	}
	
	get isDark() {
		if (typeof window === 'undefined') return false;
		return this.mode === 'dark' || 
			(this.mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
	}
}

export const themeStore = new ThemeStore();