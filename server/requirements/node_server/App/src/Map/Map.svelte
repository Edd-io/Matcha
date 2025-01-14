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
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.position img {
    width: 50px;
    height: 50px;
    position: absolute;
    bottom: 10%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.position:hover img {
    width: 60px;
    height: 60px;
}

.info-profil {
    background-color: white;
    position: relative;
    border-radius: 1.2rem;
    width: 70%;
    height: 10vh;
}

.info-profil p {
    margin: 0;
    padding: 0;
    font-size: 1rem;
}

.photo {
    background-color: #d9d9d9;
    height: 70px;
    width: 70px;
    border-radius: 3rem;
    margin: 20px;
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