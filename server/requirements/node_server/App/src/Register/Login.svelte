<script lang="ts">
	import LogoRegister from "./Logo-register.svelte";
	import NextButton from './Next-button.svelte';
	import { onMount } from 'svelte';
	import { navigate } from 'svelte-routing';

	let err: boolean | string = false;
	let showPopup = false;
	let resetMessage = '';
	let resetSuccess = false;

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
				if (data.error === 'User already connected')
					err = 'Vous êtes déjà connecté';
				else
					err = 'Email ou mot de passe incorrect';
				console.log('Error:', data);
			}
		})
		.catch((error) => {
			console.error('Error:', error);
		});
	}

	function handlePasswordReset()
	{
		const emailInput = document.querySelector('#reset-email');
		const email = emailInput.value.trim();
		
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!email) {
			resetMessage = 'Veuillez entrer votre adresse email';
			resetSuccess = false;
			return;
		}
		if (!emailRegex.test(email)) {
			resetMessage = 'Veuillez entrer une adresse email valide';
			resetSuccess = false;
			return;
		}
		fetch('/reset_password', {
			method: 'POST',
			headers: {
			'Content-Type': 'application/json'
			},
			body: JSON.stringify({ email })
		})
		.then(response => response.json())
		.then(data => {
			resetSuccess = true;
			resetMessage = 'Si un compte est associé à cette adresse, un email de réinitialisation vous sera envoyé.';
			emailInput.value = '';
			setTimeout(() => {
				showPopup = false;
				resetMessage = '';
			}, 3000);
		})
		.catch(error => {
			resetSuccess = false;
			resetMessage = 'Une erreur est survenue. Veuillez réessayer plus tard.';
		});
		}
		function passwordForgotten() {
			showPopup = true;
			resetMessage = '';
		}
</script>

<main>
	<button class="back" aria-label='Retour' on:click={() => navigate('/')}>
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" class="arrow-icon">
			<path fill="none" stroke="currentColor" stroke-width="2" d="M5 12h14M12 5l7 7-7 7"/>
		</svg>
	</button>
	<LogoRegister />
	<div class="main">
		<p class="text" id="txt">Heureux de vous revoir ! Connectez-vous dès maintenant.</p>
		{#if err}
			<p>{err}</p>
		{/if}
		<div class="login">
			<input class="input-text" style='margin-top: 70px;' id="email" type="text" placeholder="Email" />
		</div>
		<div class="password">
			<input class="input-text" type="password" id="password" placeholder="Mot de passe" />
		</div>
		<p class="text-forget">Mot de passe oublié ? Clique <button type="button" class="link-button" on:click={passwordForgotten} aria-label="Mot de passe oublié">ici</button></p>
	</div>
	<div id="next-button">
		<NextButton page={0}/>
	</div>
	{#if showPopup}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="popup-overlay" on:click={() => showPopup = false}>
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div class="popup" on:click|stopPropagation>
			<h2>Réinitialisation du mot de passe</h2>
			<p>Entrez votre adresse email pour recevoir un lien de réinitialisation</p>
			{#if resetMessage}
				<p class="reset-message {resetSuccess ? 'success' : 'error'}">{resetMessage}</p>
			{/if}
			<div class="popup-input">
				<input type="email" id="reset-email" placeholder="Votre email" class="input-text" />
			</div>
			<button class="reset-button" on:click={handlePasswordReset}>Envoyer</button>
			<button class="reset-button" style="color: white; background-color: #111;">Annuler</button>
			</div>
		</div>
	{/if}
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		text-align: center;
		height: 100vh;
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

	.link-button {
		border: none;
		border-bottom: 2px solid #2ebc65;
		background-color: transparent;
		color: #2ebc65;
		cursor: pointer;
		font-size: 1rem;
	}

	.text-forget {
		margin-top: 20px;
		font-size: 1rem;
	}

	/* Ajouter à la fin du style */
	.popup-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(5px);
		border: none;
		z-index: 10;
	}

	.popup {
		position: absolute;
		display: flex;
		flex-direction: column;
		background-color: var(--background-color);
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 80%;
		padding: 20px;
		gap: 20px;
		border-radius: 2rem;
		z-index: 11;
	}

	.popup h2 {
		margin-top: 0;
		color: #2ebc65;
	}

	.popup-input {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.reset-button {
		color: white;
		padding: 10px 20px;
		border-radius: 2rem;
		cursor: pointer;
		border: none;
		font-weight: 600;
		background-color: #2ebc65;
	}

	.reset-message {
		padding: 0.5rem;
		border-radius: 0.25rem;
		margin: 0.5rem 0;
	}

	.success {
		background-color: rgba(46, 188, 101, 0.1);
		color: #2ebc65;
	}

	.error {
		background-color: rgba(255, 0, 0, 0.1);
		color: red;
	}

</style>