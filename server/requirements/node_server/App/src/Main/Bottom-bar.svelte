<script>
    import { onMount } from "svelte";

    import homeLogo from "../assets/home.svg";
    import profilLogo from "../assets/profil.svg";
    import chatLogo from "../assets/chat.svg";
    import settingsLogo from "../assets/settings.svg";
    import searchLogo from "../assets/search.svg";
    import { navigate } from "svelte-routing";
    import { writable } from "svelte/store";
    let category = null;

    function handleClick(buttonIndex) {
        category = buttonIndex;
        localStorage.setItem("category", JSON.stringify(category));
    }

    globalThis.bottomBarCategory = writable(0);

    bottomBarCategory.subscribe(value => {
        category = value;
    });
</script>

<main>
            <button on:click={() => {navigate('/'), handleClick(0)}} ariel-label="home" class={category === 0 ? "selected" : "default"}>
                <img src={homeLogo} alt="homeLogo"/>
            </button>
            <button on:click={() => {navigate('/profile'), handleClick(1)}} ariel-label="profil" class={category === 1 ? "selected" : "default"}>
                <img src={profilLogo} alt="profilLogo"/>
            </button>
            <button on:click={() => {navigate('/chat'), handleClick(2)}} ariel-label="chat" class={category === 2 ? "selected" : "default"}>
                <img src={chatLogo} alt="chatLogo"/>
            </button>
            <button on:click={() => {navigate('/search'), handleClick(3)}} ariel-label="search" class={category === 3 ? "selected" : "default"}>
                <img src={searchLogo} alt="settingsLogo"/>
            </button>
            <button on:click={() => {navigate('/settings'), handleClick(4)}} ariel-label="settings" class={category === 4 ? "selected" : "default"}>
                <img src={settingsLogo} alt="settingsLogo"/>
            </button>
</main>

<style>

    main {
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding: 20px;
        color: #111111;
        margin-top: auto;
    }

    button img {
        width: 2.1rem;
        height: 2.1rem;
        color: #111111;
    }

    .selected {
        border: none;
        cursor: pointer;
    }

    .default {
        border: none;
        cursor: pointer;
        opacity: 0.5;
    }

    button{
        border: none;
        cursor: pointer;
        background: none;
    }
</style>