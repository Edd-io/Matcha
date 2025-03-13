<script lang='ts'>
    import { writable } from 'svelte/store';
	import NotSave from '../Main/not-save.svelte';
	import Choose_interests from '../Register/Choose_interests.svelte';
	import crossLogo from "../assets/cross.svg";
	import { onMount } from 'svelte';

	globalThis.path.set('/self_info');

	const lstPhotos: string[] = ["", "", "", "", "", ""];
	let aboutMeContent = "";
	let count = 0;
	let err: String = "";
	let interests: number[] = [];
	let writableInterests: any = null;
	let writableButtonSaveClick: any = null;
	let hasChanged: boolean[] = [false, false];

	let lastInterests: number[] = [];
	globalThis.path.set('/profile');
	
	onMount(() => {
		writableInterests = writable(interests);
		writableInterests.subscribe((value: number[]) => {
			interests = value;
		});
		writableButtonSaveClick = writable(false);
		writableButtonSaveClick.subscribe((value: boolean) => {
			if (value)
				updateProfile();
		});
		getSelfInfo();
	});

	function choose_picture()
	{
		err = '';
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
						{
							for (let i = 0; i < lstPhotos.length; i++)
							{
								if (lstPhotos[i] === "")
								{
									lstPhotos[i] = data.imgName;
									count++;
									break;
								}
							}
						}
						else
							err = data.error;
						count++;
					})
					.catch(err => {
						err = err;
					});
				}
				catch (e) {
					err = e;
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
				lastInterests.push(element);
			});
			let i = 0;
			data.pfp.forEach((element: string) => {
				lstPhotos[i] = element;
				i++;
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

	function updateProfile()
	{
		err = '';
		fetch('/update_profile', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				bio: (document.querySelector('.input-text') as HTMLTextAreaElement).value,
				tags: interests,
			})
		}).then(res => res.json())
		.then(data => {
			if (data.error)
				err = data.error;
			else {
				hasChanged = [false, false];
				lastInterests = interests;
			}
		})
		.catch(err => {
			err = err;
		});
	}

	function onChangeBio(event: any)
	{
		err = '';
		let aboutMeContentTmp = event.target.value;
		if (aboutMeContentTmp.length > 500)
			event.target.value = aboutMeContentTmp.slice(0, 500);
		if (aboutMeContentTmp.length < 1)
			aboutMeContentTmp = "";
		if (aboutMeContentTmp !== aboutMeContent)
			hasChanged[0] = true;
		else
			hasChanged[0] = false;
	}

	$: {
		for (let i = 0; i < interests.length; i++)
		{
			if (interests[i] !== lastInterests[i])
			{
				hasChanged[1] = true;
				break;
			}
			if (i === interests.length - 1)
				hasChanged[1] = false;
		}
		if (interests.length !== lastInterests.length)
			hasChanged[1] = true;
	}
</script>

<main>
	{#if err.length > 0}
		<p style="color: red; text-align: center; margin-bottom: 1rem;">{err}</p>
	{/if}
	<h2>PHOTOS</h2>
	<div class="part">
		{#key count}
			{#each {length: 6} as _, i}
				<button class="no-style-button button-image" aria-label='Photo {i + 1}' on:click={lstPhotos[i] === "" ? choose_picture : null}>
					{#if lstPhotos[i] !== ""}
						<img src={lstPhotos[i]} alt="Pfp 1" />
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<div class="cross-btn" aria-label='Remove photo' role="button" tabindex="0" on:click={(e) => removePhoto(i, e)}>
							<img id="cross" src={crossLogo} alt="Remove"/>
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
				<textarea placeholder="Écris un message..." class="input-text input" on:input={onChangeBio}>{aboutMeContent}</textarea>
			</div>
		</div>
	
		<div class="input-container">
			<h2>PASSIONS</h2>
			<div style="width: 100%; height: 10rem; margin-top: 1rem; max-width: 100%;">
				{#key count}
					<Choose_interests bind:selected_interests={interests} writableInterests={writableInterests}/>
				{/key}
			</div>
		</div>
	</div>
	{#key count}
		{#if hasChanged[0] || hasChanged[1]}
			<NotSave writableButtonSaveClick={writableButtonSaveClick}/>
		{/if}
	{/key}
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

	.cross-btn{
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

	#cross{
		width: 10px;
		height: 10px;
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