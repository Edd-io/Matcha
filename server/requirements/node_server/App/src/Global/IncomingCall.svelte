<script lang='ts'>
	console.log('incoming call');
</script>

<main>
	<div id='popup'>

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
		width: 50vw;
		height: 50vh;
		background-color: white;
		z-index: 1001;
		left: 25vw;
		top: 25vh;
		border-radius: 1rem;
		max-width: 50rem;
		max-height: 50rem;
	}




</style>