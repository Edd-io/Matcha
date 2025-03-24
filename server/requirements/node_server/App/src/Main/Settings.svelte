<script lang="ts">
	import { onMount } from "svelte";
    import { on } from "svelte/events";

	let name_user: string = "";
	let pseudo: string = "";
	let last_name_user: string = "";
	let password_user: string = "";
	let showDeletePopup: boolean = false;
	let showDisconnectPopup: boolean = false;
	let dateOfBirth: string = "";
	let mail: string = "";
	let last_email: string = "";
	let error: string = "";
	let location: any = {lon: 0, lat: 0};
	let eye_pass: boolean = false;
	let showPopup: boolean = false;
	let codePopup: string = "";
	let passwordPopup: string = "";
	let err_popup: string = "";
	let darkModeEnabled = localStorage.getItem('darkMode') === 'true';
	const today = new Date();
	const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())
		.toISOString()
		.split("T")[0];

	globalThis.path.set('settings');

	onMount(() => {
		getUserInfo();
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
			if (data.location) {
				location.lon = data.location.lon;
				location.lat = data.location.lat;
			}
			mail = data.email;
			last_email = data.email;
		});
	}

	function setUserInfo()
	{
		if (name_user.trim() === "" || last_name_user.trim() === "" || pseudo.trim() === "" || dateOfBirth.trim() === "" || mail.trim() === "")
		{
			error = "Veuillez remplir tous les champs.";
			return;
		}
		if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(mail))
		{
			error = "Adresse mail invalide.";
			return;
		}

		const birthDate = new Date(dateOfBirth);
		const today = new Date();
		const age = today.getFullYear() - birthDate.getFullYear();
		if (age < 18)
		{
			error = "Vous devez avoir au moins 18 ans pour vous inscrire.";
			return;
		}
		
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
				location: {
					lon: (document.getElementById('location-lon') as HTMLInputElement).value,
					lat: (document.getElementById('location-lat') as HTMLInputElement).value
				},
				mail: mail
			})
		}).then(res => res.json())
		.then(data => {
			if (data.error) {
				error = data.error;
			} else {
				if (last_email !== mail)
					showPopup = true;
				error = "";
				window.dispatchEvent(new CustomEvent('newNotif', {detail: {title: 'Succès', message: 'Vos informations ont bien été enregistrées !', image: null}}));
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

	function link42()
	{
		const parametres = "width=800,height=600,resizable=yes,scrollbars=yes,status=yes";
		let popupWindow = window.open(url_link_42, "Lier42", parametres);

		popupWindow.addEventListener("load", () => {
			try {
				const pageContent = popupWindow.document.body.textContent;
				const jsonData = JSON.parse(pageContent);
				
				if (jsonData.error) {
					popupWindow.close();
					setTimeout(() => {
						alert(jsonData.error);
					}, 100);
				} else {
					popupWindow.close();
					setTimeout(() => {
						alert("Compte 42 lié avec succès !");
					}, 100);
				}
			} catch (error) {
				console.error("Erreur lors de la récupération du JSON:", error);
			}
		});
	}

	function confirmChangeMail()
	{
		if (codePopup.length !== 4 || !/^\d+$/.test(codePopup))
		{
			err_popup = "Le code doit contenir exactement 4 chiffres.";
			return;
		}
		if (passwordPopup.trim() === "")
		{
			err_popup = "Veuillez entrer votre mot de passe.";
			return;
		}
		fetch('/confirm_change_mail', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				code: codePopup,
				password: passwordPopup
			})
		}).then(res => res.json())
		.then(data => {
			if (data.error)
				err_popup = data.error;
			else
			{
				err_popup = "";
				showPopup = false;
				last_email = mail;
			}
		});
	}

	function darkMode(enable)
	{
		if (enable)
		{
			document.documentElement.style.setProperty('--background-color', '#111111');
			document.documentElement.style.setProperty('--text-color', '#ffffff');
			document.documentElement.style.setProperty('--invert-svg', '1');
		}
		else
		{
			document.documentElement.style.setProperty('--background-color', '#ffffff');
			document.documentElement.style.setProperty('--text-color', '#000000');
			document.documentElement.style.setProperty('--invert-svg', '0');
		}
		localStorage.setItem('darkMode', enable);
	}

</script>

<main>
	{#if showDeletePopup}
		<div class="overlay" on:click={() => showDeletePopup = false}></div>
		<div class="delete-account">
			<h2>Supprimer le compte</h2>
			<p style="color : #111">Vous êtes sur le point de supprimer votre compte. Cette action est irréversible.</p>
			<button class="btn" style="background-color: #c64141;" on:click={() => {deleteAccount()}}>Supprimer</button>
			<button class="btn" style="background-color: #111;" on:click={() => showDeletePopup = false}>Annuler</button>
		</div>
	{/if}

	{#if showDisconnectPopup}
		<div class="overlay" on:click={() => showDisconnectPopup = false}></div>
		<div class="delete-account">
			<h2>Déconnecter</h2>
			<p style="color : #111">Vous êtes sur le point de vous déconnecter. Voulez-vous continuer ?</p>
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
			<input class="input-text" max={maxDate} type="date" id="date" name="date" value={dateOfBirth} on:change={(e) => dateOfBirth = e.target.value} style="display: inline-block;">
		</div>

		<div class="input-place">
			<label for="date">Email</label>
			<input class="input-text" type="mail" id="mail" name="mail" value={mail} on:change={(e) => mail = e.target.value}>
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
			{#if password_user.trim() !== ""}
				<p style="color: red; font-size: 1rem;">Attention, le mot de passe va être changé si vous enregistrez.</p>
			{/if}
		</div>

		<div class="input-place">
			<label for="Localisation">Localisation (Temporaire)</label>
			<div class="popis">
				<p>Lon</p>
				<input class="input-text" type="number" id="location-lon" name="Localisation" value={location.lon}>
				<p>Lat</p>
				<input class="input-text" type="number" id="location-lat" name="Localisation" value={location.lat}>
			</div>
		</div>

		<div class="input-place">
			<label for="Localisation">Connexion à 42</label>

			<button class="btn" style="background-color: #15902f;" on:click={link42}>Se connecter</button>
		</div>


		<div style="display: flex; justify-content: space-between; margin-top: 2rem;">
			<label for="dark-mode">Mode sombre</label>

			<label class="switch">
				<input type="checkbox" on:change={(e) => darkMode(e.target.checked)} bind:checked={darkModeEnabled}>
				<span class="slider round"></span>
			</label>
		</div>

		{#if error}
			<p style="color: red; text-align: center; margin-top: 1rem">{error}</p>
		{/if}

		<div class="mode">
		</div>

		<!-- <div class="not-saved">
			<p class="text">Vos modifications on bien été enrengistré !</p>
		</div> -->

		<div class="settings-button">
			<button class="btn" style="background-color: #15902f;" on:click={() => setUserInfo()}>Enregistrer</button>
			<button class="btn" style="background-color: #111;" on:click={() => showDisconnectPopup = true}>Déconnecter</button>
			<button class="btn" style="background-color: #c64141;" on:click={() => showDeletePopup = true}>Supprimer</button>
		</div>
	</div>
	{#if showPopup}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div class="popup-overlay">
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div class="popup" on:click|stopPropagation>
				<h2>Mail envoyé</h2>
				<p>Un mail a été envoyé à l'adresse mail '{mail}'</p>
				<p>Si vous quittez cette page, vous devrez recommencer la procédure</p>
				<p>Veuillez entrer le code que vous avez reçu par mail ainsi que votre mot de passe. Si vous venez de changer votre mot de passe, celui à entrer sera le nouveau.</p>
				<div class="popup-input">
					<input type="text" class="input-text" style='margin-bottom: 1rem;' placeholder="Code" bind:value={codePopup} />
					<input type="password" class="input-text" placeholder="Mot de passe" bind:value={passwordPopup} />
				</div>
				{#if err_popup}
					<p class='error'>{err_popup}</p>
				{/if}
				<button class="reset-button" on:click={confirmChangeMail}>Envoyer</button>
			</div>
		</div>
	{/if}
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		height: 100%;
	}

    /* @keyframes fadeInUp {
        0% {
            opacity: 0;
            transform: translate(-50%, 100%);
        }
        100% {
            opacity: 1;
            transform: translate(-50%, 0);
        }
    } */

    /* .not-saved {
        position: absolute;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 5%;
        width: 80%;
        transform: translate(-50%, 0);
        left: 50%;
        bottom: 5%;
        border-radius: 1rem;
        padding-inline: 1rem;
        background-color: #111111;
        animation: fadeInUp 0.7s;
    }

    .not-saved p{
        color: white;
        font-size: 0.7rem;
    } */

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
		color: #111;
	}

	.delete-account p {
		font-size: 1rem;
	}

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

	.popup * {
		text-align: center;
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
		border-radius: 0.5rem;
		width: 100%;
		cursor: pointer;
		font-weight: bold;
	}

	.reset-button:hover {
		background-color: #259c53;
	}
	
	.error {
		color: red;
		font-size: 1rem;
		font-weight: 600;
		margin-top: 10px;
		width: 100%;
		margin-bottom: 1rem;
		text-align: center;
	}

	.switch {
		position: relative;
		display: inline-block;
		width: 60px;
		height: 34px;
	}

	.switch input {
		opacity: 0;
		width: 0;
		height: 0;
	}

	.slider {
		position: absolute;
		cursor: pointer;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #ccc;
		-webkit-transition: .4s;
		transition: .4s;
	}

	.slider:before {
		position: absolute;
		content: "";
		height: 26px;
		width: 26px;
		left: 4px;
		bottom: 4px;
		background-color: white;
		-webkit-transition: .4s;
		transition: .4s;
	}

	input:checked + .slider {
		background-color: #30b844;
	}

	input:focus + .slider {
		box-shadow: 0 0 1px #30b844;
	}

	input:checked + .slider:before {
		-webkit-transform: translateX(26px);
		-ms-transform: translateX(26px);
		transform: translateX(26px);
	}

	.slider.round {
		border-radius: 34px;
	}

	.slider.round:before {
		border-radius: 50%;
	}

</style>