<script lang="ts">
	import { Router, Route } from "svelte-routing";
	import { onMount, mount, unmount } from "svelte";
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
	import IncomingCall from "./Global/IncomingCall.svelte";
	import Ws from './websocket/ws';
	import NotifTel from "./Main/Notif-phone.svelte";

	let path: string = window.location.pathname;
	globalThis.last_path = path;

	let ws = null;
	let banned = false;

	window.addEventListener('popstate', () => {
		globalThis.last_path = path;
		path = window.location.pathname;
	});
	let isConnected = false;

	globalThis.connected = writable(isConnected);
	globalThis.connected.subscribe(value => {
		isConnected = value;
		if (isConnected)
		{
			fetch('/get_status_self_connected')
			.then(res => res.json())
			.then(data => {
				globalThis.self_id = data.id;
			});
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

	onMount(() => {
		let incomingCallInstance = null;

		function incommingCall(e: any)
		{
			incomingCallInstance = mount(IncomingCall, {
				target: document.body,
				props: {
					user: e.detail.user1,
					user2: e.detail.user2,
					incomming: true,
				}
			});
		}

		function calling(e: any)
		{
			incomingCallInstance = mount(IncomingCall, {
				target: document.body,
				props: {
					user: e.detail.user1,
					user2: e.detail.user2,
					calling: true,
				}
			});
		}

		function endCall()
		{
			if (incomingCallInstance)
				unmount(incomingCallInstance);
			incomingCallInstance = null;
		}

		function newNotif(e: any)
		{
			console.log(e.detail);
			mount(NotifTel, {
				target: document.body,
				props: {
					title: e.detail.title,
					message: e.detail.message,
					image: e.detail.image
				}
			});
		}

		darkMode();
		window.addEventListener('incomingCall', incommingCall);
		window.addEventListener('calling', calling);
		window.addEventListener('endCall', endCall);
		window.addEventListener('newNotif', newNotif);
		return (() => {
			window.removeEventListener('incomingCall', incommingCall);
			window.removeEventListener('calling', calling);
			window.removeEventListener('endCall', endCall);
			window.removeEventListener('newNotif', newNotif);
			if (incomingCallInstance)
				incomingCallInstance.$destroy();
		});
	});


	fetch('/get_status_self_connected')
	.then(res => res.json())
	.then(data => {
		globalThis.connected.set(data.logged);
		globalThis.self_id = data.id;
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
		fame: localStorage.getItem('fame') ? parseInt(localStorage.getItem('fame')) : 0
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

	function darkMode()
	{
		const enable = localStorage.getItem('darkMode') === 'true';

		if (enable)
		{
			document.documentElement.style.setProperty('--background-color', '#111111');
			document.documentElement.style.setProperty('--text-color', '#ffffff');
			document.documentElement.style.setProperty('--invert-svg', '1');
			document.documentElement.style.setProperty('--invert-invert-svg', '0');
		}
		else
		{
			document.documentElement.style.setProperty('--background-color', '#ffffff');
			document.documentElement.style.setProperty('--text-color', '#000000');
			document.documentElement.style.setProperty('--invert-svg', '0');
			document.documentElement.style.setProperty('--invert-invert-svg', '1');
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
		min-width: 400px;
		min-height: 600px;
	}

	.content {
		flex: 1;
		overflow-y: auto;
	}
</style>
