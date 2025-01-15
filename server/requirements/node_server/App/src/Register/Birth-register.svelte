<script>
	import { onMount } from 'svelte';
	export let page;
	export let dataSecondStep;

	let err = false;

	const today = new Date();
	const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())
		.toISOString()
		.split("T")[0];
	let birthDate = "";

	function checkBirthDate()
	{
		if (birthDate === "")
			err = true;
		else
		{
			document.getElementById('inp').setAttribute('max', maxDate);
			if (birthDate > maxDate)
				err = true;
			else
			{
				err = false;
				dataSecondStep.birthDate = birthDate;
				page++;
			}
		}
	}

	onMount(() => {
		window.addEventListener('btnClicked', checkBirthDate);
		return (() => {
			window.removeEventListener('btnClicked', checkBirthDate);
			if (timeout)
				clearTimeout(timeout);
		});
	});

</script>

<main>
	<p id="txt" class="text">Quelle est ta date de naissance ?</p>
	<input id="inp" class="input-text" type="date" max={maxDate} bind:value={birthDate}/>
	{#if err}
		<p class="error">Veuillez renseigner votre date de naissance</p>
	{/if}
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		padding: 20px;
		color: #111111;
		width: 100%;
		max-width: 35rem;
		
	}

	#txt {
		margin-top: 100px;
	}

	#inp {
		margin-top: 100px;
	}

	.error {
		color: red;
	}
</style>