<script>
    const today = new Date();
    const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())
    .toISOString()
    .split("T")[0];
    let birthDate = "";
</script>

<main>
    <p id="txt" class="text">Quelle est ta date de naissance ?</p>
    <input id="inp" class="input-text" type="date" max={maxDate} bind:value={birthDate}/>
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
</style>