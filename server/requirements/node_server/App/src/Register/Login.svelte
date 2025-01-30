<script lang="ts">
	import LogoRegister from "./Logo-register.svelte";
	import NextButton from './Next-button.svelte';
	import { onMount } from 'svelte';

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
				console.log('Success:', data);
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
		/* align-items: center; */
		/* justify-content: center; */
		text-align: center;
		height: 100vh;
		background-color: #f0f0f0;
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