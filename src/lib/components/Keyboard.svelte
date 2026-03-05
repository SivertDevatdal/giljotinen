<script lang="ts">
	interface Props {
		guessedLetters: Set<string>;
		correctLetters: Set<string>;
		disabled: boolean;
		canUndo: boolean;
		onguess: (letter: string) => void;
		onundo: () => void;
	}

	let { guessedLetters, correctLetters, disabled, canUndo, onguess, onundo }: Props = $props();

	const ROWS_3 = [
		['Q','W','E','R','T','Y','U','I','O','P','Å'],
		['A','S','D','F','G','H','J','K','L','Ø','Æ'],
		['Z','X','C','V','B','N','M']
	];

	function keyClass(letter: string): string {
		if (!guessedLetters.has(letter)) return '';
		return correctLetters.has(letter) ? 'correct' : 'wrong';
	}

	function isDisabledKey(letter: string): boolean {
		return disabled || guessedLetters.has(letter);
	}
</script>

<svelte:window onkeydown={(e) => {
	if (e.ctrlKey || e.metaKey || e.altKey) return;
	const key = e.key.toUpperCase();
	if (ROWS_3.flat().includes(key)) { e.preventDefault(); onguess(key); }
	if (e.key === 'Backspace') { e.preventDefault(); onundo(); }
}} />

<div class="keyboard">
	{#each ROWS_3 as row, rowIdx}
		<div class="kb-row">
			{#each row as letter}
				<button
					class="kb-key {keyClass(letter)}"
					disabled={isDisabledKey(letter)}
					onclick={() => onguess(letter)}
				>{letter}</button>
			{/each}
			{#if rowIdx === ROWS_3.length - 1}
				<button
					class="kb-key kb-backspace"
					disabled={!canUndo || disabled}
					onclick={onundo}
					aria-label="Angre"
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="M21 4H8l-7 8 7 8h13a2 2 0 002-2V6a2 2 0 00-2-2z"/>
						<line x1="18" y1="9" x2="12" y2="15"/><line x1="12" y1="9" x2="18" y2="15"/>
					</svg>
				</button>
			{/if}
		</div>
	{/each}
</div>

<style>
	.keyboard {
		display: flex;
		flex-direction: column;
		gap: 6px;
		align-items: center;
	}
	.kb-row {
		display: flex;
		gap: 5px;
		justify-content: center;
	}
	.kb-key {
		width: 38px;
		height: 46px;
		border: 1.5px solid #d0d0d0;
		border-radius: 8px;
		background: #fff;
		color: var(--text);
		font-size: 15px;
		font-weight: 700;
		cursor: pointer;
		transition: all .15s;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.kb-backspace {
		width: 52px;
		background: #eee;
	}
	.kb-key:hover:not(:disabled) {
		background: #f0f0f0;
		border-color: #aaa;
	}
	.kb-key:active:not(:disabled) {
		transform: scale(.93);
	}
	.kb-key:disabled { cursor: default; }
	.kb-key.correct {
		background: #d4edda;
		border-color: var(--green);
		color: #1a6b30;
	}
	.kb-key.wrong {
		background: #e8e8e8;
		border-color: #ccc;
		color: #aaa;
	}

	@media (max-width: 600px) {
		.kb-key { width: 30px; height: 40px; font-size: 13px; }
	}
	@media (max-width: 375px) {
		.kb-key { width: 26px; height: 36px; font-size: 12px; border-radius: 6px; }
		.kb-row { gap: 3px; }
	}
</style>
