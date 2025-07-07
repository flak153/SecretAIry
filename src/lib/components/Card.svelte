<script lang="ts">
	interface Props {
		class?: string;
		variant?: 'default' | 'ghost' | 'soft';
		children?: any;
	}
	
	let { class: className = '', variant = 'default', children }: Props = $props();
	
	const variantClasses = {
		default: 'bg-surface-100 dark:bg-surface-900',
		ghost: 'bg-transparent',
		soft: 'bg-surface-50 dark:bg-surface-800'
	};
</script>

<div class="card {variantClasses[variant]} {className}">
	{@render children?.()}
</div>