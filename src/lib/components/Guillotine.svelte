<script lang="ts">
	import { onDestroy } from 'svelte';
	import {
		BLADE_TRAVEL,
		TRACK_REST_Y2,
		HEAD_LUNETTE_Y,
		HEAD_BASKET_Y,
		easeOutBounce,
		easeInQuad,
		bladeOffsetForStep
	} from '$lib/utils/animation';
	import { MAX_WRONG } from '$lib/data/words';

	interface Props {
		wrongCount: number;
		gameStatus: 'playing' | 'won' | 'lost';
		instant?: boolean;
	}

	let { wrongCount, gameStatus, instant = false }: Props = $props();

	let bladeTransform = $state('translate(0,0)');
	let ropeY2 = $state(TRACK_REST_Y2);
	let headCy = $state(HEAD_LUNETTE_Y);
	let headOpacity = $state(0);
	let lunetteOpacity = $state(1);

	let currentOffset = 0;
	let animId: number | null = null;

	function applyOffset(offset: number) {
		currentOffset = offset;
		bladeTransform = `translate(0,${offset})`;
		ropeY2 = TRACK_REST_Y2 + offset;
	}

	function animateTo(target: number, onDone?: () => void) {
		if (animId) { cancelAnimationFrame(animId); animId = null; }
		const start = currentOffset;
		const delta = target - start;
		if (Math.abs(delta) < 0.5) {
			applyOffset(target);
			onDone?.();
			return;
		}
		const duration = 420 + Math.abs(delta) * 0.8;
		let startTime: number | null = null;

		function tick(now: number) {
			if (!startTime) startTime = now;
			const t = Math.min((now - startTime) / duration, 1);
			applyOffset(start + delta * easeOutBounce(easeInQuad(t)));
			if (t < 1) { animId = requestAnimationFrame(tick); }
			else { applyOffset(target); animId = null; onDone?.(); }
		}
		animId = requestAnimationFrame(tick);
	}

	function animateHeadFall() {
		lunetteOpacity = 0;
		headCy = HEAD_LUNETTE_Y;
		headOpacity = 1;
		const startY = HEAD_LUNETTE_Y;
		const endY = HEAD_BASKET_Y;
		const duration = 350;
		let startTime: number | null = null;

		function tick(now: number) {
			if (!startTime) startTime = now;
			const t = Math.min((now - startTime) / duration, 1);
			headCy = startY + (endY - startY) * easeOutBounce(easeInQuad(t));
			if (t < 1) requestAnimationFrame(tick);
		}
		requestAnimationFrame(tick);
	}

	function resetVisual() {
		if (animId) { cancelAnimationFrame(animId); animId = null; }
		applyOffset(0);
		headOpacity = 0;
		headCy = HEAD_LUNETTE_Y;
		lunetteOpacity = 1;
	}

	let prevWrong = 0;
	let prevStatus: string = 'playing';

	$effect(() => {
		if (gameStatus === 'playing' && prevStatus !== 'playing') {
			resetVisual();
			prevWrong = 0;
			prevStatus = 'playing';
			return;
		}

		if (instant && wrongCount > 0) {
			const offset = bladeOffsetForStep(wrongCount);
			applyOffset(offset);
			if (gameStatus === 'lost') {
				lunetteOpacity = 0;
				headOpacity = 1;
				headCy = HEAD_BASKET_Y;
			}
			prevWrong = wrongCount;
			prevStatus = gameStatus;
			instant = false;
			return;
		}

		if (wrongCount !== prevWrong) {
			const target = bladeOffsetForStep(wrongCount);
			animateTo(target, () => {
				if (wrongCount >= MAX_WRONG) {
					setTimeout(animateHeadFall, 100);
				}
			});
			prevWrong = wrongCount;
		}
		prevStatus = gameStatus;
	});

	onDestroy(() => {
		if (animId) cancelAnimationFrame(animId);
	});
</script>

<svg class="guillotine-svg" viewBox="80 110 440 620" xmlns="http://www.w3.org/2000/svg">
	<defs>
		<style>.gfill{fill:#e21f26}.gstroke{fill:none;stroke:#000;stroke-miterlimit:10;stroke-width:8px}</style>
	</defs>
	<!-- Frame -->
	<rect x="291.69" y="-58.06" width="10.94" height="397.76" transform="translate(437.98 -156.34) rotate(90)"/>
	<rect x="119.67" y="135.35" width="23.51" height="496.66"/>
	<rect x="451.13" y="135.35" width="23.51" height="496.66"/>
	<!-- Rope -->
	<line x1="297.4" y1="146" x2="297.4" y2={ropeY2} stroke="#e21f26" stroke-width="8" stroke-linecap="round"/>
	<!-- Blade -->
	<g transform={bladeTransform}>
		<rect class="gfill" x="293.47" y="151.43" width="7.87" height="42.4"/>
		<rect x="172.18" y="197.89" width="249.44" height="10.11" rx="3.99" ry="3.99"/>
		<polygon class="gfill" points="379.48 293.45 215.43 267.45 215.43 208.01 379.48 208.01 379.48 293.45"/>
	</g>
	<!-- Head -->
	<circle cx="296.6" cy={headCy} r="15.21" opacity={headOpacity}/>
	<!-- Lunette -->
	<rect x="143.18" y="527.3" width="307.95" height="7.12"/>
	<path d="M131.42,534.42v61.7h331.46v-61.7H131.42ZM296.59,591.43c-14.38,0-26.03-11.65-26.03-26.03s11.65-26.03,26.03-26.03,26.03,11.65,26.03,26.03-11.66,26.03-26.03,26.03Z"/>
	<circle cx="296.6" cy="565.28" r="15.21" opacity={lunetteOpacity}/>
	<rect x="143.18" y="596.12" width="307.95" height="7.12"/>
	<!-- Basket -->
	<path fill="#fff" d="M328.56,651.89c.06.2.09.4.09.6,0,.49-.17.96-.48,1.43l-.72,3.77-4.73,24.6h-.01c-.98,5.25-3.54,9.94-7.16,13.56-4.71,4.72-11.22,7.63-18.41,7.63s-13.7-2.91-18.41-7.63c-3.62-3.62-6.18-8.31-7.16-13.56h-.01l-4.73-24.6-.72-3.77c-.23-.35-.39-.71-.45-1.07,2.3,3.97,15.38,7.02,31.16,7.02,17.4,0,31.51-3.71,31.51-8.27,0-.1-.01-.21-.02-.31.03.04.05.09.07.13h.27l-.09.47Z"/>
	<ellipse class="gstroke" cx="296.6" cy="652.42" rx="31.51" ry="8.27"/>
	<path class="gstroke" d="M265.09,651.35l1.2,6.27,4.73,24.6h.01c.98,5.25,3.54,9.94,7.16,13.56,4.71,4.72,11.22,7.63,18.41,7.63s13.7-2.91,18.41-7.63c3.62-3.62,6.18-8.31,7.16-13.56h.01l4.73-24.6,1.2-6.27"/>
</svg>

<style>
	.guillotine-svg {
		width: 100%;
		max-width: 320px;
		height: auto;
	}

	@media (max-width: 768px) {
		.guillotine-svg { max-width: 220px; }
	}
	@media (max-width: 600px) {
		.guillotine-svg { max-width: 130px; }
	}
	@media (max-width: 375px) {
		.guillotine-svg { max-width: 100px; }
	}
</style>
