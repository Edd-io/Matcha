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

	async function removeReaction()
	{
		if (userInfo.matched)
			return;
		const response = await fetch('/remove_reaction', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				userId: userInfo.user_id
			})
		});
		const data = await response.json();
		if (data.success)
		{
			userInfo.alreadyLiked = false;
			userInfo.alreadyDisliked = false;
		}
	}
</script>

<main>
	<img src={userInfo.pfp} alt="Profile pfp" class="pfp">
	<div class="user-info">
		<p class='name'>{userInfo.first_name} {userInfo.last_name}</p>
		<p class='age'>{userInfo.age} ans</p>
		<p class='data'>Fame: {userInfo.fame}%</p>
		<p class='data'>Distance: {distance}</p>
	</div>
	{#if userInfo.alreadyLiked}
		<button class='see-profile-btn' style="background-color: #2cb637;" on:click={removeReaction}>Déjà liké</button>
	{:else if userInfo.alreadyDisliked}
		<button class='see-profile-btn' style="background-color: #c21111;" on:click={removeReaction}>Déjà disliké</button>
	{:else if userInfo.matched}
		<button class='see-profile-btn' style="background-color: #f7b500;" disabled>Match !</button>
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
		font-size: 0.8rem;
		color: rgb(37, 37, 37);
	}

</style>