<script lang="ts">
	import positionLogo from "../assets/position.svg";
	import genderLogo from "../assets/gender.svg";
	import typeLogo from "../assets/type.svg";
	import ChooseInterests from "../Register/Choose_interests.svelte";

	export let users: any;
	export let showComponent = false;
	export let getSwipeUser: Function;

	let hideComponent = true;
	let showSignalPopup = false;
	let showBlockPopup = false;

	function toggleScrollInfo() {
		hideComponent = false;
		setTimeout(() => {
			showComponent = !showComponent;
		}, 500);
	}


	function reportUser()
	{
		fetch('/report_user', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({report_id: users.id}),
		}).then(res => res.json())
		.then(data => {
			if (data.success)
				alert("Utilisateur/Utilisatrice reporté(e) avec succès");
			else 
				alert("Erreur lors du report de l'utilisateur");
		})
	}

	function blockUser()
	{
		fetch('/block_user', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({block_id: users.id}),
		}).then(res => res.json())
		.then(data => {
			if (data.success)
			{
				showComponent = false;
				getSwipeUser();
				alert("Utilisateur/Utilisatrice bloqué(e) avec succès");
			}
			else 
				alert("Erreur lors du blocage de l'utilisateur");
		})
	}
</script>

<main>
	{#if showSignalPopup}
		<div class="overlay" on:click={() => showSignalPopup = false}></div>
		<div class="delete-account">
			<h2>Signaler</h2>
			<p>Vous êtes sur le point de signaler {users.name}, êtes-vous sûr de vouloir le faire ?</p>
			<button class="btn" style="background-color: #c7c7c7; color: #111;" on:click={() => {reportUser(); showSignalPopup = false}}>Signaler</button>
			<button class="btn" style="background-color: #111;" on:click={() => showSignalPopup = false}>Annuler</button>
		</div>
	{/if}

	{#if showBlockPopup}
		<div class="overlay" on:click={() => showBlockPopup = false}></div>
		<div class="delete-account">
			<h2>Bloquer</h2>
			<p>Vous êtes sur le point de bloquer {users.name}, cette action est irréversible. Êtes-vous sûr de vouloir le faire ?</p>
			<button class="btn" style="background-color: #C64141; color: white;" on:click={() => {blockUser(); showBlockPopup = false}}>Bloquer</button>
			<button class="btn" style="background-color: #111;" on:click={() => showBlockPopup = false}>Annuler</button>
		</div>
	{/if}
	<div class={hideComponent ? "info-profil show" : "info-profil hide"}>
		<button class="close-scroll" on:click={toggleScrollInfo} aria-label="Close">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" class="arrow-icon">
				<path fill="none" stroke="currentColor" stroke-width="2" d="M5 12h14M12 5l7 7-7 7"/>
			</svg>
		</button>
		<div class="user-info">
			<p id="main-info-scroll">{users.name} • {users.age}</p>
			<div class=low-info-scroll>
				<div class="min-info">
					<img src={positionLogo} alt="positionLogo"/>
					<p id="scd-info">{users.city}, {users.country}</p>
				</div>
				<div class="min-info">
					<img src={genderLogo} alt="genderLogo"/>
					<p id="scd-info">{users.sexe}</p>
				</div>
				<div class="min-info">
					<img src={typeLogo} alt="typeLogo"/>
					<p id="scd-info">{users.orientation}</p>
				</div>
			</div>
		</div>
		<div class="bar-scroll"></div>
		<div class="bio">
			<div class="cat-bio">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path fill="#111111" d="M216 32v160a8 8 0 0 1-8 8H72a16 16 0 0 0-16 16h136a8 8 0 0 1 0 16H48a8 8 0 0 1-8-8V56a32 32 0 0 1 32-32h136a8 8 0 0 1 8 8"/></svg>
				<p>Bio</p>
			</div>
			<p>{users.bio}</p>
		</div>
		<div class="bar-scroll"></div>
		<div class="passion">
			<div class="cat-passion">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#111111" d="M20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83l3.75 3.75M3 17.25V21h3.75L17.81 9.93l-3.75-3.75z"/></svg>
				<p>Passions</p>
			</div>
			<ChooseInterests selected_interests={users.tags} disabled={true}/>
		</div>
		<div class="div-btn">
			<button class="scroll-btn">Lorem</button>
			<button class="scroll-btn" on:click={() => showSignalPopup = true}>Signaler</button>
			<button class="scroll-btn" id="block-btn" on:click={() => showBlockPopup = true}>Bloquer</button>
		</div>
	</div>
</main>

<style>

@keyframes slideIn {
	from {
		bottom: -700px;
	}
	to {
		bottom: 0;
	}
}

@keyframes slideOut {
	from {
		bottom: 0;
	}
	to {
		bottom: -700px;
	}
}

main {
	z-index: 999;
}

p {
	color: #111111;
	font-size: 1.3rem;
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
	z-index: 10;
}

.btn {
	color: white;
	padding: 10px 20px;
	border-radius: 2rem;
	cursor: pointer;
	border: none;
	font-weight: 600;
}

.delete-account {
	position: absolute;
	display: flex;
	flex-direction: column;
	background-color: white;
	top: 30%;
	transform: translateX(8%);
	margin-top: 20px;
	width: 80%;
	padding: 20px;
	gap: 20px;
	border-radius: 2rem;
	z-index: 11;
}

.delete-account h2 {
	font-size: 1.5rem;
	display: flex;
	justify-content: center;
}

.delete-account p {
	font-size: 1rem;
}

.info-profil.show {
	animation: slideIn 0.5s ease forwards;
}

.info-profil.hide {
	animation: slideOut 0.5s ease forwards;
}

.close-scroll{
	position: relative;
	left: 85%;
	top: 3.9rem;
	display: flex;
	justify-content: center;
	align-items: center;
	height: 2rem;
	width: 2rem;
	transform: rotate(90deg);
	border: none;
	border-radius: 1.2rem;
	cursor: pointer;
	background-color: #d9d9d9;
}

.close-scroll svg{
	width: 20px;
	height: 20px;
}

.info-profil{
	width: 94%;
	border-radius: 2rem;
	background-color: white;
	position: fixed;
	transform: translate(-50%);
	left: 50%;
	z-index: 2;
	transition: bottom 0.5s;
	padding-bottom: 20px;
}

.info-profil p {
	color: #111111;
}

#main-info-scroll{
	color: #111111;
	font-weight: 700;
	font-size: 2.5rem;
	margin: 20px;
}

.low-info-scroll{
	display: flex;
	flex-direction: column;
	gap: 10px;
	margin: 20px;
	color: #111111;
}

.low-info-scroll p{
	color: #111111;
}

.min-info{
	display: flex;
	flex-direction: row;
	gap: 25px;
	color: #111111;
}

.bar-scroll {
	margin: 5%;
	margin-top: 100px;
	border: 0;
	border-radius: 1px;
	height: 3px;
	align-items: center;
	justify-content: center;
	background: #d9d9d9;
	margin-top: 0;
	margin-bottom: 0;
}

.bio{
	display: flex;
	flex-direction: column;
	gap: 20px;
	padding: 20px;
}

.cat-bio{
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 10px;
}

.bio svg{
	width: 25px;
	height: 25px;
}

.passion{
	display: flex;
	flex-direction: column;
	gap: 10px;
	padding: 20px;
}

.cat-passion{
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 10px;
}

.passion svg{
	width: 25px;
	height: 25px;
}

.div-btn{
	display: flex;
	flex-direction: row;
	gap: 10px;
	justify-content: center;
	margin-inline: 20px;
}

#block-btn{
	background-color: #C64141;
}

.scroll-btn{
	display: flex;
	justify-content: center;
	align-items: center;
	text-decoration: none;
	width: 45%;
	height: 35px;
	border-radius: 1.5rem;
	border: none;
	font-weight: 700;
	background-color: #111111;
	color: white;
}
</style>