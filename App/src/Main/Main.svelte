<script>
    import TopBar from "./Top-bar.svelte";
    import BottomBar from "./Bottom-bar.svelte";
    import Notification from "./Notification.svelte";

    import positionLogo from "../assets/position.svg";
    import likeLogo from "../assets/heart.svg";
    import dislikeLogo from "../assets/cross.svg";
    import genderLogo from "../assets/gender.svg";
    import typeLogo from "../assets/type.svg";

    let users = [
        {
            nbPhotos: 6,
            name: "John",
            age: 25,
            city: "Paris",
            country: "France",
            gender: "Homme",
            type: "Hétéro",
            bio: "Salut, je suis John, j'aime les balades en forêt et les soirées entre amis."
        }
    ]

    let iPhoto = 0;

    import { onMount } from "svelte";
    import NotificationPage from "./Notification-page.svelte";

    function skipPhoto(event) {
        const rect = event.currentTarget.getBoundingClientRect();
        const clickX = event.clientX - rect.left;

        if (clickX < rect.width / 2 && iPhoto > 0) {
            iPhoto--;
        } else if (clickX >= rect.width / 2 && iPhoto < users[0].nbPhotos - 1) {
            iPhoto++;
        }
        console.log(iPhoto);
        console.log("translateY:", translateY, "scrollY:", window.scrollY);
    }

    let translateY = 0; // Position verticale de la div

    function handleScroll() {
    const currentScroll = window.scrollY;
    translateY = -Math.min(currentScroll, 200); // Limite la montée à 200px
    }

    onMount(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll); // Nettoyage
    });
</script>

<main>
    <TopBar />
    <!-- <NotificationPage /> -->
    <div class="main">
        <Notification />
        <!-- Scroll info (not finsihed) -->
        <!-- <div class="info-profil" style="transform: translate(-50%, calc(100px + {translateY}px));">
            <div class="user-info">
                <p id="main-info">{users[0].name} • {users[0].age}</p>
                <div class=low-info>
                    <img src={positionLogo} alt="positionLogo"/>
                    <p id="scd-info">{users[0].city}, {users[0].country}</p>
                    <img src={genderLogo} alt="genderLogo"/>
                    <p id="scd-info">{users[0].gender}</p>
                    <img src={typeLogo} alt="typeLogo"/>
                    <p id="scd-info">{users[0].type}</p>

                </div>
            </div>
        </div> -->


        <div class="photo" on:click={skipPhoto} on:keydown={skipPhoto} role="button" tabindex="0">
            <div class="centered">
                <div class="nb-photo">
                    {#each Array(users[0].nbPhotos) as _, index}
                        <div class={iPhoto === index ? "bar-photo-default" : "bar-photo-selected"}></div>
                    {/each}
                </div>
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

.info-profil{
    height: 78vh;
    width: 93%;
    border-radius: 2rem;
    background-color: red;
    position: fixed;
    transform: translate(-50%);
    transition: transform 0.2s ease-out; /* Animation fluide */
    left: 50%;
    z-index: 2;
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

.centered {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
}

.nb-photo{
    display: flex;
    justify-content: center;
    margin-top: 20px;
    flex-direction: row;
    height: 100%;
    width: 90%;
    gap: 10px;
}

.bar-photo-default{
    height: 1%;
    width: 80%;
    background-color: #111111;
    border-radius: 1rem;
}

.bar-photo-selected{
    height: 1%;
    width: 80%;
    background-color: #d9d9d9;
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