<script lang="ts">
	import { icons } from './icons';
	
	interface Props {
		name: keyof typeof icons;
		class?: string;
		size?: number;
	}
	
	let { name, class: className = '', size = 24 }: Props = $props();
</script>

{@html icons[name].replace('width="24"', `width="${size}"`).replace('height="24"', `height="${size}"`).replace('<svg', `<svg class="${className}"`)}