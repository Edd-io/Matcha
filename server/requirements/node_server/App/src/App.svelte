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
	import SelfInfo from './SelfInfo/SelfInfo.svelte';
	import Chat from './Chat/Chat.svelte';
    import TopBar from "./Main/Top-bar.svelte";
    import BottomBar from "./Main/Bottom-bar.svelte";
	import NotificationPage from "./Main/Notification-page.svelte";

	let path: string = window.location.pathname;

	window.addEventListener('popstate', () => {
		path = window.location.pathname;
	});
	let isConnected = true;

	globalThis.connected = writable(true);
	globalThis.connected.subscribe(value => {
		isConnected = value;
	});

	globalThis.path = writable(path);
	globalThis.path.subscribe(value => {
		path = value;
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
	{#if (path !== "/login" && path !== "/register" && isConnected === true)}
		<TopBar />
	{/if}
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
		<Route path="/profile" component={SelfInfo} />
		<Route path="/chat" component={Chat} />
		<Route path="/notification" component={NotificationPage} />
	</Router>
	{#if (path !== "/login" && path !== "/register" && isConnected === true)}
		<BottomBar />
	{/if}
</main>

<style>

</style>
