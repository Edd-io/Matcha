<script lang="ts">
    import positionLogo from "../assets/position.svg";
    import likeLogo from "../assets/heart.svg";
    import dislikeLogo from "../assets/cross.svg";
    import genderLogo from "../assets/gender.svg";
    import typeLogo from "../assets/type.svg";
    import ChooseInterests from "../Register/Choose_interests.svelte";

    export let users;
    export let showComponent;
    let hideComponent = true;
    let selected_interests: number[] = [2,5,7,9,11];

    function toggleScrollInfo() {
        hideComponent = false;
        setTimeout(() => {
            showComponent = !showComponent;
        }, 500);
        console.log(showComponent);
    }
</script>

<main>
    <div class={hideComponent ? "info-profil show" : "info-profil hide"}>
        <button class="close-scroll" on:click={toggleScrollInfo} aria-label="Close">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" class="arrow-icon">
                <path fill="none" stroke="currentColor" stroke-width="2" d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
        </button>
        <div class="user-info">
            <p id="main-info-scroll">{users[0].name} • {users[0].age}</p>
            <div class=low-info-scroll>
                <div class="min-info">
                    <img src={positionLogo} alt="positionLogo"/>
                    <p id="scd-info">{users[0].city}, {users[0].country}</p>
                </div>
                <div class="min-info">
                    <img src={genderLogo} alt="genderLogo"/>
                    <p id="scd-info">{users[0].gender}</p>
                </div>
                <div class="min-info">
                    <img src={typeLogo} alt="typeLogo"/>
                    <p id="scd-info">{users[0].type}</p>
                </div>
            </div>
        </div>
        <div class="bar-scroll"></div>
        <div class="bio">
            <div class="cat-bio">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path fill="#111111" d="M216 32v160a8 8 0 0 1-8 8H72a16 16 0 0 0-16 16h136a8 8 0 0 1 0 16H48a8 8 0 0 1-8-8V56a32 32 0 0 1 32-32h136a8 8 0 0 1 8 8"/></svg>
                <p>Bio</p>
            </div>
            <p>{users[0].bio}</p>
        </div>
        <div class="bar-scroll"></div>
        <div class="passion">
            <div class="cat-passion">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#111111" d="M20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83l3.75 3.75M3 17.25V21h3.75L17.81 9.93l-3.75-3.75z"/></svg>
                <p>Passions</p>
            </div>
            <!-- ICI tu mets le ton composant sans le '+' -->
            <ChooseInterests bind:selected_interests={selected_interests} disabled={true}/>
        </div>
        <div class="div-btn">
            <button class="scroll-btn">Lorem</button>
            <button class="scroll-btn">Bloquer</button>
            <button class="scroll-btn" id="signal-btn">Signaler</button>
        </div>
    </div>
</main>

<style>

@keyframes slideIn {
    from {
        bottom: -600px;
    }
    to {
        bottom: 1rem;
    }
}

@keyframes slideOut {
    from {
        bottom: 1rem;
    }
    to {
        bottom: -600px;
    }
}

main {
    z-index: 999;
}

p {
    color: #111111;
    font-size: 1.3rem;
}

.info-profil.show {
    animation: slideIn 0.5s ease forwards;
}

.info-profil.hide {
    animation: slideOut 0.5s ease forwards;
}

.close-scroll{
    position: relative;
    left: 85%;
    top: 9.5%;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 2rem;
    width: 2rem;
    transform: rotate(90deg);
    border: none;
    border-radius: 1.2rem;
    cursor: pointer;
    background: none;
    background-color: #d9d9d9;
}

.close-scroll svg{
    width: 20px;
    height: 20px;
}

.info-profil{
    height: 60vh;
    width: 94%;
    border-radius: 2rem;
    background-color: white;
    position: fixed;
    transform: translate(-50%);
    left: 50%;
    z-index: 2;
    transition: bottom 0.5s;
}

.info-profil p {
    color: #111111;
}

#main-info-scroll{
    color: #111111;
    font-weight: 700;
    font-size: 2.5rem;
    margin: 20px;
}

.low-info-scroll{
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin: 20px;
    color: #111111;
}

.low-info-scroll p{
    color: #111111;
}

.min-info{
    display: flex;
    flex-direction: row;
    gap: 25px;
    color: #111111;
}

.bar-scroll {
    margin: 5%;
    margin-top: 100px;
    border: 0;
    height: 5px;
    align-items: center;
    justify-content: center;
    background: #d9d9d9;
    margin-top: 0;
    margin-bottom: 0;
}

.bio{
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-left: 20px;
    margin-block: 20px;
}

.cat-bio{
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
}

.bio svg{
    width: 25px;
    height: 25px;
}

.passion{
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-left: 20px;
    margin-block: 20px;
}

.cat-passion{
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
}

.passion svg{
    width: 25px;
    height: 25px;
}

.div-btn{
    display: flex;
    flex-direction: row;
    gap: 10px;
    justify-content: center;
    margin-block: 35px;
    margin-inline: 20px;
}

#signal-btn{
    background-color: #C64141;
}

.scroll-btn{
    display: flex;
    justify-content: center;
    align-items: center;
    text-decoration: none;
    width: 45%;
    height: 35px;
    border-radius: 1.5rem;
    border: none;
    font-weight: 700;
    background-color: #111111;
    color: white;
}
</style>