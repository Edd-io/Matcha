<script lang='ts'>
	import '@fortawesome/fontawesome-free/css/all.css';
	export let selected_interests: number[];
    import { cubicOut } from 'svelte/easing';
    import { on } from 'svelte/events';

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
	let visible = false;
	let count = 0;

	function selectInterests(id: number)
	{
		if (selected_interests.includes(id))
			selected_interests = selected_interests.filter((interest) => interest !== id);
		else if (selected_interests.length < 5)
		{
			selected_interests.push(id);
			count++;
		}
		list_interests = [...list_interests];
	}


	function slideVertical(node: HTMLElement)
	{
		const delay = 0, duration = 300, easing = cubicOut;
		const style = getComputedStyle(node);
		const height = parseFloat(style.height);

		return {
			delay,
			duration,
			easing,
			css: (t: number) => `
				transform: translate(-50%, ${(1 - t) * height}px);
			`,
		};
	}
</script>

<main>
	{#if visible}
		<div class="bg_container">
			<div class='container' in:slideVertical out:slideVertical>
				<div class='top'>
					<h1>Choisis tes centres d'intérêts</h1>
					<button class="hide" aria-label="Cacher les centres d'intérêts" on:click={() => visible = false}>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="35" height="35" class="arrow-icon">
							<path fill="none" stroke="currentColor" stroke-width="2" d="M5 12h14M12 5l7 7-7 7"/>
						</svg>
					</button>
				</div>
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
		</div>
	{/if}
	{#key count}
		<div class="passions">
			{#each selected_interests as id}
				<button class="no-style-button button-passion" aria-label='Supprimer cette passion' on:click={() => selected_interests = selected_interests.filter(interest => interest !== id)}>
					<p>{list_interests.find(interest => interest.id === id).interest}</p>
				</button>
			{/each}
			<button class="no-style-button button-add-passion" aria-label='Ajouter une passion' on:click={() => visible = true}>
				<span>+</span>
			</button>
		</div>
	{/key}
</main>

<style>
	/* main {
		
	} */

	main {
		width: 100%;
		height: 100%;
	}

	.no-style-button {
		background: none;
		border: none;
		cursor: pointer;
	}

	.passions {
		display: flex;
		flex-wrap: wrap;
		width: 100%;
		min-height: 8rem;
		margin-block: 1rem;
		margin-inline: auto;
		background-color: #D9D9D9;
		border-radius: 0.9rem;
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

	.bg_container {
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

	.container-interests {
		width: 100%;
		height: 100%;
		background-color: rgb(201, 201, 201);
	}

	h1 {
		text-align: left;
		margin-top: 0.5rem;
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

	.hide {
		background-color: transparent;
		border: none;
		cursor: pointer;
		transform: rotate(90deg);
		width: 2rem;
		height: 2rem;
	}

	.top {
		display: flex;
		justify-content: space-between;
		align-items: center;
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