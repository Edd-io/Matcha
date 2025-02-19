<script lang="ts">
	import matchaLogo from '../assets/Matcha.svg';
	import AppleLogo from '../assets/apple-logo.svg';
	import GoogleLogo from '../assets/google-logo.svg';
	import { navigate } from 'svelte-routing';

	function redirect()
	{
		navigate('/register');
	}
	globalThis.path.set('/');
</script>

<main>
	<div class="main-logo">
		<img class="matcha-logo" src={matchaLogo} alt="Matcha logo"/>
		<h1>MATCHA</h1>
		<p>L’amour infusé de simplicité et d’authenticité.</p>
	</div>
	<div class="bottom">
		<div class="bot">
			<div class="buttons">
				<button on:click={redirect} class="create">
					<p>Créer <br />un compte</p>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" class="arrow-icon">
						<path fill="none" stroke="currentColor" stroke-width="2" d="M5 12h14M12 5l7 7-7 7"/>
					</svg>
				</button>
				<button>
					<img src={GoogleLogo} alt="Google logo"/>
				</button>
				<button>
					<img src={AppleLogo} alt="Apple logo"/>
				</button>
			</div>
			<button class="login-button" on:click={() => navigate('/login')}>
				<p>J’ai déjà un compte</p>
			</button>
		</div>
	</div>
</main>

<style>
	main {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
		background: linear-gradient(-45deg, #1CE346 0%, #158B2E 100%);
		height: 100vh;
	}

	.matcha-logo {
		top: auto;
		width: 175px;
		height: 175px;
		margin-top: 70px;
	}

	.main-logo {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 20px;
		color: white;
	}

	.main-logo h1 {
		font-size: 2.5rem;
		margin-top: 10px;
		text-align: center;
		font-weight: 900;
	}

	.main-logo p {
		font-size: 1rem;
		margin-top: 20px;
		text-align: center;
	}

	.bottom {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.bot {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		position: absolute;
		bottom: 5rem;
	}

	.buttons {
		display: flex;
		justify-content: center;
		align-items: center;
		text-decoration: none;
	}

	.buttons .create {
		position: relative;
		background-color: white;
		color: #111111;
		border: none;
		border-radius: 25px;
		width: 125px;
		height: 65px;
		margin: 10px;
		padding: 10px;
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
		text-align: left;
		font-weight: 500;
	}

	.arrow-icon {
		position: absolute;
		rotate: -45deg;
		top: 10px;
		right: 15px;
		width: 22px;
		height: 22px;
	}

	.buttons button {
		background-color: white;
		color: #111111;
		border: none;
		border-radius: 25px;
		width: 65px;
		height: 65px;
		margin: 10px;
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
	}

	.login-button {
		text-align: center;
		align-items: center;
		background-color: transparent;
		color: white;
		border: none;
		border-radius: 15px;
		width: 200px;
		height: 65px;
		margin: 10px;
		padding: 10px;
		font-weight: 500;
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
	}

	.buttons p{
		font-size: 1.1rem;
		font-weight: 600;
	}
</style>