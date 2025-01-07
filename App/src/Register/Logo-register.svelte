<script>
    export let matchaLogo;
</script>

<main>
    <div class="main-logo-register">
        <img class="matcha-logo-register" src={matchaLogo} alt="Matcha logo"/>
            <use xlink:href={matchaLogo} />
        <h1>MATCHA</h1>
    </div>
</main>

<style>
    .main-logo-register {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 20px;
        color: #111111;
    }

    .matcha-logo-register {
        margin-top: 70px;
        filter: invert(95%);
        height: 5rem;
        width: 5rem;
    }

    .main-logo-register h1 {
        color: #111111;
        font-size: 1.3rem;
        font-weight: 900;
    }
</style>