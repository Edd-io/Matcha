<script>
    import BottomBar from "../Main/Bottom-bar.svelte";
    import TopBar from "../Main/Top-bar.svelte";
    import positionLogo from "../assets/position.svg";

    import 'leaflet/dist/leaflet.css';
    import { onMount } from 'svelte';

    import * as L from 'leaflet';

    let name = "John Doe";
    let age = "43";
    let distance = "14,4km";

    let map;
    const css_marker_info = `
        <div style="display: flex; flex-direction: row; align-items: center; margin: 0; color: #111111">
            <img src="https://images.pexels.com/photos/897817/pexels-photo-897817.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="position"
                style='width: 5rem; height: 5rem; border-radius: 50%; margin: 0.9rem; object-fit: cover; margin-inline: auto;'
            />
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; margin-left: 1rem;">
                <h2 style='margin: 0'>{name}</h2>
                <p style='margin: 0'>{age} ans</p>
                <p style='margin: 0'>{distance}</p>
                <button style='background-color: transparent; text-align: left; margin-top: 0.5rem; border: none; border-bottom: 1px solid black;'>
                    Voir le profil
                </button>
            </div>
        </div>
    `;

    onMount(() => {
        map = L.map('map').setView([48.8566, 2.3522], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        L.marker([48.8566, 2.3522]).addTo(map) 
            .bindPopup(css_marker_info.replace("{name}", 'Poulet').replace("{age}", '42').replace("{distance}", '14,4km'))
            .openPopup();
    });
</script>

<main>
    <div class="main">
        <div id="map">
        </div>
    </div>
</main>

<style>

@import 'leaflet/dist/leaflet.css';

.main {
    display: flex;
    justify-content: center;
    align-items: center;
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
}

#map{
    height: 78vh;
    width: 93%;
    border-radius: 2rem;
    background-color: rgb(199, 199, 199);
    display: flex;
    flex-direction: column;
    justify-content: end;
}
</style>