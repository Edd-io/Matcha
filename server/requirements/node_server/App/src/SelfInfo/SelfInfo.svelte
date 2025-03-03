<script lang='ts'>
	import NotSave from '../Main/not-save.svelte';
	import Choose_interests from '../Register/Choose_interests.svelte';
	import crossLogo from "../assets/cross.svg";
	import { onMount } from 'svelte';

	globalThis.path.set('/self_info');

	const lstPhotos: string[] = [];
	let aboutMeContent = "";
	let count = 0;
	let err: boolean = false;
	let interests: number[] = [];
	globalThis.path.set('/profile');
	
	onMount(() => {
		getSelfInfo();
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
							base64: e.target.result,
						})
					}).then(res => res.json())
					.then(data => {
						if (data.success)
							lstPhotos.push(data.imgName);
						else
							err = true;
						count++;
					})
					.catch(err => {
						err = true;
					});
				}
				catch {
					err = true;
				}
			};
			reader.readAsDataURL(file);
		};
		input.click();
	}

	function getSelfInfo()
	{
		fetch('/get_self_info', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		}).then(res => res.json())
		.then(data => {
			aboutMeContent = data.bio;
			data.tags.forEach((element: number) => {
				interests.push(element);
			});
			data.pfp.forEach((element: string) => {
				lstPhotos.push(element);
			});
			count++;
		})
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
				imgName: lstPhotos[i],
			})
		}).then(res => res.json())
		.then(data => {
			if (data.success)
				lstPhotos[i] = "";
			else
				err = true;
		})
		.catch(err => {
			err = true;
		});
	}

	function updateProfile()
	{
		fetch('/update_profile', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				bio: aboutMeContent,
				tags: interests,
			})
		}).then(res => res.json())
		.then(data => {
			if (data.success)
				globalThis.router.push('/profile');
			else
				err = true;
		})
		.catch(err => {
			err = true;
		});
	}
</script>

<main>
	<h2>PHOTOS</h2>
	<div class="part">
		{#key count}
			{#each {length: 6} as _, i}
				<button class="no-style-button button-image" aria-label='Photo {i + 1}' on:click={choose_picture}>
					{#if lstPhotos[i]}
						<img src={lstPhotos[i]} alt="Pfp 1" />
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<div class="test" aria-label='Remove photo' role="button" tabindex="0" on:click={(e) => removePhoto(i, e)}>
							<img src={crossLogo} alt="Remove"/>
						</div>
					{:else}
						<p style="color: #A0A0A0; font-size: 2rem">+</p>
					{/if}
				</button>
			{/each}
		{/key}
	</div>

	<div class="inputs">
		<div class="input-container">
			<h2>A PROPOS DE MOI</h2>
			<div class="part" style="margin-bottom: 1rem">
				<textarea placeholder="Écris un message..." class="input-text input">{aboutMeContent}</textarea>
			</div>
		</div>
	
		<div class="input-container">
			<h2>PASSIONS</h2>
			<div style="width: 100%; height: 10rem; margin-top: 1rem; max-width: 100%;">
				{#key count}
					<Choose_interests bind:selected_interests={interests}/>
				{/key}
			</div>
		</div>
	</div>
	<NotSave />
</main>

<style>
	main {
		padding: 2rem;
		padding-top: 0.5rem;
	}
	h2 {
		font-size: 0.8em;
		font-weight: 800;
	}
	.no-style-button {
		background: none;
		border: none;
		cursor: pointer;
	}
	.part {
		display: flex;
		flex-wrap: wrap;
		width: 100%;
		margin-block: 1rem;
		margin-inline: auto;
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
	.input {
		width: 100%;
		height: 8rem;
		color: #111;
		font-size: 0.9rem;
		resize: none;
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
		z-index: 5;
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