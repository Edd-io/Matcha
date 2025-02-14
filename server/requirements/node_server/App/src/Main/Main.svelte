<script>
	import TopBar from "./Top-bar.svelte";
	import BottomBar from "./Bottom-bar.svelte";
	import Notification from "./Notification.svelte";

	import positionLogo from "../assets/position.svg";
	import likeLogo from "../assets/heart.svg";
	import dislikeLogo from "../assets/cross.svg";
	import genderLogo from "../assets/gender.svg";
	import typeLogo from "../assets/type.svg";

	import { onMount } from "svelte";
	import NotificationPage from "./Notification-page.svelte";
	import ScrollProfile from "./Scroll-profile.svelte";
    import { writable } from "svelte/store";

	let iPhoto = 0;
	let counter = 0;
	let finished = true;
	let user = null;

	if (!globalThis.userInfoSwipeZone)
		globalThis.userInfoSwipeZone = writable(null);

	globalThis.userInfoSwipeZone.subscribe(value => {
		user = value;
	});

	function skipPhoto(event)
	{
		const rect = event.currentTarget.getBoundingClientRect();
		const clickX = event.clientX - rect.left;

		if (clickX < rect.width / 2 && iPhoto > 0)
			iPhoto--;
		else if (clickX >= rect.width / 2 && iPhoto < user.nbPhotos - 1)
			iPhoto++;
	}

	let translateY = 0;

	function handleScroll() 
	{
		const currentScroll = window.scrollY;
		translateY = -Math.min(currentScroll, 200);
	}

	onMount(() => {
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	});

	let showComponent = false;

	function toggleScrollInfo() 
	{
		showComponent = !showComponent;
	}

	globalThis.path.set('/');

	function getSwipeUser()
	{
		console.log('Sending request');
		fetch('/get_swipe_user', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				distance: globalThis.filterData.range,
				range_age: [globalThis.filterData.min_age, globalThis.filterData.max_age],
				interests: globalThis.filterData.interests
			})
		}).then(res => res.json())
		.then(data => {
			globalThis.userInfoSwipeZone.set(data);
			counter++;
			iPhoto = 0;
		})
	}
	if (!globalThis.pageLoaded)
	{
		globalThis.pageLoaded = true;
		getSwipeUser();
	}
	counter++;

	function reactToUser(like)
	{
		return function()
		{
			fetch('/react_to_user', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					liked: like,
				})
			}).then(res => res.json())
			.then(data => {
				if (data.finished)
					console.log('Finished');
				else if (data.success)
					getSwipeUser();
				else
					console.log('Error');
			})
		}
	}
</script>

<main>

	<!-- <NotificationPage /> -->

	<div class="main">

		{#key counter}
			{#if showComponent}
				<ScrollProfile bind:users={user} bind:showComponent={showComponent}/>
			{/if}

			<div class="photo">
				{#if !finished}
					<div class='zone-pass'>
						<div class="centered">
							<img src={user?.images ? user?.images[iPhoto] : null} alt="" style="height: 100%; width: 100%; object-fit: cover; border-radius: 2rem;"/>
						</div>
					</div>
					<div class="centered" on:click={skipPhoto} on:keydown={skipPhoto} role="button" tabindex="0">
						<div class="nb-photo">
							{#each Array(user?.nbPhotos) as _, index}
								<div class={iPhoto === index ? "bar-photo-default" : "bar-photo-selected"}></div>
							{/each}
						</div>
					</div>
					<div class="user-info">
						<div class="info">
							<p id="main-info">{user?.name} • {user?.age}</p>
							<button class="open-scroll" on:click={toggleScrollInfo} aria-label='Ouvrir le scroll'>
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" class="arrow-icon">
									<path fill="none" stroke="currentColor" stroke-width="2" d="M5 12h14M12 5l7 7-7 7"/>
								</svg>
							</button>
						</div>
						<div class=low-info>
							<img src={positionLogo} alt="positionLogo"/>
							<p id="scd-info">{user?.city}, {user?.country}</p>
						</div>
					</div>
					<div class=buttons>
						<button id="dislike">
							<img src={dislikeLogo} alt="dislikeLogo"/>
						</button>
						<button id="like">
							<img src={likeLogo} alt="likeLogo"/>
						</button>
					</div>
				{:else}
					<div style="display: flex; justify-content: center; align-items: center; height: 100%; width: 100%;">
						<p>Aucun profil trouvé avec vos critères</p>
					</div>
<<<<<<< HEAD
				{/if}

=======
				</div>
				<div class=buttons>
					<button id="dislike" on:click={reactToUser(true)}>
						<img src={dislikeLogo} alt="dislikeLogo"/>
					</button>
					<button id="like" on:click={reactToUser(true)}>
						<img src={likeLogo} alt="likeLogo"/>
					</button>
				</div>
>>>>>>> ac26b0dfd3b5910182ce99defeab764781460627
			</div>
		{/key}
	</div>
</main>

<style>

	@keyframes slideIn {
		from {
			transform: translateY(0);
		}
		to {
			transform: translateY(200px);
		}
	}

	main{
		height: 100%;
	}

	.main {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
	}

	.zone-pass {
		width: 100%;
		height: 100%;
		position: absolute;
		z-index: 1;
		border-radius: 2rem;
	}

	.photo{
		height: 100%;
		width: 93%;
		border-radius: 2rem;
		background-color: rgb(199, 199, 199);
		display: flex;
		flex-direction: column;
		justify-content: end;
		position: relative;
	}

	.centered {
		height: 100%;
		width: 100%;
		display: flex;
		justify-content: center;
	}

	.nb-photo{
		display: flex;
		justify-content: center;
		margin-top: 20px;
		flex-direction: row;
		height: 100%;
		width: 90%;
		gap: 10px;
		z-index: 5;
	}

	.bar-photo-default{
		height: 1%;
		width: 80%;
		background-color: #111111;
		border-radius: 1rem;
	}

	.bar-photo-selected{
		height: 1%;
		width: 80%;
		background-color: #111111;
		opacity: 0.5;
		border-radius: 1rem;
	}

	.buttons{
		display: flex;
		flex-direction: row;
		gap: 10px;
		justify-content: center;
		margin-top: 15px;
		margin-bottom: 15px;
	}

	.buttons button{
		display: flex;
		justify-content: center;
		align-items: center;
		text-decoration: none;
		width: 45%;
		height: 45px;
		border-radius: 1.5rem;
		border: none;
		z-index: 5;
	}

	.user-info{
		margin-left: 20px;
		z-index: 5;
	}

	#main-info{
		color: white;
		font-weight: 700;
		font-size: 2.5rem;
	}

	.info {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-right: 27px;
	}

	.open-scroll {
		left: 85%;
		top: 9.5%;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 2rem;
		width: 2rem;
		transform: rotate(-90deg);
		border: none;
		border-radius: 1.2rem;
		cursor: pointer;
		background: none;
		background-color: #d9d9d9;
	}

	#scd-info{
		font-size: 1rem;
		z-index: 5;
	}

	.low-info{
		display: flex;
		flex-direction: row;
		gap: 10px;
		filter: invert(1);
		z-index: 5;
	}

	#dislike{
		background-color: #111111;
		color: white;
		z-index: 5;
	}

	#like{
		background-color: #15902F;
		color: white;
		z-index: 5;
	}
</style>