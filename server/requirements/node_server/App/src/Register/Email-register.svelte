<script lang="ts">
	import { onMount } from 'svelte';

	export let page: number;
	export let token: string;

	let err = false;
	let timeout = null;
	let sent = false;

	onMount(() => {
		function clicked()
		{
			if (sent)
				return ;
			const elem = document.querySelector('#inp') as HTMLInputElement;
			const value = elem?.value || '';
			if (value === '')
			{
				err = true;
				timeout = setTimeout(() => {
					err = false;
					timeout = null;
				}, 500);
			}
			else
			{
				if (!isValidMail(value))
				{
					err = true;
					timeout = setTimeout(() => {
						err = false;
						timeout = null;
					}, 500);
					return ;
				}
				sent = true;
				fetch('/register', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ email: value })
				})
				.then(res => res.json())
				.then(data => {
					if (data.error)
					{
						err = true;
						timeout = setTimeout(() => {
							err = false;
							timeout = null;
						}, 500);
					}
					else
					{
						token = data.token;
						page++;
					}
					sent = false;
				})
			}
			
		}
		window.addEventListener('btnClicked', clicked);

		return (() => {
			window.removeEventListener('btnClicked', clicked);
			if (timeout)
				clearTimeout(timeout);
		});
	});

	function isValidMail(mail: string): boolean
	{
		return (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail));
	}
</script>

<main>
	<p id="txt" class="text">Pour commencer, entrez votre email pour accéder a Matcha.</p>
	<input id="inp" class="input-text {err ? 'animation' : ''} " type="email" placeholder="johndoe@gmail.com"/>
	{#if sent}
		<div class="loading"></div>
	{/if}
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		padding: 20px;		
	}

	#txt {
		margin-top: 100px;
	}

	#inp {
		margin-top: 100px;
	}

	.animation {
		border: 2px solid red;
		animation: horizontal-shaking 0.5s;
	}

	.loading {
		margin-top: 100px;
		width: 50px;
		height: 50px;
		border: 5px solid #d9d9d9;
		border-top: 5px solid #111111;
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

	@keyframes horizontal-shaking {
		0% { transform: translateX(0) }
		25% { transform: translateX(5px) }
		50% { transform: translateX(-5px) }
		75% { transform: translateX(5px) }
		100% { transform: translateX(0) }
	}
</style>