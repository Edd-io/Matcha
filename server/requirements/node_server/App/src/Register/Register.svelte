<script lang="ts">
	import LogoRegister from './Logo-register.svelte'
	import EmailRegister from './Email-register.svelte';
	import NextButton from './Next-button.svelte';
	import CodeRegister from './Code-register.svelte';
	import EssentialRegister from './Essential-register.svelte';
	import BirthRegister from './Birth-register.svelte';
	import TypeRegister from './Type-register.svelte';
	import InterestRegister from './Interest-register.svelte';
	import PhotoRegister from './Photo-register.svelte';
	import FinishRegister from './Finish-register.svelte';

	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { navigate } from 'svelte-routing';

	export let connected: boolean;

	let token = null;
	let currentPage = 1;
	let dataSecondStep = {};

	function slideHorizontal(node: HTMLElement) 
	{
		const delay = 0, duration = 800, easing = cubicOut;
		const style = getComputedStyle(node);
		const width = -parseFloat(style.width);

		return {
			delay,
			duration,
			easing,
			css: (t: number) => `
				transform: translateX(${(1 - t) * width}px);
				opacity: ${t}
			`,
		};
	}

	function flyWithDelay(node: HTMLElement, { x = 0, y = 0, delay = 800 }) 
	{
		return fly(node, { x, y, delay, duration: 800, easing: cubicOut });
	}
	globalThis.path.set('/register');
</script>

<main>
	<LogoRegister />
	
	{#if currentPage === 1}
		<button class="back" aria-label='Retour' on:click={() => navigate('/')}>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" class="arrow-icon">
				<path fill="none" stroke="currentColor" stroke-width="2" d="M5 12h14M12 5l7 7-7 7"/>
			</svg>
		</button>
		<div in:flyWithDelay={{ x: 500, delay: 300 }} out:slideHorizontal class="input-slider">
			<EmailRegister bind:page={currentPage} bind:token={token}/>
		</div>
	{/if}

	{#if currentPage === 2}
		<div in:flyWithDelay={{ x: 500, delay: 300 }} out:slideHorizontal class="input-slider">
			<CodeRegister bind:page={currentPage} token={token}/>
		</div>
	{/if}

	{#if currentPage === 3}
		<div in:flyWithDelay={{ x: 500, delay: 300 }} out:slideHorizontal class="input-slider">
			<EssentialRegister bind:page={currentPage} token={token}/>
		</div>
	{/if}

	{#if currentPage === 4}
		<div in:flyWithDelay={{ x: 500, delay: 300 }} out:slideHorizontal class="input-slider">
			<BirthRegister bind:page={currentPage} dataSecondStep={dataSecondStep}/>
		</div>
	{/if}

	{#if currentPage === 5}
		<div in:flyWithDelay={{ x: 500, delay: 300 }} out:slideHorizontal class="input-slider">
			<TypeRegister bind:page={currentPage} dataSecondStep={dataSecondStep}/>
		</div>
	{/if}

	{#if currentPage === 6}
		<div in:flyWithDelay={{ x: 500, delay: 300 }} out:slideHorizontal class="input-slider">
			<InterestRegister bind:page={currentPage} dataSecondStep={dataSecondStep} token={token}/>
		</div>
	{/if}

	{#if currentPage === 7}
		<div in:flyWithDelay={{ x: 500, delay: 300 }} out:slideHorizontal class="input-slider">
			<PhotoRegister bind:page={currentPage} token={token}/>
		</div>
	{/if}

	{#if currentPage === 8}
		<div in:flyWithDelay={{ x: 500, delay: 300 }} out:slideHorizontal class="input-slider">
			<FinishRegister token={token} bind:connected={connected}/>
		</div>
	{/if}


	<div id="next-button">
		<NextButton bind:page={currentPage}/>
	</div>
</main>



<style>
	#next-button {
		position: absolute;
		left: 50%;
		bottom: 10%;
		transform: translate(-50%, -50%);
	}

	#next-button:hover {
		cursor: pointer;
	}

	.back {
		position: absolute;
		top: 20px;
		left: 20px;
		border: none;
		cursor: pointer;
		background: none;
		rotate: 180deg;
	}

	.back svg {
		height: 2.5rem;
		width: 2.5rem;
	}
</style>