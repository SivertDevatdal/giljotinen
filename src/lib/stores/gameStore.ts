import { writable, derived, get } from 'svelte/store';
import { getWordForWeek, type WeeklyWord, MAX_WRONG } from '$lib/data/words';
import { stateKey, saveState, loadState, clearState } from '$lib/utils/persistence';

export type GameStatus = 'playing' | 'won' | 'lost';

interface GameState {
	currentWord: WeeklyWord;
	guessedLetters: Set<string>;
	correctLetters: Set<string>;
	wrongLetters: string[];
	guessHistory: string[];
	gameStatus: GameStatus;
	startedAt: string | null;
}

function createGameStore() {
	const word = getWordForWeek();

	const initial: GameState = {
		currentWord: word,
		guessedLetters: new Set(),
		correctLetters: new Set(),
		wrongLetters: [],
		guessHistory: [],
		gameStatus: 'playing',
		startedAt: null
	};

	const { subscribe, set, update } = writable<GameState>(initial);

	function getKey(state: GameState): string {
		return stateKey(state.currentWord.year, state.currentWord.weekNum);
	}

	function persist(state: GameState): void {
		saveState(getKey(state), {
			word: state.currentWord.word,
			guessedLetters: Array.from(state.guessedLetters),
			wrongLetters: state.wrongLetters,
			correctLetters: Array.from(state.correctLetters),
			gameStatus: state.gameStatus,
			startedAt: state.startedAt
		});
	}

	function restore(): boolean {
		const w = getWordForWeek();
		const key = stateKey(w.year, w.weekNum);
		const saved = loadState(key, w.word);
		if (!saved) return false;

		set({
			currentWord: w,
			guessedLetters: new Set(saved.guessedLetters),
			correctLetters: new Set(saved.correctLetters),
			wrongLetters: saved.wrongLetters,
			guessHistory: [],
			gameStatus: saved.gameStatus as GameStatus,
			startedAt: saved.startedAt
		});
		return true;
	}

	function guessLetter(letter: string): 'correct' | 'wrong' | 'ignored' {
		const state = get({ subscribe });
		if (state.gameStatus !== 'playing') return 'ignored';
		if (state.guessedLetters.has(letter)) return 'ignored';

		const wordLetters = new Set(state.currentWord.word.split(''));
		const isCorrect = wordLetters.has(letter);

		update((s) => {
			if (!s.startedAt) s.startedAt = new Date().toISOString();

			s.guessedLetters = new Set([...s.guessedLetters, letter]);
			s.guessHistory = [...s.guessHistory, letter];

			if (isCorrect) {
				s.correctLetters = new Set([...s.correctLetters, letter]);
				const allFound = [...wordLetters].every((ch) => s.correctLetters.has(ch));
				if (allFound) s.gameStatus = 'won';
			} else {
				s.wrongLetters = [...s.wrongLetters, letter];
				if (s.wrongLetters.length >= MAX_WRONG) s.gameStatus = 'lost';
			}

			persist(s);
			return { ...s };
		});

		return isCorrect ? 'correct' : 'wrong';
	}

	function undo(): string | null {
		let removed: string | null = null;

		update((s) => {
			if (s.gameStatus !== 'playing' || s.guessHistory.length === 0) return s;

			const last = s.guessHistory[s.guessHistory.length - 1];
			removed = last;

			const newGuessed = new Set(s.guessedLetters);
			newGuessed.delete(last);

			const newCorrect = new Set(s.correctLetters);
			newCorrect.delete(last);

			const wasWrong = !s.correctLetters.has(last);
			const newWrong = wasWrong ? s.wrongLetters.slice(0, -1) : [...s.wrongLetters];

			const result: GameState = {
				...s,
				guessedLetters: newGuessed,
				correctLetters: newCorrect,
				wrongLetters: newWrong,
				guessHistory: s.guessHistory.slice(0, -1)
			};
			persist(result);
			return result;
		});

		return removed;
	}

	function reset(): void {
		const state = get({ subscribe });
		clearState(getKey(state));

		set({
			currentWord: state.currentWord,
			guessedLetters: new Set(),
			correctLetters: new Set(),
			wrongLetters: [],
			guessHistory: [],
			gameStatus: 'playing',
			startedAt: null
		});
	}

	return {
		subscribe,
		guessLetter,
		undo,
		reset,
		restore
	};
}

export const gameStore = createGameStore();

export const wrongCount = derived(gameStore, ($s) => $s.wrongLetters.length);
export const isPlaying = derived(gameStore, ($s) => $s.gameStatus === 'playing');
export const isWon = derived(gameStore, ($s) => $s.gameStatus === 'won');
export const isLost = derived(gameStore, ($s) => $s.gameStatus === 'lost');
export const isFinished = derived(gameStore, ($s) => $s.gameStatus !== 'playing');
