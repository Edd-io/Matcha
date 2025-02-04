<script lang="ts">
	import { Router, Route } from "svelte-routing";
	import { writable } from "svelte/store";
	import Host from './Register/Host.svelte';
	import Main from './Main/Main.svelte'
	import Register from './Register/Register.svelte'
	import Map from './Map/Map.svelte'
	import Filter from './Main/Filter.svelte';
	import Login from './Register/Login.svelte';
	import LoadingScreen from './LoadingScreen/LoadingScreen.svelte';

	let isConnected = false;

	globalThis.connected = writable(false);

	globalThis.connected.subscribe(value => {
		isConnected = value;
	});

	fetch('/get_status_self_connected')
	.then(res => res.json())
	.then(data => {
		globalThis.connected.set(data.connected);
	});

	window.onerror = (msg, url, lineNo, columnNo, error) =>
	{
		if (String(error).includes("TypeError: Cannot read properties of undefined (reading 'before')"))
			console.debug("This error is not important, it's a bug in svelte-routing\n\n", error);
		else
			console.error(msg, url, lineNo, columnNo, error);
		return true;
	}
</script>

<main>
	<Router>
		<!-- {#if isConnected}
			<Route path="/" component={Main} />
		{:else}
			<Route path="/" component={Host} />
		{/if} -->
		<Route path="/" component={Main} />
		<Route path="/register" component={Register} />
		<Route path="/filter" component={Filter} />
		<Route path="/login" component={Login} />
		<Route path="/map" component={Map} />
		<Route path="*" component={LoadingScreen} />
	</Router>
</main>

<style>

</style>
