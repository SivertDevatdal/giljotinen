import { MAX_WRONG } from '$lib/data/words';

export const BLADE_TRAVEL = 300;
export const TRACK_REST_Y2 = 193;
export const HEAD_LUNETTE_Y = 565.28;
export const HEAD_BASKET_Y = 666.56;

export function easeOutBounce(t: number): number {
	if (t < 1 / 2.75) return 7.5625 * t * t;
	if (t < 2 / 2.75) { t -= 1.5 / 2.75; return 7.5625 * t * t + 0.75; }
	if (t < 2.5 / 2.75) { t -= 2.25 / 2.75; return 7.5625 * t * t + 0.9375; }
	t -= 2.625 / 2.75;
	return 7.5625 * t * t + 0.984375;
}

export function easeInQuad(t: number): number {
	return t * t;
}

export function bladeOffsetForStep(wrongCount: number): number {
	const c = Math.min(wrongCount, MAX_WRONG);
	if (c === 0) return 0;
	const half = BLADE_TRAVEL / 2;
	if (c < MAX_WRONG) return (c / (MAX_WRONG - 1)) * half;
	return BLADE_TRAVEL;
}
