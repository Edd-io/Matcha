<script>
    import BottomBar from "../Main/Bottom-bar.svelte";
    import TopBar from "../Main/Top-bar.svelte";

    import positionLogo from "../assets/position.svg";
</script>

<main>
    <TopBar />
    <div class="main">
        <div class="map">
            <div class="position">
                <img src={positionLogo} alt="positionLogo"/>
                <div class="info-profil">
                    <div class="photo"></div>
                    <p>Marie</p><p> 25</p>
                </div>
            </div>
        </div>
    </div>
    <BottomBar />
</main>

<style>

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

.map{
    height: 78vh;
    width: 93%;
    border-radius: 2rem;
    background-color: rgb(199, 199, 199);
    display: flex;
    flex-direction: column;
    justify-content: end;
}
</style>