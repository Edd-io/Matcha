<script lang='ts'>
	import matchaLogo from '../assets/Matcha.svg';

</script>

<main>
	<div class="main-logo">
		<img class="matcha-logo" src={matchaLogo} alt="Matcha logo"/>
		<h1>MATCHA</h1>
		<p>L’amour infusé de simplicité et d’authenticité.</p>
		<div class="loading"></div>
	</div>
</main>

<style>
	main {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
		background: linear-gradient(-45deg, #1CE346 0%, #158B2E 100%);
		height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.matcha-logo {
		width: 175px;
		height: 175px;
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
		text-align: center;
		font-weight: 900;
	}

	.main-logo p {
		font-size: 1rem;
		margin-top: 1rem;
		text-align: center;
	}

	.loading {
		margin-top: 2rem;
		width: 50px;
		height: 50px;
		border: 5px solid #87db9f;
		border-top: 5px solid #006e25;
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
</style>