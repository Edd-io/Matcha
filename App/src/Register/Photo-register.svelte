<script lang="ts">
    const lstPhotos: string[] = [
		"https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?cs=srgb&dl=pexels-olly-774909.jpg&fm=jpg",
		"https://images.pexels.com/photos/712513/pexels-photo-712513.jpeg?cs=srgb&dl=pexels-olly-712513.jpg&fm=jpg",
		"https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?cs=srgb&dl=pexels-danxavier-1212984.jpg&fm=jpg",
	];
</script>

<main>
    <p id="txt" class="text">Pour finir, ajoute tes plus belles photos !</p>
    <div class="part">
		{#each {length: 6} as _, i}
			<button class="no-style-button button-image" aria-label='Photo {i + 1}'>
				{#if lstPhotos[i]}
					<img src={lstPhotos[i]} alt="Pfp 1" />
				{:else}
					<p style="color: #A0A0A0; font-size: 2rem">+</p>
				{/if}
			</button>
		{/each}
	</div>
    <!-- Button add -->
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
        margin-top: 45px;
    }

    .part {
		display: flex;
		flex-wrap: wrap;
		width: 90%;
        margin-top: 40px;
		/* margin-block: 1rem; */
		margin-inline: auto;
	}

    .no-style-button {
		background: none;
		border: none;
		cursor: pointer;
	}

    .button-image {
		flex-basis: 30%;
		height: 9rem;
		margin-inline: auto;
		border-radius: 1rem;
		overflow: hidden;
		background-color: #D9D9D9;
		margin-bottom: 1rem;
		transition: transform 0.2s;
	}

	.button-image:hover {
		transform: scale(1.05);
	}

	.button-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
</style>