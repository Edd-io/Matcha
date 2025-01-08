<main>
    <p id="txt1" class="text">Raconte ce que tu veux pour attiser <br> la curiosité !</p>
    <textarea id="inp" class="input-text" placeholder="Description..."></textarea>
    <p id="txt" class="text">Quels sont tes centres d’interets ?</p>
    <button class="next-button" aria-label='Bouton ajouter suivante'>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#111111" d="M11 13H5v-2h6V5h2v6h6v2h-6v6h-2z"/></svg>
    </button>
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        padding: 20px;
        color: #111111;
    }

    #txt1 {
        margin-top: 100px;
    }

    #txt {
        margin-top: 40px;
    }

    #inp {
        height: 5rem;
        margin-top: 40px;
        resize: none;
    }

    .next-button {
        margin-top: 40px;
        background: #F5F5F5;
        border: none;
        border-radius: 50%;
        padding: 10px;
        cursor: pointer;
    }
</style>