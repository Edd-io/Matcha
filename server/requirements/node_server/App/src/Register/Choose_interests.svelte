<script lang='ts'>
	import '@fortawesome/fontawesome-free/css/all.css';
    import { cubicOut } from 'svelte/easing';

	export let selected_interests: number[];
	export let disabled: boolean = false;
	export let writableInterests: any = null;

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
		{ "id": 26, "interest": "Électronique" },
		{ "id": 27, "interest": "Modélisme" },
		{ "id": 28, "interest": "Sculpture" },
		{ "id": 29, "interest": "Littérature" },
		{ "id": 30, "interest": "Manga" },
		{ "id": 31, "interest": "Calligraphie" },
		{ "id": 32, "interest": "Automobile" },
		{ "id": 33, "interest": "Escrime" },
		{ "id": 34, "interest": "Boxe" },
		{ "id": 35, "interest": "Cyclisme" },
		{ "id": 36, "interest": "Natation" },
		{ "id": 37, "interest": "Langues étrangères" },
		{ "id": 38, "interest": "Volontariat" },
		{ "id": 39, "interest": "Entrepreneuriat" },
		{ "id": 40, "interest": "Sciences" },
		{ "id": 41, "interest": "Mathématiques" },
		{ "id": 42, "interest": "Biologie" },
		{ "id": 43, "interest": "Chimie" },
		{ "id": 44, "interest": "Physique" },
		{ "id": 45, "interest": "Coding" },
		{ "id": 46, "interest": "Édition vidéo" },
		{ "id": 47, "interest": "Montagne" },
		{ "id": 48, "interest": "Camping" },
		{ "id": 49, "interest": "Pêche" },
		{ "id": 50, "interest": "Chasse" },
		{ "id": 51, "interest": "Athlétisme" },
		{ "id": 52, "interest": "Breakdance" },
		{ "id": 53, "interest": "Art numérique" },
		{ "id": 54, "interest": "Dessin" },
		{ "id": 55, "interest": "Cartographie" },
		{ "id": 56, "interest": "Astronomie amateur" },
		{ "id": 57, "interest": "Vélo tout terrain" },
		{ "id": 58, "interest": "Tricot" },
		{ "id": 59, "interest": "Puzzle" },
		{ "id": 60, "interest": "Arts martiaux" },
		{ "id": 61, "interest": "Couture" },
		{ "id": 62, "interest": "Makeup" },
		{ "id": 63, "interest": "Dégustation de vins" },
		{ "id": 64, "interest": "Architecture" },
		{ "id": 65, "interest": "Urbanisme" },
		{ "id": 66, "interest": "Ethnologie" },
		{ "id": 67, "interest": "Géographie" },
		{ "id": 68, "interest": "Enseignement" },
		{ "id": 69, "interest": "Psychologie" },
		{ "id": 70, "interest": "Anthropologie" },
		{ "id": 71, "interest": "Sociologie" },
		{ "id": 72, "interest": "Tir à l'arc" },
		{ "id": 73, "interest": "Course à pied" },
		{ "id": 74, "interest": "Patinage" },
		{ "id": 75, "interest": "Escalade" },
		{ "id": 76, "interest": "Surf" },
		{ "id": 77, "interest": "Ski" },
		{ "id": 78, "interest": "Snowboard" },
		{ "id": 79, "interest": "Parkour" },
		{ "id": 80, "interest": "Kite-surf" },
		{ "id": 81, "interest": "Plongée" },
		{ "id": 82, "interest": "Radio amateur" },
		{ "id": 83, "interest": "Énigmes" },
		{ "id": 84, "interest": "Magie" },
		{ "id": 85, "interest": "Veganisme" },
		{ "id": 86, "interest": "Céramique" },
		{ "id": 87, "interest": "Tatouage" },
		{ "id": 88, "interest": "Pâtisserie" },
		{ "id": 89, "interest": "Origami" },
		{ "id": 90, "interest": "Fitness" },
		{ "id": 91, "interest": "Bodybuilding" },
		{ "id": 92, "interest": "Lego" },
		{ "id": 93, "interest": "Modélisation 3D" },
		{ "id": 94, "interest": "Domotique" },
		{ "id": 95, "interest": "Drones" },
		{ "id": 96, "interest": "E-sport" },
		{ "id": 97, "interest": "Hackathon" },
		{ "id": 98, "interest": "Podcasting" },
		{ "id": 99, "interest": "Street art" },
		{ "id": 100, "interest": "Chant" },
		{ "id": 101, "interest": "Ébénisterie" },
		{ "id": 102, "interest": "Réparation d'ordinateurs" },
		{ "id": 103, "interest": "Astrophysique" },
		{ "id": 104, "interest": "Cryptographie" },
		{ "id": 105, "interest": "Généalogie" },
		{ "id": 106, "interest": "Croisières" },
		{ "id": 107, "interest": "Scrapbooking" },
		{ "id": 108, "interest": "Collection de timbres" },
		{ "id": 109, "interest": "Collection de monnaies" },
		{ "id": 110, "interest": "Improvisation théâtrale" },
		{ "id": 111, "interest": "Parkour urbain" },
		{ "id": 112, "interest": "Jeux de société" },
		{ "id": 113, "interest": "Jeux de cartes" },
		{ "id": 114, "interest": "Cosplay" },
		{ "id": 115, "interest": "Impression 3D" },
		{ "id": 116, "interest": "Blockchain" },
		{ "id": 117, "interest": "Investissements" },
		{ "id": 118, "interest": "Chant choral" },
		{ "id": 119, "interest": "Enregistrement audio" },
		{ "id": 120, "interest": "Développement durable" },
		{ "id": 121, "interest": "Minimalisme" },
		{ "id": 122, "interest": "Alpinisme" },
		{ "id": 123, "interest": "Bricolage" },
		{ "id": 124, "interest": "Plomberie" },
		{ "id": 125, "interest": "Ébénisterie" },
		{ "id": 126, "interest": "Charpenterie" },
		{ "id": 127, "interest": "Conduite sportive" },
		{ "id": 128, "interest": "Camping-car" },
		{ "id": 129, "interest": "Trekking" },
		{ "id": 130, "interest": "Balades à cheval" },
		{ "id": 131, "interest": "Vol à voile" },
		{ "id": 132, "interest": "Avion de modélisme" },
		{ "id": 133, "interest": "Thé vert" },
		{ "id": 134, "interest": "Graphisme vectoriel" },
		{ "id": 135, "interest": "UI/UX design" },
		{ "id": 136, "interest": "Création d'extensions" },
		{ "id": 137, "interest": "Sécurité informatique" },
		{ "id": 138, "interest": "Gestion de projet" },
		{ "id": 139, "interest": "Analyse de données" },
		{ "id": 140, "interest": "Machine learning" },
		{ "id": 141, "interest": "Streaming" },
		{ "id": 142, "interest": "Réalité virtuelle" },
		{ "id": 143, "interest": "Réalité augmentée" },
		{ "id": 144, "interest": "Plantes d'intérieur" },
		{ "id": 145, "interest": "Aquariophilie" },
		{ "id": 146, "interest": "Terrariophilie" },
		{ "id": 147, "interest": "Marathon" },
		{ "id": 148, "interest": "Ultra-trail" },
		{ "id": 149, "interest": "Crossfit" },
		{ "id": 150, "interest": "Nutrition" },
		{ "id": 151, "interest": "Zumba" },
		{ "id": 152, "interest": "Fitness collectif" },
		{ "id": 153, "interest": "Paddle" },
		{ "id": 154, "interest": "Kayak" },
		{ "id": 155, "interest": "Canoë" },
		{ "id": 156, "interest": "Rafting" },
		{ "id": 157, "interest": "Thérapie animale" },
		{ "id": 158, "interest": "Soin des chevaux" },
		{ "id": 159, "interest": "Horticulture" },
		{ "id": 160, "interest": "Permaculture" },
		{ "id": 161, "interest": "Écriture de romans" },
		{ "id": 162, "interest": "Poésie" },
		{ "id": 163, "interest": "Analyse littéraire" },
		{ "id": 164, "interest": "Animation" },
		{ "id": 165, "interest": "Comédie" },
		{ "id": 166, "interest": "Satire" },
		{ "id": 167, "interest": "Podcast comique" },
		{ "id": 168, "interest": "Esotérisme" },
		{ "id": 169, "interest": "Lecture de tarot" },
		{ "id": 170, "interest": "Voyance" },
		{ "id": 171, "interest": "Énergie solaire" },
		{ "id": 172, "interest": "Énergie éolienne" },
		{ "id": 173, "interest": "Bourse" },
		{ "id": 174, "interest": "Forex" },
		{ "id": 175, "interest": "Crypto-monnaies" },
		{ "id": 176, "interest": "Analyse technique" },
		{ "id": 177, "interest": "Artisanat" },
		{ "id": 178, "interest": "Soudure" },
		{ "id": 179, "interest": "Recyclage créatif" },
		{ "id": 180, "interest": "Lutherie" },
		{ "id": 181, "interest": "Production musicale" },
		{ "id": 182, "interest": "Beatmaking" },
		{ "id": 183, "interest": "DJing" },
		{ "id": 184, "interest": "Lego Technic" },
		{ "id": 185, "interest": "Escape games" },
		{ "id": 186, "interest": "Langues anciennes" },
		{ "id": 187, "interest": "Héraldique" },
		{ "id": 188, "interest": "Cartomagie" },
		{ "id": 189, "interest": "VTT extrême" },
		{ "id": 190, "interest": "Slackline" },
		{ "id": 191, "interest": "Bushcraft" },
		{ "id": 192, "interest": "Survie" },
		{ "id": 193, "interest": "Exploration urbaine" },
		{ "id": 194, "interest": "Montage de films" },
		{ "id": 195, "interest": "Restauration de meubles" },
		{ "id": 196, "interest": "Décoration intérieure" },
		{ "id": 197, "interest": "Art contemporain" },
		{ "id": 198, "interest": "Lego Mindstorms" },
		{ "id": 199, "interest": "Création de jeux" },
		{ "id": 200, "interest": "Développement d'applications" }
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
		if (writableInterests)
			writableInterests.set(selected_interests);
	}

	function deleteInterest(id: number)
	{
		if (disabled)
			return;
		selected_interests = selected_interests.filter((interest) => interest !== id);
		if (writableInterests)
			writableInterests.set(selected_interests);
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
							<i class="fa-regular fa-circle-check" style="filter: invert(var(--invert-invert-svg));"></i>
						</button>
					{/each}
				</div>
			</div>
		</div>
	{/if}
	{#key count}
		<div class="passions">
			{#each selected_interests as id}
				<button class="no-style-button button-passion" aria-label='Supprimer cette passion' on:click={() => deleteInterest(id)}>
					<p>{list_interests.find((interest) => interest.id == id).interest}</p>
				</button>
			{/each}
			{#if disabled == false}
				<button class="no-style-button button-add-passion" aria-label='Ajouter une passion' on:click={() => visible = true}>
					<span>+</span>
				</button>
			{/if}
		</div>
	{/key}
</main>

<style>
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
		color: #111;
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
		border-radius: 2rem 2rem 0 0;
		padding: 2rem;
		overflow-y: auto;
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