import type { GameStatus } from '$lib/stores/gameStore';
import { MAX_WRONG } from '$lib/data/words';

export function buildShareText(
	status: GameStatus,
	wrongCount: number,
	weekNum: number,
	year: number
): string {
	let text = `Giljotinen \u2014 Uke ${weekNum}, ${year}\n\n`;
	for (let i = 0; i < MAX_WRONG; i++) {
		text += i < wrongCount ? '\u{1F7E5}' : '\u2B1C';
	}
	const won = status === 'won';
	text += '\n' + (won ? '\u2705 Løst!' : '\u274C Ikke løst');
	text += ` (${wrongCount}/${MAX_WRONG} feil)`;
	return text;
}

export async function copyToClipboard(text: string): Promise<boolean> {
	try {
		await navigator.clipboard.writeText(text);
		return true;
	} catch {
		return false;
	}
}
