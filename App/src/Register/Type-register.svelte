<script>
    import { onMount } from "svelte";
    import MaleLogo from "../assets/Male.svg";
    import FemaleLogo from "../assets/Female.svg";
    import OtherLogo from "../assets/Other.svg";
  
    let hisGender = null;
    let hisType = null;
  
    onMount(() => {
      const storedState = localStorage.getItem("hisGender");
      const storedState2 = localStorage.getItem("hisType");
      if (storedState) {
        hisGender = JSON.parse(storedState);
      }
      if (storedState2) {
        hisType = JSON.parse(storedState2);
      }
    });
  
    function handleClick(buttonIndex) {
        hisGender = buttonIndex;
      localStorage.setItem("hisGender", JSON.stringify(hisGender));
    }

    function handleClickType(buttonIndex) {
        hisType = buttonIndex;
      localStorage.setItem("hisType", JSON.stringify(hisType));
    }
</script>

<main>
    <p id="txt" class="text">Comment te définirais-tu ?</p>
    <div class="container">
        {#each [0, 1, 2] as index}
            <button
            class={hisGender === index ? "selected" : "default"}
            on:click={() => handleClick(index)}
            >
            {#if index === 0}
                <img src={MaleLogo} alt="MaleLogo"/>
            {:else if index === 1}
                <img src={FemaleLogo} alt="FemaleLogo"/>
            {:else}
                <img src={OtherLogo} alt="OtherLogo"/>
            {/if}
            </button>
        {/each}
    </div>
    <div class="gender-name">
        <p class="small-text">Homme</p>
        <p class="small-text">Femme</p>
        <p class="small-text">Autre</p>
    </div>
    <p id="txt2" class="text">Et quel genre aimerais-tu rencontrer ?</p>
    <div class="container">
        {#each [0, 1, 2] as index}
            <button
            class={hisType === index ? "selected" : "default"}
            on:click={() => handleClickType(index)}
            >
            {#if index === 0}
                <img src={MaleLogo} alt="MaleLogo"/>
            {:else if index === 1}
                <img src={FemaleLogo} alt="FemaleLogo"/>
            {:else}
                <img src={OtherLogo} alt="OtherLogo"/>
            {/if}
            </button>
        {/each}
    </div>
    <div class="gender-name">
        <p class="small-text">Homme</p>
        <p class="small-text">Femme</p>
        <p class="small-text">Autre</p>
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
        width: 100%;
        max-width: 35rem;
    }

    #txt {
        margin-top: 60px;
    }

    #txt2 {
        margin-top: 40px;
    }

    button {
        height: 3.3rem;
        width: 3.3rem;
        border: none;
        border-radius: 1rem;
        font-size: 16px;
        cursor: pointer;
        transition: background-color 0.3s ease;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .default {
        background-color: #d9d9d9;
        color: #111111;
    }

    .selected {
        background-color: #1ac83f;
    }

    .selected img {
        filter: invert(100%);
    }

    .container {
        display: flex;
        gap: 20px;
        margin-top: 40px;
    }

    .gender-name {
        display: flex;
        gap: 35px;
        margin-top: 20px;
        align-items: center;
        justify-content: center;
    }
</style>