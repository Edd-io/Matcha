<script lang='ts'>
	import { writable } from 'svelte/store';
	import { onMount } from 'svelte';
	import threeDotsIcon from '../assets/3-dots.svg';
	import sendIcon from '../assets/send.svg';
    import { cubicOut } from 'svelte/easing';
    import OnlineBtn from '../Main/Online-btn.svelte';

	export let user: any;
	export let chatOpened: boolean;

	let listMessages = [];
	const writableListMessages = writable(listMessages);

	writableListMessages.subscribe(value => {
		listMessages = value;
		const listMessagesDiv = document.querySelector('.list-messages');
		if (listMessagesDiv)
		{
			setTimeout(() => {
				listMessagesDiv.scrollTo({
					top: listMessagesDiv.scrollHeight,
					behavior: 'smooth'
				});
			}, 50);
		}
	});

	onMount(() => {
		function newMessage(event: any)
		{
			if (event.detail.from !== user.id)
				return;
			const message = event.detail.content;
			writableListMessages.update(value => {
				value.push({content: message, sendBySelf: false});
				return (value);
			});
			globalThis.ws.send(JSON.stringify({
				type: 'message_seen',
				to: user.id
			}));
		}

		document.addEventListener('newMessage', newMessage);
		const listMessagesDiv = document.querySelector('.list-messages');
		setTimeout(() => {
			listMessagesDiv.scrollTop = listMessagesDiv.scrollHeight;
		}, 100);

		return () => document.removeEventListener('newMessage', newMessage);
	})

	function slideHorizontal(node) {
		const	delay = 0, duration = 500, easing = cubicOut;
		const	style = getComputedStyle(node);
		let		width = parseFloat(style.width);

		return {
			delay,
			duration,
			easing,
			css: (t: number) => `
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
			globalThis.ws.send(JSON.stringify({
				type: 'message_seen',
				to: user.id
			}));
			writableListMessages.set(data);
		});
	}

	getChat();

	function sendMessage(event: any)
	{
		const inputMessage = document.querySelector('#inputMessage');
		const message = (inputMessage as HTMLInputElement).value;
	
		if (event.key === 'Enter')
		{
			if (message.trim() !== '')
			{
				if (message.length > 1000)
				{
					alert('Message trop long. Veille à ce qu\'il fasse moins de 1000 caractères.');
					return;
				}
				globalThis.ws.send(JSON.stringify({
					type: 'message',
					content: message,
					to: user.id
				}));
				writableListMessages.update(value => {
					value.push({content: message, sendBySelf: true});
					return (value);
				});
				(inputMessage as HTMLInputElement).value = '';
			}
		}
		else if (message.length >= 1000)
		{
			event.preventDefault();
			(inputMessage as HTMLInputElement).value = message.slice(0, 1000);
		}
	}

	let options = false;
</script>

<main in:slideHorizontal out:slideHorizontal>
	<div class="chat-header">
		<button class="no-button-style" on:click={() => chatOpened = false} aria-label="Retour">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" class="arrow-icon">
				<path fill="none" stroke="currentColor" stroke-width="2" d="M5 12h14M12 5l7 7-7 7"/>
			</svg>
		</button>
		<div class='center'>
			<div style="position: relative;">
				<img src={user.pfp} alt="Pfp de {user.name}"/>
				<div style="position: absolute; top: 0; right: 5px;">
					<OnlineBtn />
				</div>
			</div>
			<p>{user.name}</p>
		</div>
		<button id="testtt" class="no-button-style" on:click={() => options = !options} aria-label="Options">	
			<img src={threeDotsIcon} alt="Options" />
		</button>
		{#if options}
			<div class="options">
				<button class="no-button-style" on:click={() => {}}>
					Signaler
				</button>
				<button class="no-button-style" on:click={() => {}}>
					Bloquer
				</button>
			</div>
		{/if}
	</div>
	<div class="list-messages">
		{#each listMessages as message}
			<div class="message {message.sendBySelf ? 'self' : 'other'}">
				<p>{message.content}</p>
			</div>
		{/each}
	</div>
	<div class=input-message-container>
		<input type="text" placeholder="Écris un message..." class="input-message" id='inputMessage' on:keypress={(e) => sendMessage(e)}/>
		
		<button class="send-button no-button-style" on:click={(e) => sendMessage({key: 'Enter'})}>
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
	#testtt{
		position: relative;
	}
	.options {
		position: absolute;
		top: 4rem;
		right: 10px;
		display: flex;
		flex-direction: column;
		background-color: white;
		padding: 10px;
		gap: 10px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
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
	.list-messages .message p {
		word-break: break-word;
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