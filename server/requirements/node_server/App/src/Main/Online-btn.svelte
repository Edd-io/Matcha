<script lang="ts">
	import { onMount } from "svelte";

	export let user_id: number = 0;
	export let lastConnection: string = '';

	let isOnline = false;

	onMount(() => {
		if (!user_id)
			return;
		getOtherStatus();
		let interval = setInterval(() => {
			getOtherStatus();
		}, 5000);

		return (() => {
			clearInterval(interval);
		});
	});

	function getOtherStatus()
	{
		fetch('/get_user_status', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({id: user_id})
		})
		.then(res => res.json())
		.then(data => {
			if (data.connected === true)
			{
				isOnline = true;
				lastConnection = 'En ligne';
			}
			else
			{
				isOnline = false;
				if (!data.lastConnection)
					lastConnection = 'Jamais connecté(e)';
				else
					lastConnection = 'Dernière connexion : ' + (new Date(data.lastConnection).toLocaleString('fr-FR'));
			}
		});
	}


</script>

<main>
	{#if isOnline}
		<div id='status_user' class="is-online"></div>
	{:else}
		<div id='status_user' class="is-offline"></div>
	{/if}
</main>

<style>

	.is-online {
		position: absolute;
		top: 0;
		right: 0;
		width: .8rem;
		height: .8rem;
		background-color: green;
		border-radius: 50%;
	}

	.is-offline {
		position: absolute;
		top: 0;
		right: 0;
		width: .8rem;
		height: .8rem;
		background-color: #c64141;
		border-radius: 50%;
	}
</style>