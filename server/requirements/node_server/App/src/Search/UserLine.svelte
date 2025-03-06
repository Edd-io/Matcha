<script lang="ts">
	import ProfilePopup from './ProfilePopup.svelte';

	export let userInfo: any;

	let distance = userInfo.distance;
	let showProfilePopup = false;

	if (distance == -1)
		distance = 'Calculating...';
	else if (distance == -2)
		distance = 'Inconnu';
	else
		distance = distance + ' km';
</script>

<main>
	<img src={userInfo.pfp} alt="Profile pfp" class="pfp">
	<div class="user-info">
		<p class='name'>{userInfo.first_name} {userInfo.last_name}</p>
		<p class='age'>{userInfo.age} ans</p>
		<p class='data'>Fame: {userInfo.fame}% | Distance: {distance}</p>
	</div>
	{#if userInfo.alreadyLiked}
		<button class='see-profile-btn' style="background-color: #2cb637;" disabled>Déjà liké</button>
	{:else if userInfo.alreadyDisliked}
		<button class='see-profile-btn' style="background-color: #c21111;" disabled>Déjà disliké</button>
	{:else}
		<button class='see-profile-btn' style="background-color: #a4a4a4;" on:click={() => showProfilePopup = true}>Voir le profil</button>
	{/if}
	{#if showProfilePopup}
		<ProfilePopup userId={userInfo.user_id} bind:showProfilePopup={showProfilePopup}/>
	{/if}
</main>

<style>
	main {
		display: flex;
		height: 7rem;
		width: 100%;
	}

	.pfp {
		width: 6rem;
		height: 6rem;
		border-radius: 50%;
		margin: 0.5rem 1rem;
		object-fit: cover;
	}

	.user-info {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.user-info .name {
		font-size: 1.5rem;
		font-weight: 600;
	}

	.user-info .age {
		font-size: 1rem;
	}

	.see-profile-btn {
		margin-left: auto;
		margin-right: 1rem;
		align-self: center;
		padding: 0.5rem 1rem;
		border-radius: 1rem;
		border: none;
		color: white;
		font-size: 1rem;
		cursor: pointer;
	}

	.data {
		font-size: 1rem;
	}

</style>