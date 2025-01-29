<script>
	import { Router, Route } from "svelte-routing";
	import Host from './Register/Host.svelte';
	import Main from './Main/Main.svelte'
	import Register from './Register/Register.svelte'
	import Map from './Map/Map.svelte'
	import Filter from './Main/Filter.svelte';
	import Login from './Register/Login.svelte';
	import LoadingScreen from './LoadingScreen/LoadingScreen.svelte';
	
	let connected = false;

</script>

<main>
	<Router>
		{#if connected}
			<Route path="/" component={Main} />
		{:else}
			<Route path="/" component={Host} />
		{/if}
		<Route path="/register" component={Register} />
		<Route path="/login" component={Login} />
		<Route path="/map" component={Map} />
		<Route path="*" component={LoadingScreen} />
	</Router>
</main>

<style>

</style>
