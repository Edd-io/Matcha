<script lang="ts">
		import { navigate } from "svelte-routing";
		import DoubleRangeSlider from "./Double-range-slider.svelte";
		import SimpleRangeSlider from "./Simple-range-slider.svelte";
		import Choose_interests from "../Register/Choose_interests.svelte";
		import Notsaved from "./not-save.svelte";

		let min_age: number;
		let max_age: number;
		let range: number;

		let interests: number[] = [];
		globalThis.path.set('/filter');

		function back()
		{
			globalThis.filterData = {
				min_age: min_age,
				max_age: max_age,
				range: range,
				interests: interests
			};
			globalThis.pageLoaded = false;
			navigate(globalThis.last_path);
		};
		min_age = globalThis.filterData.min_age;
		max_age = globalThis.filterData.max_age;
		range = globalThis.filterData.range;
		interests = globalThis.filterData.interests;
		$: localStorage.setItem('min_age', String(min_age));
		$: localStorage.setItem('max_age', String(max_age));
		$: localStorage.setItem('range', String(range));
		$: localStorage.setItem('interests', JSON.stringify(interests));
</script>
	
<main>
		<div class="top-notif">
			<button class="back-button" aria-label='Retour' on:click={() => back()}>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" class="arrow-icon">
							<path fill="none" stroke="currentColor" stroke-width="2" d="M5 12h14M12 5l7 7-7 7"/>
						</svg>
			</button>
			<p class="small-text" id="notif-txt">Filtrage</p>
		</div>
		<p class="text">Tranche d'age [{min_age} - {max_age == 100 ? '100+' : max_age}]</p>
		<DoubleRangeSlider bind:min_age={min_age} bind:max_age={max_age} />
		<p class="text">Distance [{range == 100 ? '100+' : range}] km</p>
		<SimpleRangeSlider bind:range={range}/>
		<p class="text">Interets</p>
		<div style="width: 100%; height: 10rem; margin-top: 1rem; max-width: 100%; padding-inline: 3.5rem;">
			<Choose_interests bind:selected_interests={interests}/>
		</div>
		<Notsaved />
</main>

<style>

	main {
        position: absolute;
        height: 100vh;
        width: 100vw;
        background-color: white;
        top: 0;
        z-index: 4;
		max-width: 40rem;
		margin: auto;
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