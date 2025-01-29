<script>
    import BottomBar from "../Main/Bottom-bar.svelte";
    import TopBar from "../Main/Top-bar.svelte";
    import positionLogo from "../assets/position.svg";

    import 'leaflet/dist/leaflet.css';
    import { onMount } from 'svelte';

    import * as L from 'leaflet';

    let map;

    onMount(() => {
        map = L.map('map').setView([48.8566, 2.3522], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        L.marker([48.8566, 2.3522]).addTo(map) 
            .bindPopup('<div class="info-profil"><p>caca</p><p>oui</p></div>')
            .openPopup();
    });
</script>

<main>
    <TopBar />
    <div class="main">
        <div id="map">
        </div>
    </div>
    <BottomBar />
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

.info-profil {
    display: flex;
    align-items: center;
    background-color: #d9d9d9;
    border-radius: 1.1rem;
    width: 16rem;
    height: 7rem;
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

#test{
    /* display: flex;
    justify-content: center;
    align-items: center;
    width: 10%;
    height: 10%; */
    background-color: red;
    /* color: red; */
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