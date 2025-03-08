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
	import Ban from "./Ban/Ban.svelte";
    import TopBar from "./Main/Top-bar.svelte";
    import BottomBar from "./Main/Bottom-bar.svelte";
	import NotificationPage from "./Main/Notification-page.svelte";
	import Settings from "./Main/Settings.svelte";
	import Search from "./Search/Search.svelte";
	import Ws from './websocket/ws';

	let path: string = window.location.pathname;
	globalThis.last_path = path;

	let ws = null;
	let banned = false;

	window.addEventListener('popstate', () => {
		globalThis.last_path = path;
		path = window.location.pathname;
	});
	let isConnected = true;

	globalThis.connected = writable(isConnected);
	globalThis.connected.subscribe(value => {
		isConnected = value;
		if (isConnected)
		{
			ws = new Ws();
			globalThis.ws = ws;
			getLocation();
		}
	});

	globalThis.banned = writable(false)
	globalThis.banned.subscribe(value => {
		banned = value;
		if (banned)
			isConnected =false;
	});

	globalThis.path = writable(path);
	globalThis.path.subscribe(value => {
		globalThis.last_path = path;
		path = value;
	});


	fetch('/get_status_self_connected')
	.then(res => res.json())
	.then(data => {
		globalThis.connected.set(data.logged);
	});

	window.onerror = (msg, url, lineNo, columnNo, error) =>
	{
		if (String(error).includes("TypeError: Cannot read properties of undefined (reading 'before')"))
			console.debug("This error is not important, it's a bug in svelte-routing\n\n", error);
		else
			console.error(msg, url, lineNo, columnNo, error);
		return true;
	}

	globalThis.filterData = {
		min_age: localStorage.getItem('min_age') ? parseInt(localStorage.getItem('min_age')) : 18,
		max_age: localStorage.getItem('max_age') ? parseInt(localStorage.getItem('max_age')) : 100,
		range: localStorage.getItem('range') ? parseInt(localStorage.getItem('range')) : 100,
		interests: localStorage.getItem('interests') ? JSON.parse(localStorage.getItem('interests')) : [],
		fame: localStorage.getItem('fame') ? parseInt(localStorage.getItem('fame')) : 1
	};

	let latitude = null;
	let longitude = null;

	function getLocation()
	{
		globalThis.self_location = {latitude: -1, longitude: -1};
		const getLocationWithIP = () => {
			fetch('https://ipapi.co/json/')
			.then(res => res.json())
			.then(data => {
				latitude = data.latitude;
				longitude = data.longitude;
				globalThis.self_location = {latitude, longitude};
				fetch('/change_location', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({lat: latitude, lon: longitude})
				})
				.then(res => res.json())
				.then(data => {
					if (data.success)
					{
						const event = new CustomEvent('locationUpdated', {detail: {}});
						document.dispatchEvent(event);
					}
					else
						console.warn("Location not updated");
				});
			});
		}

		if (navigator.geolocation)
		{
			navigator.geolocation.getCurrentPosition(
				(position) => {
					latitude = position.coords.latitude;
					longitude = position.coords.longitude;
					globalThis.self_location = {latitude, longitude};
					fetch('/change_location', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({lat: latitude, lon: longitude})
					})
					.then(res => res.json())
					.then(data => {
						if (data.success)
						{
							const event = new CustomEvent('locationUpdated', {detail: {}});
							document.dispatchEvent(event);
						}
						else
							console.warn("Location not updated");
					});
				},
				(err) => {
					console.warn("Error getLocation: ", err.message);
					getLocationWithIP();
				}
			);
		}
		else
		{
			console.warn("Geolocation is not supported by this browser.");
			getLocationWithIP();
		}
	}

	const pageWithoutBorder = ["/register", "/"];
</script>

<main style={pageWithoutBorder.includes(path) && !isConnected ? "" : "max-width: 40rem;"}>
	{#if !banned}
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
				<Route path="*" component={LoadingScreen} />
				<Route path="/register" component={Register}/>
				<Route path="/filter" component={Filter}/>
				<Route path="/login" component={Login}/>
				<Route path="/map" component={Map}/>
				<Route path="/profile" component={SelfInfo} />
				<Route path="/search" component={Search} />
				<Route path="/chat" component={Chat} />
				<Route path="/notification" component={NotificationPage} />
				<Route path="/settings" component={Settings} />
			</Router>
		</div>
		{#if (path !== "/login" && path !== "/register" && isConnected === true)}
			<BottomBar />
		{/if}
	{:else}
		<Router>
			<Route path="*" component={Ban} />
		</Router>
	{/if}
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		height: 100vh;
		max-height: 100vh;
		margin: 0 auto;
	}

	.content {
		flex: 1;
		overflow-y: auto;
	}
</style>
