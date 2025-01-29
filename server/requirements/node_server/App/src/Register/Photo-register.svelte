<script lang="ts">
	export let page: number;

	import crossLogo from "../assets/cross.svg";

	let count = 0;
	let lstPhotos = [];

	function choose_picture()
	{
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = 'image/*';
		input.onchange = (e) =>
		{
			const file = (e.target as HTMLInputElement).files[0];
			const reader = new FileReader();
			reader.onload = (e) =>
			{
				lstPhotos.push(e.target.result);
				console.log(lstPhotos);
				count++;
			};
			reader.readAsDataURL(file);
		};
		input.click();
	}
</script>

<main>
    <p id="txt" class="text">Pour finir, ajoute tes plus belles photos !</p>
    <div class="part">
		{#key count}
			{#each {length: 6} as _, i}
				<button class="no-style-button button-image" aria-label='Photo {i + 1}' on:click={choose_picture}>
					{#if lstPhotos[i]}
						<img src={lstPhotos[i]} alt="Pfp 1" />
						<button class="test">{crossLogo}</button>
					{:else}
						<p style="color: #A0A0A0; font-size: 2rem">+</p>
					{/if}
				</button>
			{/each}
		{/key}
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

	.test{
		position: absolute;
		top: 10px;
		right: 10px;
		height: 15px;
		width: 15px;
		border-radius: 50%;
		border: none;
		background-color: #111111;
		color: white;
		align-items: center;
		justify-content: center;
	}

    #txt {
        margin-top: 45px;
    }

    .part {
		display: flex;
		flex-wrap: wrap;
		width: 90%;
        margin-top: 40px;
		margin-inline: auto;
	}

    .no-style-button {
		background: none;
		border: none;
		cursor: pointer;
		position: relative;
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
		position: relative;
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