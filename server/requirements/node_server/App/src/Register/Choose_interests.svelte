<script lang='ts'>
	import '@fortawesome/fontawesome-free/css/all.css';

	let list_interests = [
		{ "id": 1, "interest": "Programmation" },
		{ "id": 2, "interest": "Lecture" },
		{ "id": 3, "interest": "Musique" },
		{ "id": 4, "interest": "Cinéma" },
		{ "id": 5, "interest": "Cuisine" },
		{ "id": 6, "interest": "Sport" },
		{ "id": 7, "interest": "Voyage" },
		{ "id": 8, "interest": "Peinture" },
		{ "id": 9, "interest": "Photographie" },
		{ "id": 10, "interest": "Jardinage" },
		{ "id": 11, "interest": "Écriture" },
		{ "id": 12, "interest": "Randonnée" },
		{ "id": 13, "interest": "Technologie" },
		{ "id": 14, "interest": "Jeux vidéo" },
		{ "id": 15, "interest": "Design" },
		{ "id": 16, "interest": "Méditation" },
		{ "id": 17, "interest": "Yoga" },
		{ "id": 18, "interest": "Danse" },
		{ "id": 19, "interest": "Astronomie" },
		{ "id": 20, "interest": "Histoire" },
		{ "id": 21, "interest": "Mode" },
		{ "id": 22, "interest": "Écologie" },
		{ "id": 23, "interest": "Politique" },
		{ "id": 24, "interest": "Philosophie" },
		{ "id": 25, "interest": "Théâtre" },
	];

	let selected_interests: number[] = [];
	let count = 0;

	function selectInterests(id: number)
	{
		if (selected_interests.includes(id))
			selected_interests = selected_interests.filter((interest) => interest !== id);
		else if (selected_interests.length < 5)
			selected_interests.push(id);
		list_interests = [...list_interests];
		count++;
	}
</script>

<main>
	<div class='container'>
		<h1>Choisis tes centres d'intérêts</h1>
		<div class='interests'>
				{#each list_interests as interest}
					<button
						class='interest-button {selected_interests.includes(interest.id) ? "selected" : ""}'
						on:click={() => selectInterests(interest.id)}
					>{interest.interest}
					<i class="fa-regular fa-circle-check"></i>
					</button>
				{/each}
		</div>
	</div>
</main>

<style>
	main {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 5;
		background-color: rgba(0, 0, 0, 0.305);
		width: 100vw;
		height: 100vh;
	}

	.container {
		width: 100%;
		max-width: 50rem;
		height: 80%;
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		background-color: white;
		border-radius: 2rem 2rem 0 0;
		padding: 2rem;
		overflow-y: auto;
	}

	h1 {
		text-align: left;
		margin-top: 2rem;
		font-size: 2rem;
	}

	.interests {
		margin-top: 2rem;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
	}

	.interest-button {
		padding: 0.5rem;
		margin: 0.5rem;
		background-color: #f1f1f1;
		border-radius: 1rem;
		transition: all 0.2s;
		font-size: 1.2rem;
		border: none;
		cursor: pointer;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.interest-button:hover {
		transform: scale(1.1);
	}

	.interest-button i {
		opacity: 0;
		transform: scale(0);
		transition: all 1s;
		width: 0;

	}

	.selected {
		background-color: #111111;
		color: white;
	}

	.selected i {
		animation: showSelected 1s;
		opacity: 1;
		transform: scale(1);
		transition: all 0.5s;
		margin-inline: 0.5rem;
		width: 1rem;
	}

	@keyframes showSelected {
		0% {
			opacity: 0;
			transform: scale(0);
		}
		100% {
			opacity: 1;
			transform: scale(1);
		}
	}
	
</style>