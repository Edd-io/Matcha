<script>
    import matchaLogo from '../assets/Matcha.svg'
</script>

<main>
    <div class='top-bar'>
        <img class="matcha-logo" src={matchaLogo} alt="Matcha logo"/>
        <h1>MATCHA</h1>
    </div>
</main>

<style>
    .matcha-logo {
        filter: invert(95%);
        height: 3.5rem;
        width: 3.5rem;
    }

    .top-bar {
        margin-top: 20px;
        display: flex;
        align-items: center;
        padding: 20px;
        color: #111111;
        gap: 15px;
    }

    h1 {
        color: #111111;
        font-size: 1.3rem;
        font-weight: 900;
    }
</style>