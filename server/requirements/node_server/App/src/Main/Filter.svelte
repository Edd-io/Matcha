<script lang="ts">
		import ChooseInterests from "../Register/Choose_interests.svelte";
		import DoubleRangeSlider from "./Double-range-slider.svelte";
		import SimpleRangeSlider from "./Simple-range-slider.svelte";

		let min_age: number;
		let max_age: number;
		let range: number;

		let interests: number[] = [];
		let choose_interests_visible = false;
		globalThis.path.set('/filter');
</script>
	
<main>
		<div class="top-notif">
				<button class="back-button" aria-label='Retour'>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" class="arrow-icon">
								<path fill="none" stroke="currentColor" stroke-width="2" d="M5 12h14M12 5l7 7-7 7"/>
							</svg>
				</button>
				<p class="small-text" id="notif-txt">Filtrage</p>
		</div>
		<p class="text">Tranche d'age [{min_age} - {max_age}]</p>
		<DoubleRangeSlider bind:min_age={min_age} bind:max_age={max_age} />
		<p class="text">Distance [{range}] km</p>
		<SimpleRangeSlider bind:range={range}/>
		<p class="text">Interets</p>
		<button class="next-button" aria-label="Bouton ajout d'interets" on:click={() => choose_interests_visible = true}>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#111111" d="M11 13H5v-2h6V5h2v6h6v2h-6v6h-2z"/></svg>
		</button>
		{#if choose_interests_visible}
			<ChooseInterests bind:selected_interests={interests} />
		{/if}
</main>

<style>

	main {
        position: absolute;
        height: 100vh;
        width: 100vw;
        background-color: white;
        top: 0;
        left: 0;
        z-index: 4;
    }

	.text{
		margin-left: 3.5rem;
		margin-top: 2rem;
		margin-bottom: 1rem;
	}

	.top-notif {
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 0 20px;
			height: 10vh;
			width: 100%;
	}

	.back-button {
			position: absolute;
			left: 40px;
			border: none;
			cursor: pointer;
			background: none;
			color: #111111;
			transform: rotate(180deg) scale(2);
	}

	#notif-txt {
			font-weight: 400;
			font-size: 1.1rem;
			text-align: center;
			justify-content: center;
			margin-top: 5px;
	}
</style>