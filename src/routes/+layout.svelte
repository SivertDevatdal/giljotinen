<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();
</script>

<svelte:head>
	<title>Giljotinen</title>
	<meta name="description" content="Gjett dagens ord — et norsk ordspill." />
</svelte:head>

{@render children()}

<style>
	:global(*), :global(*::before), :global(*::after) {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
	}

	:global(:root) {
		--red: #d42b2b;
		--red-dark: #b82222;
		--green: #2a9d4e;
		--bg: #fff;
		--text: #1a1a1a;
		--text-muted: #666;
		--text-faint: #888;
		--border: #e5e5e5;
		--surface: #f7f7f7;
		--font: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
		--font-bold: 'Arial Black', 'Helvetica Neue', Arial, sans-serif;
	}

	:global(body) {
		font-family: var(--font);
		color: var(--text);
		background: var(--bg);
		overflow-x: hidden;
		-webkit-font-smoothing: antialiased;
	}
</style>
