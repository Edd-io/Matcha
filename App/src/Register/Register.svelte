<script>
    // import matchaLogo from '../assets/Matcha.svg'
    export let matchaLogo;
    console.log(matchaLogo)
</script>

<main>
    <div class="main-logo">
        <img class="matcha-logo" src={matchaLogo} alt="Matcha logo"/>
        <h1>MATCHA</h1>
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