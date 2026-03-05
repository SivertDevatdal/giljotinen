import type { GameStatus } from '$lib/stores/gameStore';

const LS_PREFIX = 'gilj_sv_';

export interface SavedState {
	word: string;
	guessedLetters: string[];
	wrongLetters: string[];
	correctLetters: string[];
	gameStatus: GameStatus;
	startedAt: string | null;
}

export function stateKey(year: number, weekNum: number): string {
	return `${LS_PREFIX}${year}_${weekNum}`;
}

export function saveState(key: string, state: SavedState): void {
	try {
		localStorage.setItem(key, JSON.stringify(state));
	} catch {}
}

export function loadState(key: string, expectedWord: string): SavedState | null {
	try {
		const raw = localStorage.getItem(key);
		if (!raw) return null;
		const s: SavedState = JSON.parse(raw);
		if (s.word !== expectedWord) return null;
		return s;
	} catch {
		return null;
	}
}

export function clearState(key: string): void {
	try {
		localStorage.removeItem(key);
	} catch {}
}
