<script lang='ts'>
	import { onMount } from 'svelte';

	import InChat from './InChat.svelte'

	let userList = [];

	let	chatOpened = false;
	let selectedUser = null;

	function getChatList(chatOpened: boolean)
	{
		if (chatOpened)
			return ;
		console.log('fetching chat list');
		fetch('/get_chat_list')
		.then(res => res.json())
		.then(data => {
			userList = data;
		});
	}

	$: getChatList(chatOpened);

	onMount(() => {
		function newMessage(event: any)
		{
			for (let i = 0; i < userList.length; i++)
			{
				if (userList[i].id === event.detail.from)
				{
					userList[i].lastMessage = event.detail.content;
					userList[i].seen = false;
					userList[i].sendBySelf = false;
					userList[i].sendBySystem = false;
					
					break;
				}
			}
		}

		document.addEventListener('newMessage', newMessage);
		return () => document.removeEventListener('newMessage', newMessage);
	});

	globalThis.path.set('/chat');
	let counter = 0;
</script>

<main>
	<input type="text" placeholder="Rechercher..." class="search-input" >
	<div class="list-user">
		{#key counter}
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
						<h3 style="color: var(--text-color);">{user.name}</h3>
						<p style="{!user.seen ? 'font-weight: 700; color: #111' : ''}">
							{user.sendBySystem ? "" : user.sendBySelf ? "Toi : " : user.name + " : "} {user.lastMessage.length > 30 ? user.lastMessage.slice(0, 30) + '...' : user.lastMessage}
						</p>
					</div>
				</button>
			{/each}
		{/key}
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
	.search-input {
		height: 50px;
		border-radius: 1.1rem;
		border: 3px solid black;
		padding: 0 1rem;
		font-size: 1rem;
		margin-inline: 1%;
		padding-inline: 1rem;
		margin-bottom: 1rem;
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
</style>