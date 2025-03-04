<script lang="ts">
	import LogoRegister from "./Logo-register.svelte";
	import NextButton from './Next-button.svelte';
	import { onMount } from 'svelte';
	import { navigate } from 'svelte-routing';

	let err = false;
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
				console.log('Error:', data);
			}
		})
		.catch((error) => {
			console.error('Error:', error);
		});
	}

	function handlePasswordReset() {
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
			<p>Email ou mot de passe incorrect</p>
		{/if}
		<div class="login">
			<input class="input-text" style='margin-top: 70px;' id="email" type="text" placeholder="Email" />
		</div>
		<div class="password">
			<input class="input-text" type="password" id="password" placeholder="Mot de passe" />
		</div>
		<p class="text">Mot de passe oublié ? Clique <button type="button" class="link-button" on:click={passwordForgotten} aria-label="Mot de passe oublié">ici</button></p>
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
			<button class="close-button" on:click={() => showPopup = false} aria-label="Fermer">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
				<path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
				</svg>
			</button>
			<h2>Réinitialisation du mot de passe</h2>
			<p>Entrez votre adresse email pour recevoir un lien de réinitialisation</p>
			{#if resetMessage}
				<p class="reset-message {resetSuccess ? 'success' : 'error'}">{resetMessage}</p>
			{/if}
			<div class="popup-input">
				<input type="email" id="reset-email" placeholder="Votre email" class="input-text" />
			</div>
			<button class="reset-button" on:click={handlePasswordReset}>Envoyer</button>
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

	.link-button {
		background-color: rgb(213, 221, 211);
		padding: 0.2rem;
		padding-inline: 0.5rem;
		border-radius: 0.2rem;
		border: none;
		color: #2ebc65;
		cursor: pointer;
	}

	/* Ajouter à la fin du style */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.popup {
  background-color: white;
  padding: 2rem;
  border-radius: 0.5rem;
  width: 90%;
  max-width: 400px;
  position: relative;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.close-button {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
}

.close-button:hover {
  color: #000;
}

.popup h2 {
  margin-top: 0;
  color: #2ebc65;
}

.popup-input {
  margin: 1.5rem 0;
}

.reset-button {
  background-color: #2ebc65;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.25rem;
  cursor: pointer;
  font-weight: bold;
}

.reset-button:hover {
  background-color: #259c53;
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