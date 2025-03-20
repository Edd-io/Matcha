<script lang="ts">
    import { onMount } from "svelte";
	import positionLogo from "../assets/position.svg";
	import ScrollProfile from "../Main/Scroll-profile.svelte";
	import Cross from "../assets/cross.svg";

	export let userId: number;
	export let showProfilePopup: boolean;

	let user = null;
	let iPhoto = 0;
	const voyelle = ['a', 'e', 'i', 'o', 'u', 'y'];
	let showComponent = false;
	let loading = true;

	onMount(() => {
		getUserData();
	});

	function getUserData()
	{
		fetch('/get_user_profile', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({id: userId})
		})
		.then(res => res.json())
		.then(data => {
			if (data.error)
			{
				alert("Profil non disponible");
				showProfilePopup = false;
				return;
			}
			user = data;
			loading = false;
		})
	}

	function skipPhoto(event)
	{
		const rect = event.currentTarget.getBoundingClientRect();
		const clickX = event.clientX - rect.left;

		if (clickX < rect.width / 2 && iPhoto > 0)
			iPhoto--;
		else if (clickX >= rect.width / 2 && iPhoto < user.nbPhotos - 1)
			iPhoto++;
	}

	function toggleScrollInfo() 
	{
		showComponent = !showComponent;
	}
</script>

<main>
	{#if loading}
		<div class="loading"></div>
	{:else}
		{#if showComponent}
			<ScrollProfile bind:users={user} bind:showComponent={showComponent} />
		{/if}
		<div class="profile-popup">
			<div style="display: flex; justify-content: space-between;">
				{#if voyelle.includes(user.name[0].toLowerCase())}
					<p>Profil d'{user.name}</p>
				{:else}
					<p>Profil de {user.name}</p>
				{/if}
				<button class="close-profile-popup-btn" on:click={() => showProfilePopup = false}>
					<img src="{Cross}" alt="Close filter"/>
				</button>
			</div>
			<div class='photos-container'>
				<div class="photo">
					<div class='zone-pass'>
						<div class="centered">
							<img src={user?.images ? user?.images[iPhoto] : null} alt="" style="height: 100%; width: 100%; object-fit: cover; border-radius: 2rem;"/>
						</div>
					</div>
					<div class="centered" on:click={skipPhoto} on:keydown={skipPhoto} role="button" tabindex="0">
						<div class="nb-photo">
							{#each Array(user?.nbPhotos) as _, index}
								<div class={iPhoto === index ? "bar-photo-default" : "bar-photo-selected"}></div>
							{/each}
						</div>
					</div>
					<div class="user-info">
						<div class="info">
							<p id="main-info">{user?.name} • {user?.age}</p>
							<button class="open-scroll" on:click={toggleScrollInfo} aria-label='Ouvrir le scroll'>
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" class="arrow-icon">
									<path fill="none" stroke="currentColor" stroke-width="2" d="M5 12h14M12 5l7 7-7 7"/>
								</svg>
							</button>
						</div>
						<div class=low-info>
							<img src={positionLogo} alt="positionLogo"/>
							<p id="scd-info">{user?.city}, {user?.country}</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	{/if}
</main>

<style>
	main {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 200;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.profile-popup {
		width: 80%;
		max-width: 40rem;
		height: 80%;
		background-color: white;
		border-radius: 1rem;
		padding: 2rem;
	}

	.close-profile-popup-btn {
		color: rgb(0, 0, 0);
		border: none;
		border-radius: 50%;
		width: 2rem;
		height: 2rem;
		cursor: pointer;
		font-size: 1.5rem;
	}

	.close-profile-popup-btn img {
		width: 1rem;
		filter: invert(1);
	}

	.zone-pass {
		width: 100%;
		height: 100%;
		position: absolute;
		z-index: 1;
		border-radius: 2rem;
	}

	.photos-container {
		padding-top: 1rem;
		padding-bottom: 2rem;
		height: 100%;
		width: 100%;
	}

	.photo {
		height: 100%;
		width: 100%;
		border-radius: 2rem;
		background-color: rgb(199, 199, 199);
		display: flex;
		flex-direction: column;
		justify-content: end;
		position: relative;
		margin: auto;
		transition: all 0.3s;
	}

	.centered {
		height: 100%;
		width: 100%;
		display: flex;
		justify-content: center;
	}

	.nb-photo{
		display: flex;
		justify-content: center;
		margin-top: 20px;
		flex-direction: row;
		height: 100%;
		width: 90%;
		gap: 10px;
		z-index: 5;
	}

	.bar-photo-default{
		height: 1%;
		width: 80%;
		background-color: #111111;
		border-radius: 1rem;
	}

	.bar-photo-selected{
		height: 1%;
		width: 80%;
		background-color: #111111;
		opacity: 0.5;
		border-radius: 1rem;
	}

	.user-info{
		margin-left: 20px;
		z-index: 5;
	}

	#main-info{
		color: white;
		font-weight: 700;
		font-size: 2.5rem;
	}

	.info {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-right: 27px;
	}

	.open-scroll {
		left: 85%;
		top: 9.5%;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 2rem;
		width: 2rem;
		transform: rotate(-90deg);
		border: none;
		border-radius: 1.2rem;
		cursor: pointer;
		background: none;
		background-color: #d9d9d9;
	}

	#scd-info{
		font-size: 1rem;
		z-index: 5;
	}

	.low-info {
		display: flex;
		flex-direction: row;
		gap: 10px;
		filter: invert(1);
		z-index: 5;
		margin-bottom: 2rem;
	}

	.loading {
		margin: auto;
		width: 50px;
		height: 50px;
		border: 5px solid #87db9f;
		border-top: 5px solid #006e25;
		border-radius: 50%;
		animation: spin 1s ease-in-out infinite;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
</style>