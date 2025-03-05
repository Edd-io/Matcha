<script>
    let name = "Marie";
    let message = "a vu ton profil !";
</script>

<main>
    <div class="cnotif">
        <div class="pfp"></div>
        <div class="txt">
            <h1>{name}</h1>
            <p class="txt-notif">{message}</p>
        </div>
    </div>
</main>

<style>
    .cnotif {
        background-color: white;
        position: fixed;
        top: 3rem;
        left: 50%;
        transform: translateX(-50%);
        width: min(90%, 40rem);
        height: clamp(5rem, 10vw, 6rem);
        border-radius: 20px;
        display: flex;
        align-items: center;
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
        z-index: 100;
        padding: 0 1rem;
        gap: 1rem;
    }

    .pfp {
        background-color: rgb(88, 88, 88);
        width: clamp(2.5rem, 10vw, 3rem);
        height: clamp(2.5rem, 10vw, 3rem);
        border-radius: 50%;
    }

    .txt {
        display: flex;
        flex-direction: column;
    }

    .txt h1 {
        color: #111;
        font-size: clamp(1rem, 2vw, 1.2rem);
    }

    .txt-notif {
        color: #111;
        font-size: clamp(0.9rem, 1.8vw, 1rem);
    }
</style>