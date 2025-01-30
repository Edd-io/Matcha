<script lang="ts">
	import { Router, Route } from "svelte-routing";
	import Host from './Register/Host.svelte';
	import Main from './Main/Main.svelte'
	import Register from './Register/Register.svelte'
	import Map from './Map/Map.svelte'
	import Filter from './Main/Filter.svelte';
	import Login from './Register/Login.svelte';
	import LoadingScreen from './LoadingScreen/LoadingScreen.svelte';

	import { cubicOut } from "svelte/easing";
	
	let connected = false;

	window.onerror = (msg, url, lineNo, columnNo, error) =>
	{
		if (String(error).includes("TypeError: Cannot read properties of undefined (reading 'before')"))
			console.warn("This error is not important, it's a bug in svelte-routing\n\n", error);
		else
			console.error(msg, url, lineNo, columnNo, error);
		return true;
	}
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
