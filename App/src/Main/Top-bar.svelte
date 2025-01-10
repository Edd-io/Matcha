<script>
    import matchaLogo from '../assets/Matcha.svg'
    import settingsLogo from '../assets/settings2.svg'
</script>

<main>
    <div class='top-bar'>
        <img class="matcha-logo" src={matchaLogo} alt="Matcha logo"/>
        <h1>MATCHA</h1>
        <div class="icon-right">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M4 19v-2h2v-7q0-2.075 1.25-3.687T10.5 4.2v-.7q0-.625.438-1.062T12 2t1.063.438T13.5 3.5v.7q2 .5 3.25 2.113T18 10v7h2v2zm8 3q-.825 0-1.412-.587T10 20h4q0 .825-.587 1.413T12 22"/></svg>
            <img src={settingsLogo} alt="settingsLogo"/>
        </div>
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
        justify-content: center;
        padding: 20px;
        color: #111111;
        gap: 15px;
    }

    .icon-right {
        display: flex;
        margin-left: auto;
        align-items: center;
        gap: 25px;
        margin-right: 20px;
    }

    .icon-right svg {
        fill: #111111;
        height: 2.2rem;
        width: 2.2rem;
    }

    .icon-right img {
        height: 2.2rem;
        width: 2.2rem;
    }

    h1 {
        color: #111111;
        font-size: 1.3rem;
        font-weight: 900;
    }
</style>