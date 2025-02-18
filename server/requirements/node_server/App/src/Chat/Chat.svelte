<script lang='ts'>
	import InChat from './InChat.svelte'

	let userList = [
		{name: 'Jean', pfp: "https://images.pexels.com/photos/837358/pexels-photo-837358.jpeg?cs=srgb&dl=pexels-olly-837358.jpg&fm=jpg", lastMessage: 'Salut ça va ?', seen: false, sendBySelf: false, id: 1},
		// {name: 'Marie', pfp: "https://images.pexels.com/photos/445109/pexels-photo-445109.jpeg?cs=srgb&dl=pexels-trinitykubassek-445109.jpg&fm=jpg", lastMessage: 'Dispo ce soir pour parler ?', seen: true, sendBySelf: true, id: 2},
		// {name: 'Pierre', pfp: "https://images.pexels.com/photos/699604/pexels-photo-699604.jpeg?cs=srgb&dl=pexels-johnmark-smith-699604.jpg&fm=jpg", lastMessage: 'T’es toujours partant pour demain ?', seen: false, sendBySelf: false, id: 3},
		// {name: 'Lucie', pfp: "https://images.pexels.com/photos/3723701/pexels-photo-3723701.jpeg?cs=srgb&dl=pexels-rodnae-productions-3723701.jpg&fm=jpg", lastMessage: 'On se retrouve à 18h ?', seen: true, sendBySelf: true, id: 4},
		// {name: 'Marc', pfp: "https://images.pexels.com/photos/457878/pexels-photo-457878.jpeg?cs=srgb&dl=pexels-brett-sayles-457878.jpg&fm=jpg", lastMessage: 'Tu as vu le match hier ?', seen: true, sendBySelf: false, id: 5},
		// {name: 'Sophie', pfp: "https://images.pexels.com/photos/3288817/pexels-photo-3288817.jpeg?cs=srgb&dl=pexels-pixabay-3288817.jpg&fm=jpg", lastMessage: 'Tu veux faire du shopping ce weekend ?', seen: false, sendBySelf: true, id: 6},
		// {name: 'Alexandre', pfp: "https://images.pexels.com/photos/4386439/pexels-photo-4386439.jpeg?cs=srgb&dl=pexels-pixabay-4386439.jpg&fm=jpg", lastMessage: 'On se capte vendredi pour boire un verre ?', seen: true, sendBySelf: false, id: 7},
		// {name: 'Claire', pfp: "https://images.pexels.com/photos/5490791/pexels-photo-5490791.jpeg?cs=srgb&dl=pexels-cottonbro-studio-5490791.jpg&fm=jpg", lastMessage: 'Je te retrouve à 14h ?', seen: true, sendBySelf: true, id: 8},
		// {name: 'Tom', pfp: "https://images.pexels.com/photos/1191623/pexels-photo-1191623.jpeg?cs=srgb&dl=pexels-pixabay-1191623.jpg&fm=jpg", lastMessage: 'T’as fait quoi ce weekend ?', seen: false, sendBySelf: false, id: 9},
	];

	let	chatOpened = false;
	let selectedUser = null;

	function getChatList()
	{
		fetch('/get_chat_list')
		.then(res => res.json())
		.then(data => {
			userList = data;
		});
		return userList;
	}

	getChatList();

	globalThis.path.set('/chat');
</script>

<main>
	<input id="search-input" placeholder="Rechercher..." />
	<div class="list-user">
		{#each userList as user}
			<button class="user no-button-style" on:click={() => {
				selectedUser = user;
				chatOpened = true;
			}}>
			<div class="pfp-container">
				{#if !user.seen}
					<div class="notif"></div>
				{/if}
				<img src={user.pfp} alt="Pfp de {user.name}" />
			</div>
				<div style="padding-inline: 1rem;">
					<h3>{user.name}</h3>
					<p style="{!user.seen ? 'font-weight: 700; color: #111' : ''}">
						{user.sendBySystem ? "" : user.sendBySelf ? "Toi : " : user.name + " : "} {user.lastMessage.length > 30 ? user.lastMessage.slice(0, 30) + '...' : user.lastMessage}
					</p>
				</div>
			</button>
		{/each}
	</div>
	{#if chatOpened}
		<InChat user={selectedUser} bind:chatOpened={chatOpened}/>
	{/if}
	</main>

<style>
	.notif {
		position: absolute;
		background-color: #C64141;
		border: solid 0.2rem #fff;
		width: 1.2rem;
		height: 1.2rem;
		border-radius: 100%;
		right: 0.1rem;
		top: 0.1rem;
	}

	.pfp-container {
		position: relative;
	}

	main {
		display: flex;
		flex-direction: column;
		flex: 1;
	}
	.no-button-style {
		background-color: transparent;
		border: none;
		text-align: left;
	}
	#search-input {
		width: 90%;
		height: 2rem;
		margin-inline: 5%;
		border-radius: 3rem;
		border: 0.25rem solid #111;
		padding-inline: 1rem;
		margin-block: 1rem;
	}
	#search-input:focus {
		outline: none;
	}
	.list-user {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		height: 100%;
		overflow-y: auto;
		padding-bottom: 1rem;
	}
	.user {
		width: 100%;
		padding-inline: 1rem;
		padding-block: 0.4rem;
		display: flex;
		align-items: center;
		cursor: pointer;
	}
	.user img {
		height: 5rem;
		width: 5rem;
		object-fit: cover;
		border-radius: 100%;
	}
	.user h3 {
		font-size: 1.3rem;
		margin: 0;
		font-weight: 800;
	}
	.user p {
		font-size: 1rem;
		margin: 0;
		color: #666;
	}
	@media (min-aspect-ratio: 1/1) {
		main {
			height: 100vh;
		}
	}
</style>