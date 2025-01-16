<script>
    let minAge = 18;
    let maxAge = 99;

    function handleInput(event, setter) {
        let newValue = event.target.value;
        newValue = newValue.replace(/[^0-9]/g, "");
        if (newValue.length > 2) {
            newValue = newValue.slice(0, 2);
        }
        setter(newValue);
    }
</script>

<main>
    <div class="top-filter">
        <button class="back-button" aria-label='Retour'>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" class="arrow-icon">
                <path fill="none" stroke="currentColor" stroke-width="2" d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
        </button>
        <p class="small-text" id="filter-txt">Filtrage</p>
    </div>
    <p>Age</p>
    <div class="input-container">
        <input
            type="text"
            bind:value={minAge}
            on:input={(e) => handleInput(e, (v) => (minAge = v))}
            placeholder="00"
            maxlength="2"
        />
    
        <input
            type="text"
            bind:value={maxAge}
            on:input={(e) => handleInput(e, (v) => (maxAge = v))}
            placeholder="00"
            maxlength="2"
        />
    </div>
    
    <div>
        <p>Valeur 1 : {minAge}</p>
        <p>Valeur 2 : {maxAge}</p>
    </div>
</main>

<style>
main {
        position: absolute;
        height: 100vh;
        width: 100vw;
        background-color: white;
        top: 0;
        left: 0;
        z-index: 4;
    }

    .top-filter {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 20px;
        height: 10vh;
        width: 100%;
    }

    .back-button {
        position: absolute;
        left: 40px;
        border: none;
        cursor: pointer;
        background: none;
        color: #111111;
        transform: rotate(180deg) scale(2);
    }

    #filter-txt {
        font-weight: 400;
        font-size: 1.1rem;
        text-align: center;
        justify-content: center;
        margin-top: 5px;
    }
</style>