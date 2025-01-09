<script>
    import TopBar from "./Top-bar.svelte";
    import BottomBar from "./Bottom-bar.svelte";

    import positionLogo from "../assets/position.svg";
    import likeLogo from "../assets/heart.svg";
    import dislikeLogo from "../assets/cross.svg";

    let users = [
        {
            name: "John",
            age: 25,
            city: "Paris",
            country: "France",
        }
    ]
</script>

<main>
    <TopBar />
    <div class="main">
        <div class="photo">
            <div class="nb-photos">
                
            </div>
            <div class="user-info">
                <p id="main-info">{users[0].name} • {users[0].age}</p>
                <div class=low-info>
                    <img src={positionLogo} alt="positionLogo"/>
                    <p id="scd-info">{users[0].city}, {users[0].country}</p>
                </div>
            </div>
            <div class=buttons>
                <button id="dislike">
                    <img src={dislikeLogo} alt="dislikeLogo"/>
                </button>
                <button id="like">
                    <img src={likeLogo} alt="likeLogo"/>
                </button>
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

.photo{
    height: 78vh;
    width: 93%;
    border-radius: 2rem;
    background-color: rgb(199, 199, 199);
    display: flex;
    flex-direction: column;
    justify-content: end;
}

.nb-photos{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 1%;
    width: 80%;
    background-color: #111111;
    border-radius: 1rem;
}

.buttons{
    display: flex;
    flex-direction: row;
    gap: 10px;
    justify-content: center;
    margin-top: 15px;
    margin-bottom: 15px;
}

.buttons button{
    display: flex;
    justify-content: center;
    align-items: center;
    text-decoration: none;
    width: 45%;
    height: 45px;
    border-radius: 1.5rem;
    border: none;
}

.user-info{
    margin-left: 20px;
}

#main-info{
    color: white;
    font-weight: 700;
    font-size: 2.5rem;
}

#scd-info{
    font-size: 1rem;
    color: white;
}

.low-info{
    display: flex;
    flex-direction: row;
    gap: 10px;
}

#dislike{
    background-color: #111111;
    color: white;
}

#like{
    background-color: #15902F;
    color: white;
}

</style>