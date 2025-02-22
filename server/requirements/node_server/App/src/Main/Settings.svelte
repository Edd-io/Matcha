<script>
    let name_user = "John";
    let pseudo = "JohnDoe";
    let last_name_user = "Doe";
    let age_user = 25;
    let city_user = "Paris";
    let country_user = "France";
    let password_user = "password";
    let showDeletePopup = false;
    let showDisconnectPopup = false;
    globalThis.path.set('settings');


    function disconnect()
    {
        fetch('/logout')
        .then(response => {
            if (response.ok) {
                window.location.href = '/';
            }
        });
    }

    function deleteAccount()
    {
        fetch('/delete_account')
        .then(response => {
            if (response.ok) {
                window.location.href = '/';
            }
        });
    }
</script>

<main>
    {#if showDeletePopup}
        <div class="overlay" on:click={() => showDeletePopup = false}></div>
        <div class="delete-account">
            <h2>Supprimer le compte</h2>
            <p>Vous êtes sur le point de supprimer votre compte. Cette action est irréversible.</p>
            <button class="btn" style="background-color: #c64141;" on:click={() => {deleteAccount()}}>Supprimer</button>
            <button class="btn" style="background-color: #111;" on:click={() => showDeletePopup = false}>Annuler</button>
        </div>
    {/if}

    {#if showDisconnectPopup}
        <div class="overlay" on:click={() => showDisconnectPopup = false}></div>
        <div class="delete-account">
            <h2>Déconnecter</h2>
            <p>Vous êtes sur le point de vous déconnecter. Voulez-vous continuer ?</p>
            <button class="btn" style="background-color: #c7c7c7; color: #111;" on:click={() => {disconnect()}}>Déconnecter</button>
            <button class="btn" style="background-color: #111;" on:click={() => showDisconnectPopup = false}>Annuler</button>
        </div>
    {/if}

    <div class="setting">
        <h2>PARAMÈTRES</h2>
        <div class="input-place">
            <label for="name">Prénom</label>
            <input class="input-text" type="text" id="name" name="name" value={name_user}>
        </div>
        
        <div class="input-place">
            <label for="last_name">Nom</label>
            <input class="input-text" type="text" id="last_name" name="last_name" value={last_name_user}>
        </div>
    
        <div class="input-place">
            <label for="pseudo">Pseudo</label>
            <input class="input-text" type="text" id="pseudo" name="pseudo" value={pseudo}>
        </div>
    
        <div class="input-place">
            <label for="age">Âge</label>
            <input class="input-text" type="number" id="age" name="age" min="18" value={age_user}>
        </div>

        <div class="input-place">
            <label for="password">Mot de passe</label>
            <div class="test">
                <input class="input-text" type="password" id="password" name="password" value={password_user}>
            </div>
        </div>

        <div class="settings-button">
            <button class="btn" style="background-color: #15902f;">Enregistrer</button>
            <button class="btn" style="background-color: #111;" on:click={() => showDisconnectPopup = true}>Déconnecter</button>
            <button class="btn" style="background-color: #c64141;" on:click={() => showDeletePopup = true}>Supprimer</button>
        </div>
    </div>
    
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        align-items: center;
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

    .setting {
        display: flex;
        flex-direction: column;
        width: 100%;
        padding: .5rem 2rem 2rem;
    }

    .setting h2 {
        font-size: 1.6rem;
        font-weight: 800;
    }

    .setting label {
        font-size: 1.2rem;
        font-weight: 600;
    }

    .input-place {
        display: flex;
        flex-direction: column;
        gap: 15px;
        margin-top: 20px;
        width: 100%;
    }

    .input-text {
        width: 100%;
    }

    .settings-button {
        display: flex;
        flex-direction: row;
        gap: 20px;
        justify-content: center;
        margin-top: 60px;
        bottom: 2rem;
    }

    .btn {
        color: white;
        padding: 10px 20px;
        border-radius: 2rem;
        cursor: pointer;
        border: none;
        font-weight: 600;
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
</style>