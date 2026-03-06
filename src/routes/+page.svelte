<script lang="ts">
	import { onMount } from 'svelte';
	import { gameStore, wrongCount, isPlaying, isFinished } from '$lib/stores/gameStore';
	import { MAX_WRONG } from '$lib/data/words';
	import Guillotine from '$lib/components/Guillotine.svelte';
	import Keyboard from '$lib/components/Keyboard.svelte';
	import WordDisplay from '$lib/components/WordDisplay.svelte';
	import EndModal from '$lib/components/EndModal.svelte';
	import HelpModal from '$lib/components/HelpModal.svelte';
	import Toast from '$lib/components/Toast.svelte';

	let showEndModal = $state(false);
	let showHelpModal = $state(false);
	let toastMsg = $state('');
	let toastVisible = $state(false);
	let toastTimer: ReturnType<typeof setTimeout> | null = null;
	let restoredInstant = $state(false);

	function showToast(msg: string, dur = 1500) {
		if (toastTimer) clearTimeout(toastTimer);
		toastMsg = msg;
		toastVisible = true;
		toastTimer = setTimeout(() => { toastVisible = false; }, dur);
	}

	function handleGuess(letter: string) {
		const result = gameStore.guessLetter(letter);
		if (result === 'ignored') return;

		const state = $gameStore;
		if (state.gameStatus === 'won') {
			setTimeout(() => { showEndModal = true; }, 800);
		} else if (state.gameStatus === 'lost') {
			setTimeout(() => { showEndModal = true; }, 1800);
		}
	}


	function handleReset() {
		showEndModal = false;
		gameStore.reset();
	}

	onMount(() => {
		const restored = gameStore.restore();
		if (restored) {
			restoredInstant = true;
			const state = $gameStore;
			if (state.gameStatus !== 'playing') {
				setTimeout(() => { showEndModal = true; }, 500);
			}
		}
	});
</script>

<header>
	<img src="/logo.svg" alt="Giljotinen" class="header-logo" />
	<button class="header-help" onclick={() => showHelpModal = true} aria-label="Hjelp">?</button>
</header>

<Toast message={toastMsg} visible={toastVisible} />

<main class="layout">
	<div class="game-panel">
		<div class="game-header">
			<span class="game-tag">Dagens spill</span>
			<h1 class="game-title">Giljotinen</h1>
			<p class="game-subtitle">
				{$gameStore.currentWord.dateStr} – Gjett dagens ord
			</p>
		</div>

		<div class="clue-box">
			<div class="clue-label">Ledetråd</div>
			<p class="clue-text">{$gameStore.currentWord.hint}</p>
		</div>

		<WordDisplay
			word={$gameStore.currentWord.word}
			correctLetters={$gameStore.correctLetters}
			gameStatus={$gameStore.gameStatus}
		/>

		<div class="wrong-section">
			{#if $gameStore.wrongLetters.length > 0}
				<div class="wrong-label">Feil bokstaver</div>
				<div class="wrong-letters">
					{#each $gameStore.wrongLetters as letter}
						<div class="wrong-letter">{letter}</div>
					{/each}
				</div>
			{/if}
		</div>

		<Keyboard
			guessedLetters={$gameStore.guessedLetters}
			correctLetters={$gameStore.correctLetters}
			disabled={!$isPlaying}
			onguess={handleGuess}
		/>

		{#if $isFinished}
			<div class="retry-wrap">
				<button class="btn-retry" onclick={handleReset}>Prøv igjen</button>
			</div>
		{/if}
	</div>

	<div class="visual-panel">
		<Guillotine
			wrongCount={$wrongCount}
			gameStatus={$gameStore.gameStatus}
			instant={restoredInstant}
		/>
		<div class="guess-counter">
			{#if $isPlaying}
				<span class="count">{MAX_WRONG - $wrongCount}</span> forsøk igjen
			{:else if $gameStore.gameStatus === 'won'}
				<span class="won">Løst!</span>
			{:else}
				<span class="lost">Tapt</span>
			{/if}
		</div>
	</div>
</main>

<EndModal
	open={showEndModal}
	gameStatus={$gameStore.gameStatus}
	wrongCount={$wrongCount}
	currentWord={$gameStore.currentWord}
	onclose={() => showEndModal = false}
	onreset={handleReset}
/>

<HelpModal
	open={showHelpModal}
	onclose={() => showHelpModal = false}
/>

<style>
	header {
		position: sticky;
		top: 0;
		z-index: 100;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 10px 24px;
		background: var(--bg);
		border-bottom: 1px solid var(--border);
		overflow: visible;
	}
	.header-logo {
		height: 48px;
		width: auto;
		position: relative;
		top: 8px;
	}
	.header-help {
		position: absolute;
		right: 20px;
		background: none;
		border: 1.5px solid var(--border);
		border-radius: 50%;
		width: 32px; height: 32px;
		font-size: 16px; font-weight: 700;
		color: var(--text-muted);
		cursor: pointer;
		display: flex; align-items: center; justify-content: center;
		transition: border-color .2s;
	}
	.header-help:hover { border-color: #aaa; }

	.layout {
		display: flex;
		max-width: 960px;
		margin: 0 auto;
		padding: 32px 24px 60px;
		gap: 48px;
	}
	.game-panel { flex: 1.5; min-width: 0; }
	.visual-panel {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		position: sticky;
		top: 90px;
		align-self: flex-start;
		padding-top: 12px;
	}

	.game-header { margin-bottom: 28px; }
	.game-tag {
		display: inline-block;
		font-family: var(--font-bold);
		font-size: 11px; font-weight: 900;
		text-transform: uppercase;
		letter-spacing: 1.5px;
		color: var(--red);
		margin-bottom: 2px;
	}
	.game-title {
		font-family: var(--font-bold);
		font-size: 36px; font-weight: 900;
		line-height: 1.15;
		color: var(--text);
		margin-bottom: 6px;
	}
	.game-subtitle { font-size: 15px; color: var(--text-muted); }

	.clue-box {
		background: var(--surface);
		border-left: 4px solid var(--red);
		border-radius: 0 8px 8px 0;
		padding: 16px 20px;
		margin-bottom: 32px;
	}
	.clue-label {
		font-family: var(--font-bold);
		font-size: 11px; font-weight: 900;
		text-transform: uppercase;
		letter-spacing: 1px;
		color: var(--red);
		margin-bottom: 6px;
	}
	.clue-text { font-size: 16px; line-height: 1.5; color: var(--text); margin-bottom: 6px; }

	.wrong-section { text-align: center; margin-bottom: 24px; min-height: 36px; }
	.wrong-label {
		font-size: 12px; font-weight: 600;
		text-transform: uppercase; letter-spacing: 1px;
		color: #999; margin-bottom: 6px;
	}
	.wrong-letters { display: flex; justify-content: center; gap: 6px; flex-wrap: wrap; }
	.wrong-letter {
		width: 30px; height: 30px;
		border-radius: 6px;
		background: #f0e0e0; color: #c53030;
		font-size: 14px; font-weight: 700;
		display: flex; align-items: center; justify-content: center;
		animation: wrongPop .3s cubic-bezier(.34,1.56,.64,1);
	}
	@keyframes wrongPop {
		0% { transform: scale(0); }
		100% { transform: scale(1); }
	}

	.retry-wrap { display: flex; justify-content: center; margin-top: 24px; }
	.btn-retry {
		border: 1.5px solid var(--red);
		background: #fff; color: var(--red);
		border-radius: 28px; padding: 11px 28px;
		font-size: 15px; font-weight: 600;
		cursor: pointer; transition: background .15s, color .15s;
	}
	.btn-retry:hover { background: var(--red); color: #fff; }

	.guess-counter {
		margin-top: 16px;
		font-size: 15px; font-weight: 600;
		color: var(--text-muted);
		text-align: center;
	}
	.guess-counter .count { color: var(--red); font-size: 20px; }
	.guess-counter .won { color: var(--green); }
	.guess-counter .lost { color: var(--red); }

	@media (max-width: 768px) {
		.layout {
			flex-direction: column-reverse;
			padding: 20px 16px 40px;
			gap: 24px;
		}
		.visual-panel {
			position: static;
			flex-direction: row;
			align-items: center;
			gap: 16px;
			width: 100%;
			padding-top: 0;
		}
		.guess-counter { margin-top: 0; }
		.game-title { font-size: 28px; }
	}

	@media (max-width: 600px) {
		header { padding: 12px 16px; }
		.layout { padding: 16px 14px 32px; gap: 20px; }
		.game-title { font-size: 24px; }
		.clue-text { font-size: 17px; }
	}

	@media (max-width: 375px) {
		.layout { padding: 12px 10px 24px; }
		.game-title { font-size: 22px; }
		.clue-text { font-size: 15px; }
	}
</style>
