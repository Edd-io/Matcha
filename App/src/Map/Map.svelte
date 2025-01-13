<script>
    import BottomBar from "../Main/Bottom-bar.svelte";
    import TopBar from "../Main/Top-bar.svelte";    
</script>

<main>
    <TopBar />
    <div class="main">
        <div class="map">

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