<script lang='ts'>
	console.log('incoming call');

	let name1 = "Mathis";
	let name2 = "Pauline";
</script>

<main>
	<div id='popup'>
		<div class="pfp-call">
			<div style="display: flex; flex-direction: column; align-items: center;">
				<img src="https://www.w3schools.com/howto/img_avatar.png" alt="Avatar" class="avatar">
				<p>{name1}</p>
			</div>
			<div style="display: flex; flex-direction: column; align-items: center;">
				<img src="https://www.w3schools.com/howto/img_avatar.png" alt="Avatar" class="avatar">
				<p>{name2}</p>
			</div>
		</div>
		<div class="info">
			<p>Appel entrant</p>
		</div>
		<div style="display: flex; justify-content: center; align-items: center; margin-top: 3rem; gap: 2rem;">
			<div class="ico-btn" style="background-color: #C64141;">
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none"><path fill="currentColor" d="M23 12.5L20.5 15l-3-2V8.842C15.976 8.337 14.146 8 12 8s-3.976.337-5.5.842V13l-3 2L1 12.5c.665-.997 2.479-2.657 5.5-3.658C8.024 8.337 9.855 8 12 8s3.976.337 5.5.842c3.021 1 4.835 2.66 5.5 3.658"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.5 8.842C15.976 8.337 14.146 8 12 8s-3.976.337-5.5.842m11 0c3.021 1 4.835 2.66 5.5 3.658L20.5 15l-3-2zm-11 0c-3.021 1-4.835 2.66-5.5 3.658L3.5 15l3-2z"/></g></svg>
			</div>
			<div class="ico-btn" style="background-color: #15902F;">
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m21 15.46l-5.27-.61l-2.52 2.52a15.05 15.05 0 0 1-6.59-6.59l2.53-2.53L8.54 3H3.03C2.45 13.18 10.82 21.55 21 20.97z"/></svg>
			</div>
		</div>
	</div>

</main>

<style>
	main {
		position: absolute;
		width: 100vw;
		height: 100vh;
		display: flex;
		flex-direction: column;
		background-color: rgba(0, 0, 0, 0.507);
		z-index: 1000;
		left: 0;
		top: 0;
	}

	#popup {
		position: absolute;
		width: 90vw;
		height: 45vh;
		background-color: white;
		z-index: 1001;
		left: 50%;
		transform: translateX(-50%);
		top: 25vh;
		border-radius: 1rem;
		max-width: 50rem;
		max-height: 50rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 2rem;
	}

	.pfp-call {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: row;
	}

	.avatar {
		width: 8rem;
		height: 8rem;
		border-radius: 50%;
		margin: 0 1rem 1rem 1rem;
	}

	.info {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		margin-top: 2rem;
	}

	.ico-btn {
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 50%;
		width: 3rem;
		height: 3rem;
		cursor: pointer;
		color: white;
	}
</style>