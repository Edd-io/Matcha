<script lang="ts">
    export let image: string;
    export let message: string;
    export let seen: boolean;
</script>

<main>
    <div class="notification">
        <div class="pfp-notif">
            <img src={image} alt="" style="height: 100%; width: 100%; border-radius: 3rem;">
        </div>
        {#if seen}
            <p class="small-txt" id="msg-notif">{message}</p>
        {:else}
            <p class="small-txt" id="msg-notif"><strong>{message}</strong></p>
        {/if}
    </div>
</main>

<style>
    .notification {
        display: flex;
        width: 100%;
        height: 13%;
        align-items: center;
        margin-bottom: 1rem;
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