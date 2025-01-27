<script lang="ts">
    import LogoRegister from "./Logo-register.svelte";
	import NextButton from './Next-button.svelte';
</script>

<main>
    <LogoRegister />
    <div class="main">
        <p class="text" id="txt">Connecte toi pour fgdfgdfg</p>
        <div class="login">
            <input class="input-text" id="inp" type="text" placeholder="Nom d'utilisateur" />
        </div>
        <div class="password">
            <input class="input-text" type="password" placeholder="Mot de passe" />
        </div>
    </div>
	<div id="next-button">
        <NextButton />
    </div>
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        /* align-items: center; */
        /* justify-content: center; */
        text-align: center;
        height: 100vh;
        background-color: #f0f0f0;
    }

    .main {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }

    #txt {
		margin-top: 100px;
	}

	#inp {
		margin-top: 70px;
	}

    .login {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        margin-bottom: 20px;
    }

    .password {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        margin-bottom: 20px;
    }

    #next-button {
        display: flex;
        justify-content: center;
        width: 100%;
        margin-top: 175px;
    }
</style>