<script>
    import { onMount } from "svelte";

    import homeLogo from "../assets/home.svg";
    import profilLogo from "../assets/profil.svg";
    import chatLogo from "../assets/chat.svg";
    import settingsLogo from "../assets/settings.svg";
    let category = null;

    onMount(() => {
        const storedState = localStorage.getItem("category");
        if (storedState) {
            category = JSON.parse(storedState);
        }
    });
  
    function handleClick(buttonIndex) {
        category = buttonIndex;
      localStorage.setItem("category", JSON.stringify(category));
    }
</script>

<main>
    {#each [0, 1, 2, 3] as index}
        <button
        class={category === index ? "selected" : "default"}
        on:click={() => handleClick(index)}
        >
        {#if index === 0}
            <img src={homeLogo} alt="homeLogo"/>
        {:else if index === 1}
            <img src={profilLogo} alt="profilLogo"/>
        {:else if index === 2}
            <img src={chatLogo} alt="chatLogo"/>
        {:else if index === 3}
            <img src={settingsLogo} alt="settingsLogo"/>
        {/if}
        </button>
    {/each}

</main>

<style>

    main {
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding: 20px;
        color: #111111;
    }

    button img {
        width: 2.1rem;
        height: 2.1rem;
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
    }
</style>