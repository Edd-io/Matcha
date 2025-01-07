<script lang='ts'>

	const lstPhotos: string[] = [
		"https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?cs=srgb&dl=pexels-olly-774909.jpg&fm=jpg",
		"https://images.pexels.com/photos/712513/pexels-photo-712513.jpeg?cs=srgb&dl=pexels-olly-712513.jpg&fm=jpg",
		"https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?cs=srgb&dl=pexels-danxavier-1212984.jpg&fm=jpg",
	];
	const aboutMeContent = "Salut, je suis un étudiant en informatique passionné par le développement web. J'aime aussi la musique et les jeux vidéos.";
	const passsions = ["Développement web", "Musique", "Jeux vidéos", "Musique", "Jeux vidéos", "Musique", "Jeux vidéos", "Musique", "Jeux vidéos"];
</script>

<main>
	<h2>PHOTOS</h2>
	<div class="part">
		{#each {length: 6} as _, i}
			<button class="no-style-button button-image" aria-label='Photo 1'>
				{#if lstPhotos[i]}
					<img src={lstPhotos[i]} alt="Pfp 1" />
				{:else}
					<p style="color: #A0A0A0; font-size: 2rem">+</p>
				{/if}
			</button>
		{/each}
	</div>

	<div class="inputs">
		<div class="input-container">
			<h2>A PROPOS DE MOI</h2>
			<div class="part" style="margin-bottom: 1rem">
				<textarea placeholder="Écris un message..." class="input-text input">{aboutMeContent}</textarea>
			</div>
		</div>
	
		<div class="input-container">
			<h2>PASSIONS</h2>
			<div class="part passions">
				{#each passsions as passion}
					<button class="no-style-button button-passion" aria-label='Supprimer cette passion'>
						<p>{passion}</p>
					</button>
				{/each}
				<button class="no-style-button button-add-passion" aria-label='Ajouter une passion'>
					<span>+</span>
				</button>
			</div>
		</div>
	</div>
</main>

<style>
	main {
		padding: 2rem;
	}
	h2 {
		font-size: 0.8em;
		font-weight: 800;
		margin-top: 1rem;
	}
	.no-style-button {
		background: none;
		border: none;
		cursor: pointer;
	}
	.part {
		display: flex;
		flex-wrap: wrap;
		width: 100%;
		margin-block: 1rem;
		margin-inline: auto;
	}
	.button-image {
		flex-basis: 30%;
		height: 9rem;
		margin-inline: auto;
		border-radius: 1rem;
		overflow: hidden;
		background-color: #D9D9D9;
		margin-bottom: 1rem;
		transition: transform 0.2s;
	}
	.button-image:hover {
		transform: scale(1.05);
	}
	.button-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.input {
		width: 100%;
		height: 8rem;
		color: #111;
		font-size: 0.9rem;
		resize: none;
	}
	.passions {
		background-color: #D9D9D9;
		width: 100%;
		min-height: 8rem;
		max-width: none;
		border-radius: 0.9rem;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		padding: 0.5rem;
	}
	.passions .button-add-passion {
		width: 2rem;
		height: 2rem;
		background-color: #f7f7f7;
		border-radius: 0.9rem;
		font-size: 1.5rem;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-inline: 0.2rem;
		margin-block: auto;
	}
	.passions .button-passion {
		margin-block: auto;
		background-color: #f7f7f7;
		border-radius: 0.9rem;
		margin-inline: 0.2rem;
		margin-block: 0.2rem;
		transition: transform 0.2s, background-color 0.2s;
	}
	.passions .button-passion:hover {
		transform: scale(1.05);
		background-color: #f0f0f0;
	}
	.passions p {
		font-size: 1rem;
		height: 2.5rem;
		padding: 0.5rem;
	}
	@media (min-aspect-ratio: 1/1) {
		.button-image {
			width: 15%;
			max-width: none;
			height: 15rem;
		}
		.inputs {
			display: flex;
			flex-direction: row;
		}
		.input-container {
			width: calc(50% - 1rem);
			margin-inline: 0.5rem;
		}
		.input-container h2 {
			text-align: center;
		}

	}
</style>