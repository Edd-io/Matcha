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
	globalThis.last_path = path;


	window.addEventListener('popstate', () => {
		globalThis.last_path = path;
		path = window.location.pathname;
	});
	let isConnected = false;

	globalThis.connected = writable(isConnected);
	globalThis.connected.subscribe(value => {
		isConnected = value;
		if (isConnected)
			getLocation();
	});

	globalThis.path = writable(path);
	globalThis.path.subscribe(value => {
		globalThis.last_path = path;
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

	let latitude = null;
	let longitude = null;

	function getLocation()
	{
		if (navigator.geolocation)
		{
			navigator.geolocation.getCurrentPosition(
				(position) => {
					latitude = position.coords.latitude;
					longitude = position.coords.longitude;
					fetch('/change_location', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({lat: latitude, lon: longitude})
					}).then(res => res.json())
				},
				(err) => {
					console.warn("Error getLocation: ", err.message);
				}
			);
		}
		else
			console.warn("Geolocation is not supported by this browser.");
	}
</script>

<main>
	{#if (path !== "/login" && path !== "/register" && isConnected === true)}
		<TopBar />
	{/if}
	<div class="content">
		<Router>
			{#if isConnected}
				<Route path="/" component={Main} />
			{:else}
				<Route path="/" component={Host} />
			{/if}
			<Route path="/register" component={Register} />
			<Route path="/filter" component={Filter} />
			<Route path="/login" component={Login} />
			<Route path="/map" component={Map} />
			<Route path="*" component={LoadingScreen} />
			<Route path="/profile" component={SelfInfo} />
			<Route path="/chat" component={Chat} />
			<Route path="/notification" component={NotificationPage} />
		</Router>
	</div>
	{#if (path !== "/login" && path !== "/register" && isConnected === true)}
		<BottomBar />
	{/if}
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		height: 100vh;
		max-height: 100vh;
	}

	.content {
		flex: 1;
		overflow-y: auto;
	}
</style>
