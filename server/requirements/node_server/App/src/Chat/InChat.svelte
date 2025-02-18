<script lang='ts'>
	import { onMount } from 'svelte';
	import threeDotsIcon from '../assets/3-dots.svg';
	import sendIcon from '../assets/send.svg';
    import { cubicOut } from 'svelte/easing';
    import { get } from 'svelte/store';

	export let user;
	export let chatOpened;

	let listMessages = [
		{content: 'Salut ça va ?', sendBySelf: false},
		// {content: 'Oui et toi ?', sendBySelf: true},
		// {content: 'Je vais bien merci', sendBySelf: false},
		// {content: 'Tu fais quoi de beau ?Tu fais quoi de beau ?Tu fais quoi de beau ?Tu fais quoi de beau ?Tu fais quoi de beau ?Tu fais quoi de beau ?Tu fais quoi de beau ?Tu fais quoi de beau ?Tu fais quoi de beau ?', sendBySelf: false},
		// {content: 'Je suis en train de coder', sendBySelf: true},
		// {content: 'Ah cool', sendBySelf: false},
		// {content: 'Tu fais quoi de beau ?', sendBySelf: false},
		// {content: 'Je suis en train de coder', sendBySelf: true},
		// {content: 'Ah cool', sendBySelf: false},
		// {content: 'On se répète un peu là non ?', sendBySelf: true},
		// {content: 'Oui c’est vrai', sendBySelf: false},
		// {content: 'Salut ça va ?', sendBySelf: false},
		// {content: 'Oui et toi ?', sendBySelf: true},
		// {content: 'Je vais bien merci', sendBySelf: false},
		// {content: 'Tu fais quoi de beau ?', sendBySelf: false},
		// {content: 'Je suis en train de coder', sendBySelf: true},
		// {content: 'Ah cool', sendBySelf: false},
		// {content: 'Tu fais quoi de beau ?', sendBySelf: false},
		// {content: 'Je suis en train de coder', sendBySelf: true},
		// {content: 'Ah cool', sendBySelf: false},
		// {content: 'On se répète un peu là non ?', sendBySelf: true},
		// {content: 'Oui c’est vrai', sendBySelf: false},
	]

	onMount(() => {
		const listMessagesDiv = document.querySelector('.list-messages');
		setTimeout(() => {
			listMessagesDiv.scrollTop = listMessagesDiv.scrollHeight;
		}, 100);
	})

	function slideHorizontal(node) {
		const	delay = 0, duration = 500, easing = cubicOut;
		const	style = getComputedStyle(node);
		let		width = parseFloat(style.width);

		return {
			delay,
			duration,
			easing,
			css: (t) => `
				transform: translateX(${(1 - t) * width}px);
			`,
		};
	}

	function getChat()
	{
		fetch('/get_chat', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({id: user.id})
		})
		.then(res => res.json())
		.then(data => {
			listMessages = data;
		});
		return listMessages;
	}

	getChat();

	function sendMessage(event: any)
	{
		if (event.key === 'Enter')
		{
			const inputMessage = document.querySelector('.input-message');
			const message = (inputMessage as HTMLInputElement).value;
			if (message.trim() !== '')
			{
				globalThis.ws.send(JSON.stringify({
					type: 'message',
					content: message,
					to: user.id
				}));
				listMessages.push({content: message, sendBySelf: true});
				(inputMessage as HTMLInputElement).value = '';
				const listMessagesDiv = document.querySelector('.list-messages');
				setTimeout(() => {
					listMessagesDiv.scrollTop = listMessagesDiv.scrollHeight;
				}, 10);
			}
		}
	}
</script>

<main in:slideHorizontal out:slideHorizontal>
	<div class="chat-header">
		<button class="no-button-style" on:click={() => chatOpened = false} aria-label="Retour">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" class="arrow-icon">
				<path fill="none" stroke="currentColor" stroke-width="2" d="M5 12h14M12 5l7 7-7 7"/>
			</svg>
		</button>
		<div class='center'>
			<img src={user.pfp} alt="Pfp de {user.name}" />
			<p>{user.name}</p>
		</div>
		<img src={threeDotsIcon} alt="Options" />
	</div>
	<div class="list-messages">
		{#key listMessages}
			{#each listMessages as message}
				<div class="message {message.sendBySelf ? 'self' : 'other'}">
					<p>{message.content}</p>
				</div>
			{/each}
		{/key}
	</div>
	<div class=input-message-container>
		<input type="text" placeholder="Écris un message..." class="input-message" on:keypress={(e) => sendMessage(e)} />
		
		<button class="send-button no-button-style">
			<img src={sendIcon} alt="Send" />
		</button>
	</div>
</main>

<style>
	.no-button-style {
		background-color: transparent;
		border: none;
		cursor: pointer;
	}
	main {
		position: fixed;
		width: 100vw;
		height: 100vh;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		top: 0;
		left: 0;
		background-color: white;
		z-index: 9999;
	}
	.arrow-icon {
		transform: rotate(180deg);
		height: 2.5rem;
		width: 2.5rem;
	}
	.chat-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
	}
	.chat-header .center {
		display: flex;
		align-items: center;
	}
	.chat-header .center img {
		height: 2.5rem;
		width: 2.5rem;
		object-fit: cover;
		border-radius: 100%;
		margin-right: 0.5rem;
	}
	.chat-header .center p {
		font-size: 1.2rem;
	}
	.list-messages {
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		height: 100%;
		overflow-y: auto;
	}
	.list-messages p {
		padding-block: 0.5rem;
		padding-inline: 1rem;
		border-radius: 0.9rem;
		margin-block: 0.5rem;
		font-size: 0.9rem;
	}
	.list-messages .message {
		margin-block: 0.5rem;
		padding-inline: 0.2rem;
		max-width: 70%;
	}
	.list-messages .message.self {
		align-self: flex-end;
		background-color: #55BE55;
		border-radius: 2rem 2rem 0 2rem;
	}
	.list-messages .message.other {
		align-self: flex-start;
		background-color: #f7f7f7;
		border-radius: 2rem 2rem 2rem 0;
	}
	.input-message-container {
		width: 90%;
		margin-inline: 5%;
		border-radius: 3rem;
		border: 0.25rem solid #111;
		margin-block: 1rem;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 4rem;
	}
	.input-message {
		width: 100%;
		color: #111;
		font-size: 0.9rem;
		resize: none;
		border: none;
		border-radius: 3rem;
		padding-inline: 1rem;
		line-height: 1.5rem;
	}
	.input-message:focus {
		outline: none;
	}
	.send-button {
		border-radius: 100%;
		width: 2.5rem;
		height: 2.5rem;
		margin-inline: 0.5rem;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>