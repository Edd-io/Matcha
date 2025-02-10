<script>
    let name_user = "John";
    let age_user = 25;
    let city_user = "Paris";
    let country_user = "France";
</script>

<main>
    <p class="text">Nom d'affichage</p>
    <input class="input-text" type="text" id="fname" name="fname" value="{name_user}">
    <p class="text">Age</p>
	<input id="inp" class="input-text" type="date" value={age_user}/>
    <button class="btn">
        Enregistrer
    </button>

</main>

<style>
    main{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

    }

    /* .text{
        margin-left: 3.5rem;
        margin-top: 2rem;
        margin-bottom: 1rem;
    }

    .input-text{
		margin-left: 3.5rem;
		margin-top: 1rem;
		margin-bottom: 1rem;
	} */
</style>