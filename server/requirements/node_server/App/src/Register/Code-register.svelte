<script lang="ts">
	let code = ['', '', '', ''];
	let	sent = false;

	export let page: number;
	export let token: string;
	
	let err = false;

	function handleInput(event: any, index: number)
	{
		code[index] = event.target.value.slice(-1);
		if (code[index] && index < 3)
			document.getElementById(`input-${index + 1}`).focus();
		if (index > 2)
			document.getElementById(`input-${index}`).blur();
	}

	function handleKeydown(event, index)
	{
		if (event.key === "Backspace" && !code[index] && index > 0)
			document.getElementById(`input-${index - 1}`).focus();
	}

	function sendRequest(code: string[])
	{
		if (sent)
			return ;
		err = false;
		if (code.join('').length !== 4)
			return ;
		console.log(code.join(''));
		sent = true;
		fetch('/confirm_register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ code: code.join(''), token: token })
		})
		.then(response => response.json())
		.then(data => {
			if (data.error)
			{
				err = true;
				sent = false;
			}
			else
				page++;
		})
	}
	$: sendRequest(code);
</script>

<main>
	<p id="txt" class="text">Veuillez entrer le code donné dans <br> l’email de confirmation.</p>
	<div class="code-inputs">
		{#each code as _, index}
			<input
				id={`input-${index}`}
				class="code-inputs-field"
				type="text"
				maxlength="1"
				bind:value={code[index]}
				on:input={(event) => handleInput(event, index)}
				on:keydown={(event) => handleKeydown(event, index)}
			/>
		{/each}
	</div>
	{#if err}
		<p class="error">Code invalide</p>
	{/if}
	<div class="resend-text">Vous n’avez pas reçu de code ? 
		<a href="#" class="resend-link">Renvoyer</a>
	</div>
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

	.resend-text {
		font-size: 0.8rem;
		font-weight: 600;
		margin-top: 30px;
	}

	.resend-text a {
		color: #1AC83F;
	}

	.code-inputs {
		display: flex;
		justify-content: center;
		gap: 1.2rem;
		margin-top: 100px;
		padding: 10px;
	}

	.code-inputs input {
		width: 3rem;
		height: 3rem;
		font-size: 1.5rem;
		text-align: center;
		border: none;
		border-radius: 1rem;
		background-color: #D9D9D9;
	}
	
	.error {
		color: red;
		font-size: 0.8rem;
		font-weight: 600;
		margin-top: 10px;
		width: 100%;
		text-align: center;
	}
</style>