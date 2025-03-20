<script lang="ts">
	import 'leaflet/dist/leaflet.css';
	import { onMount } from 'svelte';

	import * as L from 'leaflet';


	let map: any;
	let self_data: any;
	const css_marker_info = (name, age, distance, img) => `
		<div style="display: flex; flex-direction: row; align-items: center; margin: 0; color: #111111">
			<img src="${img}" alt="position"
				style='width: 5rem; height: 5rem; border-radius: 50%; margin: 0.9rem; object-fit: cover; margin-inline: auto;'
			/>
			<div style="display: flex; flex-direction: column; align-items: center; justify-content: center; margin-left: 1rem;">
				<h2 style='margin: 0'>${name}</h2>
				<p style='margin: 0'>${age} ans</p>
				<p style='margin: 0'>${distance}</p>
			</div>
		</div>
	`;

	onMount(() => {
		map = L.map('map').setView([48.8566, 2.3522], 13);
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(map);

		fetch('/get_all_locations')
		.then(res => res.json())
		.then(data => {
			self_data = data.find(e => e.self);
			const markers = data.map(user => {
				if (user.self) {
					return L.marker([user.location.latitude, user.location.longitude], {
						icon: L.divIcon({
							className: '',
							html: `<img src="${user.pfp}" alt="position" style='width: 5rem; height: 5rem; border-radius: 50%; object-fit: cover; transform: translateX(-2.1rem); margin-top: 0.5rem;'/>`
						})
					}).bindPopup(css_marker_info(user.name, user.age, 'Vous êtes ici', user.pfp));
				}
				else
				{
					return L.marker([user.location.latitude, user.location.longitude], {
						icon: L.divIcon({
							className: '',
							html: `<img src="${user.pfp}" alt="position" style='width: 5rem; height: 5rem; border-radius: 50%; object-fit: cover; transform: translateX(-2.1rem); margin-top: 0.5rem;'/>`
						})
					}).bindPopup(css_marker_info(user.name, user.age, haversine([self_data.location.latitude, self_data.location.longitude], [user.location.latitude, user.location.longitude]) + 'km', user.pfp));
				}
			});
			markers.forEach(marker => marker.addTo(map));
		});
	});

	function createMarker(lat, long, name, age, pfp)
	{
		L.marker([lat, long], {
			icon: L.divIcon({
				className: '',
				html: `<img src="${pfp}" alt="position" style='width: 5rem; height: 5rem; border-radius: 50%; object-fit: cover; transform: translateX(-2.1rem); margin-top: 0.5rem;'/>`
			})
		}).addTo(map) 
			.bindPopup(css_marker_info(name, age, haversine([self_data.location.latitude, self_data.location.longitude], [lat, long]) + 'km', pfp))
			.openPopup();
	}

	function haversine(pos1, pos2)
	{
		const earth_radius = 6378000;
		const radius = (n) => n  * (Math.PI / 180);

		pos1[0] = radius(pos1[0]);
		pos1[1] = radius(pos1[1]);
		pos2[0] = radius(pos2[0]);
		pos2[1] = radius(pos2[1]);

		const distance =  2 * earth_radius * Math.asin(
			Math.sqrt(
				Math.pow(Math.sin((pos2[0] - pos1[0]) / 2), 2)
				+ ((Math.cos(pos1[0]) * Math.cos(pos2[0]))
				* Math.pow(Math.sin((pos2[1] - pos1[1]) / 2), 2))
			)
		)
		return ((distance / 1000).toFixed(2))
	}

	globalThis.bottomBarCategory.set(-1);
	globalThis.path.set('/map');
</script>

<main>
	<div class="main">
		<div id="map">
		</div>
	</div>
</main>

<style>

	@import 'leaflet/dist/leaflet.css';

	main {
		height: 100%;
	}

	.main {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
	}

	.position {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, 0);
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}

	.position img {
		width: 3rem;
		height: 3rem;
	}

	.photo {
		display: flex;
		align-items: center;
		width: 5rem;
		height: 5rem;
		background-color: #000;
		border-radius: 50%;
		margin: 0.9rem;
		height: 100%;
	}

	#map{
		height: 100%;
		width: 93%;
		border-radius: 2rem;
		background-color: rgb(199, 199, 199);
		display: flex;
		flex-direction: column;
		justify-content: end;
	}
</style>