<script lang='ts'>
	import { onMount } from "svelte";
	let sent: boolean = false;

	export let page: number;
	export let token: string;

	async function sendData()
	{
		if (sent)
			return;
		sent = true;
		const fname = (document.getElementById('inp-fname') as HTMLInputElement).value;
		const name = (document.getElementById('inp-name') as HTMLInputElement).value;
		const pseudo = (document.getElementById('inp-pseudo') as HTMLInputElement).value;
		const password = (document.getElementById('inp-password') as HTMLInputElement).value;
		const passwordConfirm = (document.getElementById('inp-password-confirm') as HTMLInputElement).value;

		if (password !== passwordConfirm)
		{
			alert('Les mots de passe ne correspondent pas.');
			sent = false;
			return;
		}
		const response = await fetch('/first_step_register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				first_name: fname,
				last_name: name,
				password: password,
				nickname: pseudo,
				token: token,
			})
		});
		const data = await response.json();
		if (data.error)
		{
			alert(data.error);
			sent = false;
			return;
		}
		page++;
		sent = false;

	}

	onMount(() => {
		window.addEventListener('btnClicked', sendData);
		return (() => {
			window.removeEventListener('btnClicked', sendData);
		})
	});


</script>

<main>
	<p id="txt" class="text">Les chose sérieuses peuvent commencer, entre quelques informations essentielles.</p>
	<input id="inp-fname" class="input-text inp" type="text" placeholder="Prénom"/>
	<input id="inp-name" class="input-text inp" type="text" placeholder="Nom de famille"/>
	<input id="inp-pseudo" class="input-text inp" type="text" placeholder="Pseudonyme"/>
	<input id="inp-password" class="input-text inp" type="password" placeholder="Mot de passe"/>
	<input id="inp-password-confirm" class="input-text inp" type="password" placeholder="Confirmation"/>
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		padding: 20px;
		color: #111111;
		max-width: 35rem;
	}

	#txt {
		margin-top: 10px;
	}

	.inp {
		margin-top: 30px;
	}
</style>