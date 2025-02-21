<script>
    import { navigate } from "svelte-routing";
    import { onMount } from 'svelte';
    import NotifComp from "./Notif-comp.svelte";
	globalThis.path.set('/notification');

    let notifs = [];

    function getNotifications()
    {
        fetch('get_notifications')
        .then(response => response.json())
        .then(data => {
            notifs = data;
        });
    }

    onMount(() => {
        let timeout = null;

        function newNotif(event)
        {
            notifs = [{...event.detail.content, seen: false}, ...notifs];
            timeout = setTimeout(() => {
                globalThis.ws.send(JSON.stringify({type: 'seen_notifs'}));
                timeout = null;
            }, 1000);
        }

        getNotifications();
        timeout = setTimeout(() => {
            globalThis.ws.send(JSON.stringify({type: 'seen_notifs'}));
            timeout = null;
        }, 1000);
        document.addEventListener('newNotification', newNotif);
        return (() => {
            if (timeout)
                clearTimeout(timeout);
            document.removeEventListener('newNotification', newNotif);
        });
    });


</script>

<main>
    <div class="top-notif">
        <button class="back-button" aria-label='Retour' on:click={() => navigate(globalThis.last_path)}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" class="arrow-icon">
                <path fill="none" stroke="currentColor" stroke-width="2" d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
        </button>
        <p class="small-text" id="notif-txt">Notification(s)</p>
    </div>
    {#each notifs as notif}
        <NotifComp image={notif.image} message={notif.message} seen={notif.seen} />
    {/each}
</main>

<style>
    main {
        position: absolute;
        height: 100vh;
        width: 100vw;
        background-color: white;
        top: 0;
        left: 0;
        z-index: 4;
    }

    .top-notif {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 20px;
        height: 10vh;
        width: 100%;
    }

    .back-button {
        position: absolute;
        left: 40px;
        border: none;
        cursor: pointer;
        background: none;
        color: #111111;
        transform: rotate(180deg) scale(2);
    }

    #notif-txt {
        font-weight: 400;
        font-size: 1.1rem;
        text-align: center;
        justify-content: center;
        margin-top: 5px;
    }
</style>