<script>
    // import matchaLogo from '../assets/Matcha.svg'
    export let matchaLogo;
    import '@fortawesome/fontawesome-free/css/all.css'
    console.log(matchaLogo)
</script>

<main>
    <div class="main-logo">
        <img class="matcha-logo" src={matchaLogo} alt="Matcha logo"/>
        <h1>MATCHA</h1>
        <p class="text">this is a basic text</p>
        <input type="text" placeholder="Nom d'utilisateur" class="input-text"/>
        <button class="next-button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" class="arrow-icon">
                <path fill="none" stroke="currentColor" stroke-width="2" d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
        </button>
        <p class="small-text">this is a small text</p>
    </div>
</main>

<style>
    .main-logo {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 20px;
        color: #111111;
    }
</style>