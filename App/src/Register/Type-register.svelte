<main>
    <p id="txt" class="text">Comment te définirais-tu ?</p>
    <div class="btn-group">
        <button class="btn">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M9.5 11c1.93 0 3.5 1.57 3.5 3.5S11.43 18 9.5 18S6 16.43 6 14.5S7.57 11 9.5 11m0-2C6.46 9 4 11.46 4 14.5S6.46 20 9.5 20s5.5-2.46 5.5-5.5c0-1.16-.36-2.23-.97-3.12L18 7.42V10h2V4h-6v2h2.58l-3.97 3.97C11.73 9.36 10.66 9 9.5 9"/></svg>
        </button>
        <button class="btn">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M17.5 9.5C17.5 6.46 15.04 4 12 4S6.5 6.46 6.5 9.5c0 2.7 1.94 4.93 4.5 5.4V17H9v2h2v2h2v-2h2v-2h-2v-2.1c2.56-.47 4.5-2.7 4.5-5.4m-9 0C8.5 7.57 10.07 6 12 6s3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5"/></svg>
        </button>
        <button class="btn">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M12 8c1.93 0 3.5 1.57 3.5 3.5S13.93 15 12 15s-3.5-1.57-3.5-3.5S10.07 8 12 8m4.53.38l3.97-3.96V7h2V1h-6v2h2.58l-3.97 3.97C14.23 6.36 13.16 6 12 6s-2.23.36-3.11.97l-.65-.65l1.41-1.41l-1.41-1.42L6.82 4.9L4.92 3H7.5V1h-6v6h2V4.42l1.91 1.9l-1.42 1.42L5.4 9.15l1.41-1.41l.65.65c-.6.88-.96 1.95-.96 3.11a5.5 5.5 0 0 0 4.5 5.41V19H9v2h2v2h2v-2h2v-2h-2v-2.09a5.5 5.5 0 0 0 3.53-8.53"/></svg>
        </button>
    </div>
    <p id="txt" class="text">Et quel genre aimerais-tu rencontrer ?</p>
    <div class="btn-group">
        <button class="btn">Homme</button>
        <button class="btn">Femme</button>
        <button class="btn">Autre</button>
    </div>

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

    #txt {
        margin-top: 100px;
    }

    .btn-group {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin-top: 30px;
    }

    .btn {
        margin: 0.5rem;
        width: 50px;
        height: 50px;
        border: none;
        text-decoration: none;
        border-radius: 1rem;
        background-color: #D9D9D9;
        color: #111111;
    }

    .btn svg {
        display: flex;
        width: 30px;
        height: 30px;
        align-items: center;
    }
</style>