<script>
    import { onMount } from "svelte";

	export let page;

	function emit()
	{
		const customEvent = new CustomEvent('btnClicked', {});
	
		window.dispatchEvent(customEvent);
	}

	onMount(() => {
		const handleKeyDown = (event) => {
			if (event.key === 'Enter')
				emit();
		};

		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	});
</script>

<main>
	{#if page !== 2}
		<button class="next-button" on:click={() => (emit())} aria-label='Page suivante'>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" class="arrow-icon">
				<path fill="none" style="filter: invert(var(--invert-svg));" stroke="currentColor" stroke-width="2" d="M5 12h14M12 5l7 7-7 7"/>
			</svg>
		</button>
	{/if}
</main>