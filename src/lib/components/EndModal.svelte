<script lang="ts">
	import type { WeeklyWord } from '$lib/data/words';
	import { MAX_WRONG } from '$lib/data/words';
	import { buildShareText, copyToClipboard } from '$lib/utils/share';
	import type { GameStatus } from '$lib/stores/gameStore';

	interface Props {
		open: boolean;
		gameStatus: GameStatus;
		wrongCount: number;
		currentWord: WeeklyWord;
		onclose: () => void;
		onreset: () => void;
	}

	let { open, gameStatus, wrongCount, currentWord, onclose, onreset }: Props = $props();

	let copied = $state(false);

	async function share() {
		const text = buildShareText(gameStatus, wrongCount, currentWord.weekNum, currentWord.year);
		const ok = await copyToClipboard(text);
		if (ok) {
			copied = true;
			setTimeout(() => { copied = false; }, 2000);
		}
	}

	function handleBackdrop() { onclose(); }
	function handleReset() { copied = false; onreset(); }
</script>

<svelte:window onkeydown={(e) => { if (e.key === 'Escape' && open) onclose(); }} />

{#if open}
	<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
	<div class="modal-backdrop" class:open onclick={handleBackdrop} role="presentation"></div>
	<div class="modal" class:open role="dialog" aria-modal="true">
		<button class="modal-close" onclick={onclose} aria-label="Lukk">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
			</svg>
		</button>

		<div class="modal-emoji">{gameStatus === 'won' ? '🎉' : '🪓'}</div>
		<h2>{gameStatus === 'won' ? 'Gratulerer!' : 'Giljotinen falt!'}</h2>
		<p class="modal-message">
			{#if gameStatus === 'won'}
				Du gjettet dagens ord med {wrongCount} feil av {MAX_WRONG} mulige.
			{:else}
				Bladet nådde bunnen. Bedre lykke neste uke!
			{/if}
		</p>

		<div class="modal-word-reveal">
			<div class="modal-word">{currentWord.word}</div>
			<div class="modal-definition">{currentWord.hint}</div>
		</div>

		<div class="share-row">
			<button class="btn-share" onclick={share}>Del resultatet</button>
			<button class="btn-new-game" onclick={handleReset}>Prøv igjen</button>
		</div>

		{#if copied}
			<div class="share-copied visible">Kopiert til utklippstavlen!</div>
		{:else}
			<div class="share-copied">&nbsp;</div>
		{/if}
	</div>
{/if}

<style>
	.modal-backdrop {
		position: fixed; inset: 0;
		background: rgba(0,0,0,.45);
		z-index: 300;
		opacity: 0;
		transition: opacity .35s ease;
	}
	.modal-backdrop.open { opacity: 1; }

	.modal {
		position: fixed;
		top: 50%; left: 50%;
		transform: translate(-50%, -50%) scale(.92);
		background: #fff;
		border-radius: 16px;
		max-width: 440px;
		width: calc(100% - 40px);
		max-height: 90vh;
		overflow-y: auto;
		z-index: 301;
		padding: 36px 28px 28px;
		opacity: 0;
		transition: opacity .35s ease, transform .35s cubic-bezier(.34,1.56,.64,1);
	}
	.modal.open {
		opacity: 1;
		transform: translate(-50%, -50%) scale(1);
	}

	.modal-close {
		position: absolute; top: 14px; right: 14px;
		background: none; border: none; cursor: pointer;
		padding: 4px; color: #888;
	}
	.modal-close:hover { color: var(--text); }
	.modal-close :global(svg) { width: 24px; height: 24px; }

	.modal-emoji { text-align: center; font-size: 48px; margin-bottom: 12px; }

	h2 {
		font-family: var(--font-bold);
		font-size: 26px; font-weight: 900;
		text-align: center; margin-bottom: 8px;
	}

	.modal-message {
		font-size: 15px; color: var(--text-muted);
		text-align: center; line-height: 1.5; margin-bottom: 20px;
	}

	.modal-word-reveal { text-align: center; margin-bottom: 20px; }
	.modal-word {
		font-family: var(--font-bold);
		font-size: 36px; font-weight: 900;
		color: var(--text); letter-spacing: 3px;
		text-transform: uppercase; margin-bottom: 6px;
	}
	.modal-definition { font-size: 14px; color: var(--text-muted); font-style: italic; }

	.share-row { display: flex; gap: 10px; justify-content: center; margin-bottom: 16px; }
	.btn-share {
		background: var(--text); color: #fff; border: none;
		border-radius: 28px; padding: 10px 24px;
		font-size: 14px; font-weight: 600; cursor: pointer;
		transition: background .2s;
	}
	.btn-share:hover { background: #333; }
	.btn-new-game {
		border: 1.5px solid var(--text); background: #fff;
		color: var(--text); border-radius: 28px; padding: 10px 24px;
		font-size: 14px; font-weight: 600; cursor: pointer;
		transition: background .2s;
	}
	.btn-new-game:hover { background: #f5f5f5; }

	.share-copied {
		text-align: center; font-size: 13px;
		color: var(--green); font-weight: 600;
		opacity: 0; transition: opacity .3s; height: 20px;
	}
	.share-copied.visible { opacity: 1; }

	@media (max-width: 600px) {
		.modal { width: 92vw; padding: 28px 18px 24px; }
		h2 { font-size: 22px; }
		.modal-word { font-size: 28px; letter-spacing: 2px; }
	}
	@media (max-width: 375px) {
		.modal-word { font-size: 24px; }
	}
</style>
