<script lang="ts">
	import { onMount } from 'svelte';
	import { navigate } from 'svelte-routing';

	export let token: string;

	fetch('/finish_register', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			token: token
		})
	}).then(res => {
		if (!res.ok)
			throw new Error("Error");
		res.json()
	})

	onMount(() => {
		function clicked()
		{
			globalThis.connected.set(true);
			navigate('/');
		}
		window.addEventListener('btnClicked', clicked);

		return (() => {
			window.removeEventListener('btnClicked', clicked);
		});
	});


</script>

<main>
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="m9.55 18l-5.7-5.7l1.425-1.425L9.55 15.15l9.175-9.175L20.15 7.4z"/></svg>
	<p id="txt" class="text">Votre compte a bien été crée !</p>
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

	svg {
		margin-top: 100px;
		width: 200px;
		height: 200px;
	}

	p {
		margin-top: 25px;
	}
</style>