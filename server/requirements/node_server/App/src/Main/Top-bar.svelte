<script>
	import matchaLogo from '../assets/Matcha.svg'
	import settingsLogo from '../assets/settings2.svg'
	import { navigate } from 'svelte-routing'
	import { onMount } from 'svelte'

	let notification = false;
	let path = '/';


	function get_notifications()
	{
		fetch('get_notifications')
		.then(response => response.json())
		.then(data => {
			for (let i = 0; i < data.length; i++)
			{
				if (data[i].seen == 0)
				{
					notification = true;
					break;
				}
			}
		})
	}

	onMount(() => {
		function hasNewNotification()
		{
			notification = true;
		}

		globalThis.path.subscribe(value => {
			path = value;
		});
		get_notifications();
		document.addEventListener('newNotification', hasNewNotification);
		return (() => {
			document.removeEventListener('newNotification', hasNewNotification);
			globalThis.path.unsubscribe();
		});
	});

	function returnToHome()
	{
		globalThis.last_path = window.location.pathname;
		globalThis.path.set('/');
		globalThis.bottomBarCategory.set(0);
		navigate('/');
	}
</script>

<main>
	<div class='top-bar'>
		<button class="main-logo" on:click={returnToHome}>
			<img class="matcha-logo" src={matchaLogo} alt="Matcha logo"/>
			<h1>MATCHA</h1>
		</button>
		<div class="icon-right">
			{#if path === '/'}
				<button class="top-button" on:click={() => navigate('/map')} aria-label='Map'>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#111111" d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2m4.004 10.878c-.345-.525-.594-.903-1.542-.753c-1.79.284-1.989.597-2.074 1.113l-.024.156l-.025.166c-.097.683-.094.941.22 1.27c1.265 1.328 2.023 2.285 2.253 2.845c.112.273.4 1.1.202 1.918a8.2 8.2 0 0 0 3.151-2.237c.11-.374.19-.84.19-1.404v-.105c0-.922 0-1.343-.652-1.716a7 7 0 0 0-.645-.325c-.367-.167-.61-.276-.938-.756q-.06-.085-.116-.172M12 3.833c-2.317 0-4.41.966-5.896 2.516c.177.123.331.296.437.534c.204.457.204.928.204 1.345c0 .328 0 .64.105.865c.144.308.766.44 1.315.554c.197.042.399.084.583.135c.506.14.898.595 1.211.96c.13.151.323.374.42.43c.05-.036.211-.211.29-.498c.062-.22.044-.414-.045-.52c-.56-.66-.529-1.93-.356-2.399c.272-.739 1.122-.684 1.744-.644c.232.015.45.03.614.009c.622-.078.814-1.025.949-1.21c.292-.4 1.186-1.003 1.74-1.375A8.1 8.1 0 0 0 12 3.833"/></svg>
				</button>
			{/if}
			<button class="top-button" on:click={() => {navigate('/notification'); notification = false}}>
				{#if notification}
					<div class="notif"></div>
				{/if}
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M4 19v-2h2v-7q0-2.075 1.25-3.687T10.5 4.2v-.7q0-.625.438-1.062T12 2t1.063.438T13.5 3.5v.7q2 .5 3.25 2.113T18 10v7h2v2zm8 3q-.825 0-1.412-.587T10 20h4q0 .825-.587 1.413T12 22"/></svg>
			</button>
			{#if path === '/'}
				<button class="top-button" on:click={() => navigate('/filter')}>
					<img src={settingsLogo} alt="filterLogo"/>
				</button>
			{/if}
		</div>
	</div>
</main>

<style>

	.matcha-logo {
		height: 3.5rem;
		width: 3.5rem;
	}

	.main-logo {
		display: flex;
		align-items: center;
		gap: 10px;
		cursor: pointer;
		background: none;
		border: none;
	}

	.notif {
		position: absolute;
		height: 10px;
		width: 10px;
		background-color: #c64141;
		border-radius: 50%;
		top: 0;
		right: 0;
	}

	.top-bar {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 20px;
		color: #111111;
		gap: 15px;
	}

	.icon-right {
		display: flex;
		margin-left: auto;
		align-items: center;
		gap: 25px;
	}

	.icon-right svg {
		fill: #111111;
		height: 2.2rem;
		width: 2.2rem;
	}

	.icon-right img {
		height: 2.2rem;
		width: 2.2rem;
	}

	.top-button {
		background: none;
		border: none;
		cursor: pointer;
		position: relative;
	}

	h1 {
		font-size: 1.3rem;
		font-weight: 900;
	}
</style>