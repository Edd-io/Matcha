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

	let token = null;
	let currentPage = 5;
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
</script>

<main>
	<LogoRegister />
	
	{#if currentPage === 1}
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
			<TypeRegister/>
		</div>
	{/if}

	{#if currentPage === 6}
		<div in:flyWithDelay={{ x: 500, delay: 300 }} out:slideHorizontal class="input-slider">
			<InterestRegister/>
		</div>
	{/if}

	{#if currentPage === 7}
		<div in:flyWithDelay={{ x: 500, delay: 300 }} out:slideHorizontal class="input-slider">
			<PhotoRegister/>
		</div>
	{/if}

	{#if currentPage === 8}
		<div in:flyWithDelay={{ x: 500, delay: 300 }} out:slideHorizontal class="input-slider">
			<FinishRegister/>
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
</style>