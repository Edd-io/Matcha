<script lang="ts">
	import UserLine from "./UserLine.svelte";
	import ChooseInterests from "../Register/Choose_interests.svelte";
    import { onMount } from "svelte";
	import Cross from "../assets/cross.svg";

	let showFilter = false;
	let selected_interests: number[] = [];
	let filter_by = {
		age: [18, 100],
		fame: [0, 100],
		distance: 40000,
	};
	let sort_by = 'age';
	let self_location = {
		latitude: 48.1566,
		longitude: 2.3622
	};
	let err = {
		age: false,
		fame: false,
		distance: false
	}

	let lstUsers = [];
	let lstUsersSorted = lstUsers;
	let searchQuery = "";

	onMount(() => {
		get_users();
	});

	async function get_users()
	{
		try {
			const response = await fetch('get_list_users');
			const data = await response.json();
			lstUsers = data;
			lstUsersSorted = lstUsers;
			console.log(globalThis.self_location);
			if (globalThis.self_location.latitude !== -1)
			{
				lstUsers.forEach(user => {
					user.distance = haversine([self_location.latitude, self_location.longitude], [user.location.latitude, user.location.longitude]);
				});
			}
			else
			{
				lstUsers.forEach(user => {
					user.distance = -2;
				});
			}
		} catch (error) {
			console.error(error);
		}
	}

	function haversine(pos1, pos2): number
    {
        const earth_radius = 6378000;
        const radius = (n: number) => n  * (Math.PI / 180);

        pos1[0] = radius(pos1[0]);
        pos1[1] = radius(pos1[1]);
        pos2[0] = radius(pos2[0]);
        pos2[1] = radius(pos2[1]);

        const distance =  2 * earth_radius * Math.asin(
            Math.sqrt(
                Math.pow(Math.sin((pos2[0] - pos1[0]) / 2), 2)
                + ((Math.cos(pos1[0]) * Math.cos(pos2[0]))
                * Math.pow(Math.sin((pos2[1] - pos1[1]) / 2), 2))
            )
        )
        return (Number((distance / 1000).toFixed(2)))
    }

	function sort_by_func(age: boolean, fame: boolean, distance: boolean)
	{
		if (age)
		{
			lstUsersSorted = [...lstUsers].sort((a, b) => a.age - b.age);
			sort_by = 'age';
		}
		else if (fame)
		{
			lstUsersSorted = [...lstUsers].sort((a, b) => b.fame - a.fame);
			sort_by = 'fame';
		}
		else if (distance)
		{
			lstUsersSorted = [...lstUsers].sort((a, b) => a.distance - b.distance);
			sort_by = 'distance';
		}
		else {
			lstUsersSorted = [...lstUsers];
		}
	}

	function filter_by_change()
	{
		if (filter_by.age[0] > filter_by.age[1] || filter_by.age[0] < 18 || filter_by.age[1] > 100)
			err.age = true;
		if (filter_by.fame[0] > filter_by.fame[1] || filter_by.fame[0] < 0 || filter_by.fame[1] > 100)
			err.fame = true;
		if (filter_by.distance < 0 || filter_by.distance > 40000)
			err.distance = true;
		if (err.age || err.fame || err.distance)
			return;
		err.age = false;
		err.fame = false;
		err.distance = false;
		lstUsersSorted = lstUsers.filter(user => 
			user.age >= filter_by.age[0] && user.age <= filter_by.age[1] &&
			user.fame >= filter_by.fame[0] && user.fame <= filter_by.fame[1] &&
			user.distance <= filter_by.distance &&
			(selected_interests.length === 0 || 
			(user.interests && user.interests.some(interest => selected_interests.includes(interest))) ||
			(user.interest && user.interest.some(interest => selected_interests.includes(interest))))
		);
		showFilter = false;
	}

	$: {
		lstUsersSorted = lstUsers.filter(user => user.first_name.toLowerCase().includes(searchQuery.toLowerCase()));
	}
</script>

<main>
	<div style="display: flex; justify-content: space-between;">
		<input type="text" placeholder="Rechercher un utilisateur (Rechercher retire les filtres)" class="search-bar" bind:value={searchQuery} >
		<button class='filter-btn' on:click={() => showFilter = true}>Filtrer</button>
	</div>

	<!-- <div class="overlay"></div>
	<div class="delete-account">
		<h2>Retirer une réaction</h2>
		<p>Souhaitez-vous vraiment retirer la réaction que vous avez mis à {name} ?</p>
		<button class="btn" style="background-color: #c64141;">Oui</button>
		<button class="btn" style="background-color: #111;">Annuler</button>
	</div> -->

	<div class="search-results">
		{#each lstUsersSorted as user}
			<UserLine userInfo={user} />
		{/each}
	</div>
	{#if showFilter}
		<div class="filter">
			<div class="filter-container">
				<div class="line">
					<h2>Filtre</h2>
					<button class="close-filter-btn" on:click={() => showFilter = false}>
						<img src="{Cross}" alt="Close filter"/>
					</button>
				</div>
				<div class="line">
					<label for="age">Âge</label>
					<div style="display: flex; justify-content: space-between; width: 10rem;">
						<input class='input-nbr' type="number" placeholder="18" style="width: 45%;" bind:value={filter_by.age[0]} >
						<input class='input-nbr' type="number" placeholder="100" style="width: 45%;" bind:value={filter_by.age[1]} >
					</div>
				</div>
				<div class="line">
					<label for="fame">Fame</label>
					<div style="display: flex; justify-content: space-between; width: 10rem;">
						<input class='input-nbr' type="number" placeholder="0" style="width: 45%;" bind:value={filter_by.fame[0]} >
						<input class='input-nbr' type="number" placeholder="100" style="width: 45%;" bind:value={filter_by.fame[1]} >
					</div>
				</div>
				<div class="line">
					<label for="distance">Distance max</label>
					<div style="display: flex; justify-content: space-between; width: 10rem;">
						<input class='input-nbr' type="number" placeholder="Max" style="width: 45%;" min="0" max="40000" bind:value={filter_by.distance} >
					</div>
				</div>
				<label for="interests">Intérêts</label>
				<ChooseInterests bind:selected_interests={selected_interests} />
				<div class="line">
					<label for="filter_by">Filtrer par :</label>
					<select on:change={(e) => sort_by_func(e.target.value === "age", e.target.value === "fame", e.target.value === "distance")}>
						<option value="age" selected={sort_by === "age"}>Âge (croissant)</option>
						<option value="fame" selected={sort_by === "fame"}>Fame (Décroissant)</option>
						<option value="distance" selected={sort_by === "distance"}>Distance (croissant)</option>
					</select>
				</div>
				{#if err.age}
					<p style="color: red; text-align: center; ">L'âge doit être compris entre 18 et 100 ans sans que l'âge minimum soit supérieur à l'âge maximum.</p>
				{/if}
				{#if err.fame}
					<p style="color: red; text-align: center;">La fame doit être comprise entre 0 et 100 sans que la fame minimum soit supérieure à la fame maximum.</p>
				{/if}
				{#if err.distance}
					<p style="color: red; text-align: center;">La distance doit être comprise entre 0 et 40000 km.</p>
				{/if}
				{#if err.age || err.fame || err.distance}
					<p style="color: red; text-align: center;">Les filtres ne seront plus appliqués tant que les erreurs ne seront pas corrigées.</p>
				{/if}
				<button class='filter-btn-container' on:click={() => filter_by_change()}>Appliquer</button>
			</div>
		</div>
	{/if}
</main>

<style>

	main {
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	.overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(5px);
		border: none;
		z-index: 2;
	}

	.delete-account {
		position: absolute;
		display: flex;
		flex-direction: column;
		background-color: white;
		top: 50%;
		transform: translateY(-50%);
		margin-top: 20px;
		width: 80%;
		padding: 20px;
		gap: 20px;
		border-radius: 2rem;
		z-index: 3;
	}

	.delete-account h2 {
		font-size: 1.5rem;
		display: flex;
		justify-content: center;
	}

	.delete-account p {
		font-size: 1rem;
	}

	.btn {
		color: white;
		padding: 10px 20px;
		border-radius: 2rem;
		cursor: pointer;
		border: none;
		font-weight: 600;
	}

	.search-bar {
		width: 85%;
		height: 50px;
		border-radius: 1.1rem;
		border: 3px solid black;
		padding: 0 1rem;
		font-size: 1rem;
		margin-inline: 1%;
		margin-bottom: 1rem;
	}

	.filter-btn {
		width: 20%;
		height: 50px;
		border-radius: 1.1rem;
		border: 3px solid black;
		font-size: 1rem;
		font-weight: 600;
		margin-inline: 1%;
		margin-bottom: 1rem;
		cursor: pointer;
	}

	.filter {
		display: flex;
		flex-direction: column;
		align-items: center;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 100;
		background-color: rgba(0, 0, 0, 0.5);
	}

	.filter-container {
		display: flex;
		flex-direction: column;
		background-color: white;
		width: 80%;
		padding: 2rem;
		padding-top: 1.5rem;
		border-radius: 1rem;
		max-width: 50rem;
		margin: auto;
	}

	.close-filter-btn {
		top: 1rem;
		right: 1.5rem;
		font-size: 1.5rem;
		background-color: white;
		border: none;
		cursor: pointer;
	}

	.close-filter-btn img {
		width: 1rem;
		filter: invert(1);
	}

	.line {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	.input-nbr {
		height: 2rem;
		border-radius: 1rem;
		border: 3px solid black;
		padding-left: 0.5rem;
		font-size: 1rem;
		background-color: #f9f9f9;
	}

	select {
		height: 2rem;
		border-radius: 1rem;
		padding-left: 0.5rem;
		font-size: 1rem;
		border: none;
	}

	.filter-btn-container {
		color: white;
		padding: 10px 20px;
		border-radius: 2rem;
		background-color: #15902F;
		cursor: pointer;
		border: none;
		font-weight: 600;
		border: none;
	}

</style>
