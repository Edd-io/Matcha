<script lang="ts">
	import { onMount } from 'svelte';

	export let page: number;
	export let token: string;

	import crossLogo from "../assets/cross.svg";

	let count = 0;
	const lstPhotos: string[] = ["", "", "", "", "", ""];
	let err = false;

	onMount(() => {
		function clicked()
		{
			if (lstPhotos[0] === "")
				return ;
			page++;
		}

		window.addEventListener('btnClicked', clicked);
		return (() => {
			window.removeEventListener('btnClicked', clicked);
		});
	});

	function choose_picture()
	{
		err = false;
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = 'image/*';
		input.onchange = (e) =>
		{
			const file = (e.target as HTMLInputElement).files[0];
			const reader = new FileReader();
			reader.onload = (e) =>
			{
				try {
					fetch('/add_picture_register', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({
							token: token,
							base64: e.target.result,
						})
					}).then(res => {
						if (!res.ok)
							throw new Error("Error");
						return res.json()
					})
					.then((data) => {
						for (let i = 0; i < lstPhotos.length; i++)
						{
							if (lstPhotos[i] === "")
							{
								lstPhotos[i] = data.imgName;
								break;
							}
						}
						count++;
					})
					.catch(err => {
						err = true;
						count++;
					});
				}
				catch {
					err = true;
					count++;
				}
			};
			reader.readAsDataURL(file);
		};
		input.click();
	}

	function removePhoto(i: number, event: any)
	{
		event.stopPropagation();
		if (lstPhotos[i] === "")
			return;
		fetch('/delete_picture_register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				token: token,
				imgName: lstPhotos[i],
			})
		}).then(res => res.json())
		.then(data => {
			if (data.success)
			{
				lstPhotos[i] = "";
				for (let j = i; j < lstPhotos.length - 1; j++)
					lstPhotos[j] = lstPhotos[j + 1];
				lstPhotos[lstPhotos.length - 1] = "";
				count++;
			}
			else
				err = data.error;
		})
		.catch(err => {
			err = err;
		});
	}
</script>

<main>
    <p id="txt" class="text">Pour finir, ajoute tes plus belles photos !</p>
	{#key count}
		{#if err}
			<p style="color: red">Erreur lors de l'ajout de la dernière photo</p>
		{/if}
	{/key}
    <div class="part">
		{#key count}
			{#each {length: 6} as _, i}
				<button class="no-style-button button-image" aria-label='Photo {i + 1}' on:click={lstPhotos[i] === "" ? choose_picture : null}>
					{#if lstPhotos[i]}
						<img src={lstPhotos[i]} alt="Pfp 1" />
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<div class="test" role="button" aria-label='Remove photo' tabindex="0" on:click={(e) => removePhoto(i, e)}>
							<img src={crossLogo} alt="Remove"/>
						</div>
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