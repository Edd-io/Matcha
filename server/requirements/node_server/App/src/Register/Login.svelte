<script lang="ts">
	import LogoRegister from "./Logo-register.svelte";
	import NextButton from './Next-button.svelte';
	import { onMount } from 'svelte';
	import { navigate } from 'svelte-routing';

	onMount(() => {
		window.addEventListener('btnClicked', log);

		return (() => {
			window.removeEventListener('btnClicked', log);
		});
	});


	function log()
	{
		fetch('/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email: document.querySelector('#email').value,
				password: document.querySelector('#password').value
			}),
		})
		.then(response => response.json())
		.then(data => {
			if (data.success)
			{
				globalThis.connected.set(true);
				navigate('/');
			}
			else
			{
				err = true;
				console.log('Error:', data);
			}
		})
		.catch((error) => {
			console.error('Error:', error);
		});
	}

	let err = false;
</script>

<main>
	<button class="back" aria-label='Retour' on:click={() => navigate('/')}>
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" class="arrow-icon">
			<path fill="none" stroke="currentColor" stroke-width="2" d="M5 12h14M12 5l7 7-7 7"/>
		</svg>
	</button>
	<LogoRegister />
	<div class="main">
		<p class="text" id="txt">Connecte toi pour fgdfgdfg</p>
		{#if err}
			<p>Email ou mot de passe incorrect</p>
		{/if}
		<div class="login">
			<input class="input-text" style='margin-top: 70px;' id="email" type="text" placeholder="Email" />
		</div>
		<div class="password">
			<input class="input-text" type="password" id="password" placeholder="Mot de passe" />
		</div>
	</div>
	<div id="next-button">
		<NextButton page={0}/>
	</div>
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		text-align: center;
		height: 100vh;
		background-color: white;
		max-width: 40rem;
		margin: 0 auto;
	}

	.main {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}

	#txt {
		margin-top: 100px;
	}

	.back {
		position: absolute;
		top: 20px;
		left: 20px;
		border: none;
		cursor: pointer;
		background: none;
		rotate: 180deg;
	}

	.back svg {
		height: 2.5rem;
		width: 2.5rem;
	}

	.login {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100%;
		margin-bottom: 20px;
	}

	.password {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100%;
		margin-bottom: 20px;
	}

	#next-button {
		display: flex;
		justify-content: center;
		width: 100%;
		margin-top: 175px;
	}
</style>