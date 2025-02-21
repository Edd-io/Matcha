<script>
    let test = "Christelle";

    function closeNotif() {
        document.querySelector(".notification").style.display = "none";
        document.querySelector(".bg").style.display = "none";
    }
</script>

<main>
    <div class="notification">
        <div class="pfp-notif"></div>
        <!-- Plus tard ajouter des if else pour mettre le bon message de notification. -->
        <p class="text" id="msg-notif"><strong>{test}</strong> apprécie votre profil ! <br> Peut-être nouvelle connexion authentique ?</p>
        <button class="valid-button" on:click={closeNotif} aria-label='Valider'>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="m9.55 18l-5.7-5.7l1.425-1.425L9.55 15.15l9.175-9.175L20.15 7.4z"/></svg>
        </button>
    </div>
    <div class="bg"></div>
</main>

<style>
    .notification {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        flex-direction: column;
        left: 50%;
        top: 35%;
        transform: translate(-50%);
        background-color: white;
        border-radius: 1rem;
        width: 70%;
        height: 23%;
        z-index: 21;
    }

    #msg-notif {
        text-align: center;
        margin-top: 40px;
    }

    .valid-button {
        height: 50px;
        width: 50px;
        border-radius: 50%;
        background-color: #15902F;
        color: white;
        font-size: 2rem;
        border: white 5px solid;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 15px;
    }

    .valid-button svg {
        height: 60%;
        width: 60%;
    }

    .pfp-notif {
        height: 100px;
        width: 100px;
        position: absolute;
        top: -50px;
        background-color: #d9d9d9;
        border-radius: 3rem;
        border: white 7px solid;
    }

    .bg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.7);
        z-index: 20;
    }
</style>