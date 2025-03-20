<script>
    import matchaLogo from '../assets/Matcha.svg';
</script>

<main>
    <div class="main-logo-register">
        <img class="matcha-logo-register" src={matchaLogo} alt="Matcha logo" style="filter: invert(var(--invert-svg));"/>
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
    }
    
    .matcha-logo-register {
        margin-top: 70px;
        height: 5rem;
        width: 5rem;
    }

    .main-logo-register h1 {
        font-size: 1.3rem;
        font-weight: 900;
    }
</style>