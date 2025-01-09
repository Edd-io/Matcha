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
        margin-top: 60px;
    }

    #txt {
        margin-top: 40px;
        width: 90%;
        /* max-width: 35rem; */
    }

    #inp {
        height: 5rem;
        margin-top: 40px;
        resize: none;
    }

    button{
        margin-top: 30px;
    }

    .next-button svg {
        width: 18px;
        height: 18px;
        fill: #111111;
    }
</style>