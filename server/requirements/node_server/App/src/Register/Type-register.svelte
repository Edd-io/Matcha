<script lang="ts">
	import { onMount } from "svelte";
	import MaleLogo from "../assets/Male.svg";
	import FemaleLogo from "../assets/Female.svg";
	import OtherLogo from "../assets/Other.svg";

	export let dataSecondStep: any;
	export let page: number;
  
	let hisGender = null;
	let hisType = null;
	let err = false;

  
	onMount(() => {
		window.addEventListener('btnClicked', clicked);

		return (() => {
			window.removeEventListener('btnClicked', clicked);
		});
	});

	function clicked()
	{
		if (hisGender === null || hisType === null)
		{
			err = true;
			return ;
		}
		dataSecondStep.gender = hisGender;
		dataSecondStep.genderSearched = hisType;
		page++;
	}
  
	function handleClick(buttonIndex: number)
	{
		hisGender = buttonIndex;
	}

	function handleClickType(buttonIndex: number)
	{
		hisType = buttonIndex;
	}
</script>

<main>
	<p id="txt" class="text">Comment te définirais-tu ?</p>
	<div class="container">
		{#each [0, 1, 2] as index}
			<button
				class={hisGender === index ? "selected" : "default"}
				on:click={() => handleClick(index)}
				style='position: relative;'
			>
				{#if index === 0}
					<img src={MaleLogo} alt="MaleLogo"/>
					<p class="small-text">Homme</p>
				{:else if index === 1}
					<img src={FemaleLogo} alt="FemaleLogo"/>
					<p class="small-text">Femme</p>
				{:else}
					<img src={OtherLogo} alt="OtherLogo"/>
					<p class="small-text">Autre</p>
				{/if}
			</button>
		{/each}
	</div>
	<p id="txt2" class="text">Et quel genre aimerais-tu rencontrer ?</p>
	<div class="container">
		{#each [0, 1, 2] as index}
			<button
				class={hisType === index ? "selected" : "default"}
				on:click={() => handleClickType(index)}
				style='position: relative;'
			>
				{#if index === 0}
					<img src={MaleLogo} alt="MaleLogo"/>
					<p class="small-text">Homme</p>
				{:else if index === 1}
					<img src={FemaleLogo} alt="FemaleLogo"/>
					<p class="small-text">Femme</p>
				{:else}
					<img src={OtherLogo} alt="OtherLogo"/>
					<p class="small-text">Autre</p>
				{/if}
			</button>
		{/each}
	</div>
	{#if err}
		<p class="text" style="color: red; margin-top: 1rem">Veuillez sélectionner une option pour chaque question.</p>
	{/if}
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		padding: 20px;
		color: #111111;
		width: 100%;
		max-width: 35rem;
	}

	#txt {
		margin-top: 60px;
	}

	#txt2 {
		margin-top: 40px;
	}

	button {
		height: 3.3rem;
		width: 3.3rem;
		border: none;
		border-radius: 1rem;
		font-size: 16px;
		cursor: pointer;
		transition: background-color 0.3s ease;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.default {
		background-color: #d9d9d9;
		color: #111111;
	}

	.selected {
		background-color: #1ac83f;
	}

	.selected img {
		filter: invert(100%);
	}

	.container {
		display: flex;
		gap: 20px;
		margin-top: 40px;
		margin-bottom: 30px;
	}

	.small-text {
		position: absolute;
		font-size: 0.8rem;
		color: #111111;
		bottom: -1.7rem;
	}
</style>