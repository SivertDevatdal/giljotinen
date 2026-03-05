<script lang="ts">
	interface Props {
		message: string;
		visible: boolean;
	}

	let { message, visible }: Props = $props();
</script>

<div class="toast" class:visible>{message}</div>

<style>
	.toast {
		position: fixed;
		top: 80px;
		left: 50%;
		transform: translateX(-50%) translateY(-20px);
		background: var(--text);
		color: #fff;
		padding: 10px 24px;
		border-radius: 8px;
		font-size: 14px;
		font-weight: 600;
		opacity: 0;
		pointer-events: none;
		transition: opacity .3s, transform .3s;
		z-index: 50;
	}
	.toast.visible {
		opacity: 1;
		transform: translateX(-50%) translateY(0);
	}
</style>
