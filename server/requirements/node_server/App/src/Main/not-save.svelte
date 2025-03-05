<script>

</script>

<main>
    <div class="not-saved">
        <p class="text">Attention,<br>il restes des modifications non enrengistré !</p>
        <button class="button">Enregistrer</button>
    </div>
</main>

<style>

    @keyframes fadeInUp {
        0% {
            opacity: 0;
            transform: translate(-50%, 100%);
        }
        100% {
            opacity: 1;
            transform: translate(-50%, 0);
        }
    }

    .not-saved {
        position: absolute;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 5%;
        width: 80%;
        transform: translate(-50%, 0);
        left: 50%;
        bottom: 5%;
        border-radius: 1rem;
        padding-inline: 1rem;
        background-color: #111111;
        animation: fadeInUp 0.7s;
    }

    .not-saved p{
        color: white;
        font-size: 0.7rem;
    }

    .not-saved button{
        background-color: #15902F;
        border: none;
        border-radius: 1rem;
        height: 1.5rem;
        width: 5rem;
        color: white;
    }
</style>