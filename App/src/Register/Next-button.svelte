<script>
    export let page;
</script>

<main>
    <button class="next-button" on:click={() => {page++}} aria-label='Page suivante'>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" class="arrow-icon">
            <path fill="none" stroke="currentColor" stroke-width="2" d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
    </button>
</main>