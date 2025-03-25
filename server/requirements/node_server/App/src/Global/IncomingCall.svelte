<script lang='ts'>
	import { onMount } from 'svelte';

	export let user: any;
	export let user2: any;
	export let incomming: boolean = false;
	export let calling: boolean = false;

	let inProgress: boolean = false;
	let callTime: number = 0;
	let intervalCallTime: any = null;
	let mediaRecorder: any = null;
	let inCallHandler: any;

	onMount(() => {
		inCallHandler = () => {
			incomming = false;
			calling = false;
			inProgress = true;
			intervalCallTime = setInterval(() => {
				callTime++;
			}, 1000);
			startRecording();
		}

		window.addEventListener('inCall', inCallHandler);
		return (() => {
			window.removeEventListener('inCall', inCallHandler);
			endCall();
			if (intervalCallTime)
				clearInterval(intervalCallTime);
		});
	});

	function rejectCall()
	{
		const ws = globalThis.ws;

		ws.send(JSON.stringify({
			type: 'call',
			content: {
				action: 'reject',
				id: user.id,
			}
		}));
	}

	function acceptCall()
	{
		const ws = globalThis.ws;

		ws.send(JSON.stringify({
			type: 'call',
			content: {
				action: 'accept',
				id: user.id,
			}
		}));
		incomming = false;
	}

	async function startRecording()
	{
		const ws = globalThis.ws;
		const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
		
		const options = {
			mimeType: 'audio/webm;codecs=opus',
			audioBitsPerSecond: 128000
		};
		if (!MediaRecorder.isTypeSupported(options.mimeType))
			options.mimeType = '';
		
		mediaRecorder = new MediaRecorder(stream, options);
		
		mediaRecorder.ondataavailable = async (e) => {
			if (e.data.size > 0) {
				try {
					const arrayBuffer = await e.data.arrayBuffer();
					ws.send(arrayBuffer);
				} catch (error) {
					console.error("Erreur d'envoi audio:", error);
				}
			}
		};
		mediaRecorder.start(50);
		mediaRecorder.onerror = (event) => {
			console.error("Erreur d'enregistrement:", event);
		};
		mediaRecorder.onstop = () => {
			console.log("Recording stopped");
		};
	}


	function stopRecording()
	{
		if (mediaRecorder) {
			mediaRecorder.stop();
			mediaRecorder.stream.getTracks().forEach(track => {
				track.stop();
				track.enabled = false;
			});
			mediaRecorder = null;
		}
	}

	function endCall()
	{
		stopRecording();
		inProgress = false;
		callTime = 0;
	}
</script>

<main>
	<div id='popup'>
		<div class="pfp-call">
			<!-- <div style="display: flex; flex-direction: column; align-items: center;">
				<img src={user1.name} alt="Avatar" class="avatar">
				<p>{user1.name}</p>
			</div> -->
			<div style="display: flex; flex-direction: column; align-items: center;">
				<img src={user.pfp} alt="Avatar" class="avatar">
				<p>{user.name}</p>
			</div>
		</div>
		<div class="info">
			{#if incomming}
				<p>Appel entrant</p>
			{:else if calling}
				<p>Appel en cours</p>
			{:else if inProgress}
				<p>{Math.floor(callTime / 3600).toString().padStart(2, '0')}:{Math.floor((callTime % 3600) / 60).toString().padStart(2, '0')}:{(callTime % 60).toString().padStart(2, '0')}</p>
			{/if}
		</div>
		<div style="display: flex; justify-content: center; align-items: center; margin-top: 3rem; gap: 2rem;">
			<button class="ico-btn no-style-btn" style="background-color: #C64141;" on:click={rejectCall} aria-label="Rejeter l'appel">
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none"><path fill="currentColor" d="M23 12.5L20.5 15l-3-2V8.842C15.976 8.337 14.146 8 12 8s-3.976.337-5.5.842V13l-3 2L1 12.5c.665-.997 2.479-2.657 5.5-3.658C8.024 8.337 9.855 8 12 8s3.976.337 5.5.842c3.021 1 4.835 2.66 5.5 3.658"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.5 8.842C15.976 8.337 14.146 8 12 8s-3.976.337-5.5.842m11 0c3.021 1 4.835 2.66 5.5 3.658L20.5 15l-3-2zm-11 0c-3.021 1-4.835 2.66-5.5 3.658L3.5 15l3-2z"/></g></svg>
			</button>
			{#if incomming && !calling}
				<button class="ico-btn no-style-btn" style="background-color: #15902F;" on:click={acceptCall} aria-label="Accepter l'appel">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m21 15.46l-5.27-.61l-2.52 2.52a15.05 15.05 0 0 1-6.59-6.59l2.53-2.53L8.54 3H3.03C2.45 13.18 10.82 21.55 21 20.97z"/></svg>
				</button>
			{/if}
		</div>
	</div>

</main>

<style>
	main {
		position: absolute;
		width: 100vw;
		height: 100vh;
		display: flex;
		flex-direction: column;
		background-color: rgba(0, 0, 0, 0.507);
		z-index: 6000;
		left: 0;
		top: 0;
	}

	#popup {
		position: absolute;
		width: 90vw;
		background-color: var(--background-color);
		z-index: 1001;
		left: 50%;
		transform: translateX(-50%);
		top: 25vh;
		border-radius: 2rem;
		max-width: 50rem;
		max-height: 50rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 2rem;
	}

	.pfp-call {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: row;
	}

	.avatar {
		width: 8rem;
		height: 8rem;
		border-radius: 50%;
		margin: 0 1rem 1rem 1rem;
		object-fit: cover;
	}

	.info {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		margin-top: 2rem;
	}

	.ico-btn {
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 50%;
		width: 3rem;
		height: 3rem;
		cursor: pointer;
		color: white;
	}

	.no-style-btn {
		background-color: transparent;
		border: none;
	}
</style>