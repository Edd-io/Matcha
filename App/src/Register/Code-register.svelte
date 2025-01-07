<script>

</script>

<main>
    <p id="txt" class="text">Veuillez entrer le code donné dans <br> l’email de confirmation.</p>
    <input id="inp" class="input-text" type="text" placeholder="johndoe@gmail.com"/>
    <div class="resend-text">Vous n’avez pas reçu de code ? 
        <a href="#" class="resend-link">Renvoyer</a>
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

    #inp {
        margin-top: 100px;
    }

    .resend-text {
        font-size: 0.8rem;
        font-weight: 600;
        margin-top: 30px;
    }

    .resend-text a {
        color: #1AC83F;
    }
</style>