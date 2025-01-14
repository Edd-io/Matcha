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
		})
	});

	function isValidMail(mail: string): boolean
	{
		return (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail));
	}
</script>

<main>
	<p id="txt" class="text">Pour commencer, entrez votre email pour accéder a Matcha.</p>
	<input id="inp" class="input-text {err ? 'animation' : ''} " type="email" placeholder="johndoe@gmail.com"/>
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		padding: 20px;
		color: #111111;
		
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

	@keyframes horizontal-shaking {
		0% { transform: translateX(0) }
		25% { transform: translateX(5px) }
		50% { transform: translateX(-5px) }
		75% { transform: translateX(5px) }
		100% { transform: translateX(0) }
	}
</style>