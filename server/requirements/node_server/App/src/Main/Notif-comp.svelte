<script>
    let name = "Christelle";
</script>

<main>
    <div class="notification">
        <div class="pfp-notif"></div>
        <p class="small-txt" id="msg-notif"><strong>{name}</strong><br>Vous avez un nouveau match !</p>
    </div>
</main>

<style>
    .notification {
        display: flex;
        width: 100%;
        height: 13%;
        align-items: center;
    }

    .pfp-notif {
        height: 90px;
        width: 90px;
        background-color: #d9d9d9;
        border-radius: 3rem;
        margin-inline: 20px;
    }

    #msg-notif {
        font-size: 1.1rem;
        font-weight: 500;
        margin-inline: 10px;
    }
</style>