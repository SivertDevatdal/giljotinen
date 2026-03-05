<script lang="ts">
	interface Props {
		word: string;
		correctLetters: Set<string>;
		gameStatus: 'playing' | 'won' | 'lost';
	}

	let { word, correctLetters, gameStatus }: Props = $props();

	function slotClass(ch: string): string {
		if (correctLetters.has(ch)) return 'letter-slot revealed';
		if (gameStatus === 'lost') return 'letter-slot lost-reveal';
		return 'letter-slot';
	}

	function slotText(ch: string): string {
		if (correctLetters.has(ch)) return ch;
		if (gameStatus === 'lost') return ch;
		return '';
	}
</script>

<div class="word-display">
	{#each word.split('') as ch}
		<div class={slotClass(ch)}>{slotText(ch)}</div>
	{/each}
</div>

<style>
	.word-display {
		display: flex;
		justify-content: center;
		gap: 8px;
		margin-bottom: 32px;
		flex-wrap: wrap;
	}
	.letter-slot {
		width: 44px;
		height: 52px;
		border-bottom: 3px solid #ccc;
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: var(--font-bold);
		font-size: 32px;
		font-weight: 900;
		color: var(--text);
		text-transform: uppercase;
		transition: border-color .3s, transform .3s;
	}
	.letter-slot.revealed {
		border-color: var(--green);
		animation: letterPop .4s cubic-bezier(.34,1.56,.64,1);
	}
	.letter-slot.lost-reveal {
		border-color: var(--red);
		color: var(--red);
	}
	@keyframes letterPop {
		0% { transform: scale(1); }
		50% { transform: scale(1.15); }
		100% { transform: scale(1); }
	}

	@media (max-width: 768px) {
		.letter-slot { width: 40px; height: 48px; font-size: 28px; }
	}
	@media (max-width: 600px) {
		.letter-slot { width: 36px; height: 44px; font-size: 26px; }
	}
	@media (max-width: 375px) {
		.letter-slot { width: 30px; height: 38px; font-size: 22px; }
		.word-display { gap: 5px; }
	}
</style>
