<script lang='ts'>
	import Choose_interests from './Choose_interests.svelte';
	import { onMount } from 'svelte';

	export let page: number;
	export let dataSecondStep: any;
	export let token: string;

	let interests: number[] = [];
	let choose_interests_visible = false;
	let err_description = false;
	let err_interests = false;
	let sent = false;

	onMount(() => {
		window.addEventListener('btnClicked', clicked);
	
		return (() => {
			window.removeEventListener('btnClicked', clicked);
		});
	});

	function clicked()
	{
		err_interests = false;
		err_description = false;
		if (interests.length === 0)
			err_interests = true;
		if ((document.querySelector('#inp') as HTMLInputElement).value === '')
			err_description = true;
		if (err_interests || err_description)
			return ;
		sent = true;
		dataSecondStep.bio = (document.querySelector('#inp') as HTMLInputElement).value;
		dataSecondStep.tags = interests;
		const body = {...dataSecondStep, token};
		fetch('/second_step_register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(body)
		}).then(res => res.json())
		.then(data => {
			sent = false;
			if (data.success)
				page++;
			console.log(data);
		});
	}
</script>

<main>

	<p id="txt1" class="text">Raconte ce que tu veux pour attiser <br> la curiosité !</p>
	<p class='error' style='display: {err_description ? "block" : "none"}'>Veuillez remplir ce champ</p>
	<textarea id="inp" class="input-text" placeholder="Description..."></textarea>
	<p id="txt" class="text">Quels sont tes centres d’interets ?</p>
	<p class='error' style='display: {err_interests ? "block" : "none"}'>Veuillez choisir au moins un centre d'interet</p>
	<button class="next-button" aria-label="Bouton ajout d'interets" on:click={() => choose_interests_visible = true}>
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#111111" d="M11 13H5v-2h6V5h2v6h6v2h-6v6h-2z"/></svg>
	</button>
	{#if sent}
		<div class="loading"></div>
	{/if}
	{#if choose_interests_visible}
		<Choose_interests bind:selected_interests={interests} bind:visible={choose_interests_visible}/>
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
	}

	#txt1 {
		margin-top: 60px;
	}

	#txt {
		margin-top: 40px;
		width: 90%;
		/* max-width: 35rem; */
	}

	#inp {
		height: 5rem;
		margin-top: 40px;
		resize: none;
	}

	button{
		margin-top: 30px;
	}

	.next-button svg {
		width: 18px;
		height: 18px;
		fill: #111111;
	}

	.error {
		color: red;
		font-size: 0.8rem;
		margin-top: 10px;
		display: none;
	}
</style>