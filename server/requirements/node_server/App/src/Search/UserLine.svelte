<script lang="ts">
	export let userInfo: any;
	export let self_location: any;

	console.log(typeof userInfo.distance);
</script>

<main>
	<img src={userInfo.pfp} alt="Profile pfp" class="pfp">
	<div class="user-info">
		<p class='name'>{userInfo.first_name} {userInfo.last_name}</p>
		<p class='age'>{userInfo.age} ans</p>
		<p class='data'>Fame: {userInfo.fame}% | Distance: {userInfo.distance} {userInfo.distance == -1 ? '' : ' km'}</p>
	</div>
	<button class='see-profile-btn'>Voir le profil</button>
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
		background-color: #2cb637;
		border: none;
		color: white;
		font-size: 1rem;
		cursor: pointer;
	}

	.data {
		font-size: 1rem;
	}

</style>