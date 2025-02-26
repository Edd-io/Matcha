<script lang="ts">
	import { onMount } from "svelte";

	let name_user: string = "";
	let pseudo: string = "";
	let last_name_user: string = "";
	let password_user: string = "";
	let showDeletePopup: boolean = false;
	let showDisconnectPopup: boolean = false;
	let dateOfBirth: string = "";
	let error: string = "";
	globalThis.path.set('settings');

	onMount(() => {
		getUserInfo();
		return (() => {

		});
	});


	function getUserInfo()
	{
		fetch('/get_info')
		.then(res => res.json())
		.then(data => {
			name_user = data.first_name;
			last_name_user = data.last_name;
			pseudo = data.nickname;
			dateOfBirth = data.date_of_birth; // (format: '1990-07-01')
		});
	}

	function setUserInfo()
	{
		fetch('/change_info', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				first_name: name_user,
				last_name: last_name_user,
				nickname: pseudo,
				date_of_birth: dateOfBirth,
				password: password_user,
			})
		}).then(res => res.json())
		.then(data => {
			if (data.error) {
				error = data.error;
			} else {
				error = "";
				// show popup here to confirm
			}
		});
	}

	function disconnect()
	{
		fetch('/logout')
		.then(response => {
			if (response.ok) {
				window.location.href = '/';
			}
		});
	}

	function deleteAccount()
	{
		fetch('/delete_account')
		.then(response => {
			if (response.ok) {
				window.location.href = '/';
			}
		});
	}

	let eye_pass = false;
</script>

<main>
	{#if showDeletePopup}
		<div class="overlay" on:click={() => showDeletePopup = false}></div>
		<div class="delete-account">
			<h2>Supprimer le compte</h2>
			<p>Vous êtes sur le point de supprimer votre compte. Cette action est irréversible.</p>
			<button class="btn" style="background-color: #c64141;" on:click={() => {deleteAccount()}}>Supprimer</button>
			<button class="btn" style="background-color: #111;" on:click={() => showDeletePopup = false}>Annuler</button>
		</div>
	{/if}

	{#if showDisconnectPopup}
		<div class="overlay" on:click={() => showDisconnectPopup = false}></div>
		<div class="delete-account">
			<h2>Déconnecter</h2>
			<p>Vous êtes sur le point de vous déconnecter. Voulez-vous continuer ?</p>
			<button class="btn" style="background-color: #c7c7c7; color: #111;" on:click={() => {disconnect()}}>Déconnecter</button>
			<button class="btn" style="background-color: #111;" on:click={() => showDisconnectPopup = false}>Annuler</button>
		</div>
	{/if}

	<div class="setting">
		<h2>PARAMÈTRES</h2>
		<div class="input-place">
			<label for="name">Prénom</label>
			<input class="input-text" type="text" id="name" name="name" value={name_user} on:change={(e) => name_user = e.target.value}>
		</div>
		
		<div class="input-place">
			<label for="last_name">Nom</label>
			<input class="input-text" type="text" id="last_name" name="last_name" value={last_name_user} on:change={(e) => last_name_user = e.target.value}>
		</div>
	
		<div class="input-place">
			<label for="pseudo">Pseudo</label>
			<input class="input-text" type="text" id="pseudo" name="pseudo" value={pseudo} on:change={(e) => pseudo = e.target.value}>
		</div>
		
		<div class="input-place">
			<label for="date">Date de naissance</label>
			<input class="input-text" type="date" id="date" name="date" value={dateOfBirth} on:change={(e) => dateOfBirth = e.target.value}>
		</div>

		<div class="input-place">
			<label for="password">Mot de passe</label>
			<div class="pass">
				<input class="input-text" type="password" id="password" name="password" value={password_user} on:change={(e) => password_user = e.target.value}>
				<button class="eye" on:click={() => {document.getElementById('password').type = document.getElementById('password').type === 'password' ? 'text' : 'password'; eye_pass = !eye_pass}}>
					{#if eye_pass}
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 9a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3m0 8a5 5 0 0 1-5-5a5 5 0 0 1 5-5a5 5 0 0 1 5 5a5 5 0 0 1-5 5m0-12.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5"/></svg>
					{:else}
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M11.83 9L15 12.16V12a3 3 0 0 0-3-3zm-4.3.8l1.55 1.55c-.05.21-.08.42-.08.65a3 3 0 0 0 3 3c.22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53a5 5 0 0 1-5-5c0-.79.2-1.53.53-2.2M2 4.27l2.28 2.28l.45.45C3.08 8.3 1.78 10 1 12c1.73 4.39 6 7.5 11 7.5c1.55 0 3.03-.3 4.38-.84l.43.42L19.73 22L21 20.73L3.27 3M12 7a5 5 0 0 1 5 5c0 .64-.13 1.26-.36 1.82l2.93 2.93c1.5-1.25 2.7-2.89 3.43-4.75c-1.73-4.39-6-7.5-11-7.5c-1.4 0-2.74.25-4 .7l2.17 2.15C10.74 7.13 11.35 7 12 7"/></svg>
					{/if}
				</button>
			</div>
		</div>

		<div class="input-place">
			<label for="Localisation">Localisation</label>
			<div class="popis">
				<p>Lon</p>
				<input class="input-text" type="number" id="Localisation" name="Localisation">
				<p>Lat</p>
				<input class="input-text" type="number" id="Localisation" name="Localisation">
			</div>
		</div>

		{#if error}
			<p style="color: red; text-align: center; margin-top: 1rem">{error}</p>
		{/if}

		<div class="mode">
		</div>

		<div class="settings-button">
			<button class="btn" style="background-color: #15902f;" on:click={() => setUserInfo()}>Enregistrer</button>
			<button class="btn" style="background-color: #111;" on:click={() => showDisconnectPopup = true}>Déconnecter</button>
			<button class="btn" style="background-color: #c64141;" on:click={() => showDeletePopup = true}>Supprimer</button>
		</div>
	</div>
	
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		height: 100%;
	}

	.overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(5px);
		border: none;
		z-index: 2;
	}

	.setting {
		display: flex;
		flex-direction: column;
		width: 100%;
		padding: .5rem 2rem 2rem;
	}

	.setting h2 {
		font-size: 1.6rem;
		font-weight: 800;
	}

	.setting label {
		font-size: 1.2rem;
		font-weight: 600;
	}

	.input-place {
		display: flex;
		flex-direction: column;
		gap: 15px;
		margin-top: 20px;
		width: 100%;
	}

	.input-text {
		width: 100%;
	}

	.settings-button {
		display: flex;
		flex-direction: row;
		gap: 20px;
		justify-content: center;
		margin-top: 60px;
		bottom: 2rem;
	}

	.btn {
		color: white;
		padding: 10px 20px;
		border-radius: 2rem;
		cursor: pointer;
		border: none;
		font-weight: 600;
	}

	.pass {
		position: relative;
	}

	.eye {
		position: absolute;
		right: 21px;
		top: 12px;
		background-color: transparent;
		border: none;
		cursor: pointer;
	}

	.popis {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 20px;
	}

	.popis p {
		font-size: 1rem;
		font-weight: 600;
	}

	.delete-account {
		position: absolute;
		display: flex;
		flex-direction: column;
		background-color: white;
		top: 50%;
		transform: translateY(-50%);
		margin-top: 20px;
		width: 80%;
		padding: 20px;
		gap: 20px;
		border-radius: 2rem;
		z-index: 3;
	}

	.delete-account h2 {
		font-size: 1.5rem;
		display: flex;
		justify-content: center;
	}

	.delete-account p {
		font-size: 1rem;
	}
</style>