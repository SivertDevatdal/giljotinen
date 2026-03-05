<script lang="ts">
	interface Props {
		open: boolean;
		onclose: () => void;
	}

	let { open, onclose }: Props = $props();
</script>

<svelte:window onkeydown={(e) => { if (e.key === 'Escape' && open) onclose(); }} />

{#if open}
	<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
	<div class="modal-backdrop" class:open onclick={onclose} role="presentation"></div>
	<div class="modal" class:open role="dialog" aria-modal="true">
		<button class="modal-close" onclick={onclose} aria-label="Lukk">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
			</svg>
		</button>

		<div class="help-content">
			<h3>Slik spiller du</h3>
			<p>Gjett ukens skjulte ord, bokstav for bokstav. Du får en ledetråd som hint.</p>
			<ul>
				<li>Trykk på en bokstav for å gjette.</li>
				<li>Riktig bokstav avslører alle forekomster i ordet.</li>
				<li>Feil bokstav senker giljotinbladet ett hakk.</li>
				<li>Du har <strong>6 feil</strong> før bladet faller.</li>
				<li>Bruk tilbaketasten for å angre siste gjett.</li>
			</ul>
			<p>Nytt ord hver uke. Del resultatet med venner!</p>
		</div>
	</div>
{/if}

<style>
	.modal-backdrop {
		position: fixed; inset: 0;
		background: rgba(0,0,0,.45);
		z-index: 300; opacity: 0;
		transition: opacity .35s ease;
	}
	.modal-backdrop.open { opacity: 1; }

	.modal {
		position: fixed;
		top: 50%; left: 50%;
		transform: translate(-50%, -50%) scale(.92);
		background: #fff; border-radius: 16px;
		max-width: 440px; width: calc(100% - 40px);
		max-height: 90vh; overflow-y: auto;
		z-index: 301; padding: 36px 28px 28px;
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

	.help-content { text-align: left; }
	.help-content h3 {
		font-family: var(--font-bold);
		font-size: 18px; margin-bottom: 8px;
	}
	.help-content p {
		font-size: 14px; line-height: 1.6;
		color: var(--text-muted); margin-bottom: 14px;
	}
	.help-content ul {
		font-size: 14px; line-height: 1.8;
		color: var(--text-muted); padding-left: 20px; margin-bottom: 14px;
	}
</style>
