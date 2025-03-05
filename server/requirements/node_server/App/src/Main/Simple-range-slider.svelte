<script>
    let sliderWidth = 0;
    let buttonWidth = 0;
    let position = 0;
    let isDragging = false;

    let slider;
    let button;

    export let range = 1;
    export let fame = 1;

    import { onMount } from "svelte";

    onMount(() => {
        sliderWidth = slider.offsetWidth;
        position = scaleValue(range, 1, 100, 0, sliderWidth - buttonWidth);
        position = scaleValue(fame, 1, 10, 0, sliderWidth - buttonWidth);
        buttonWidth = button.offsetWidth;
    });

    function startDrag(event) {
        isDragging = true;
        const startX = event.clientX || event.touches[0].clientX;
        const startPosition = position;

        function move(event) {
            if (!isDragging) return;
            const currentX = event.clientX || event.touches[0].clientX;

            let newPos = startPosition + (currentX - startX);
            position = Math.min(Math.max(newPos, 0), sliderWidth - buttonWidth);
            
            range = Math.round(scaleValue(position, 0, sliderWidth - buttonWidth, 1, 100));
            fame = Math.round(scaleValue(position, 0, sliderWidth - buttonWidth, 1, 10));
        }

        function stopDrag() {
            isDragging = false;
            window.removeEventListener("mousemove", move);
            window.removeEventListener("mouseup", stopDrag);
            window.removeEventListener("touchmove", move);
            window.removeEventListener("touchend", stopDrag);
        }

        window.addEventListener("mousemove", move);
        window.addEventListener("mouseup", stopDrag);
        window.addEventListener("touchmove", move);
        window.addEventListener("touchend", stopDrag);
    }

    function scaleValue(value, inMin, inMax, outMin, outMax) {
        return outMin + ((value - inMin) * (outMax - outMin)) / (inMax - inMin);
    }
</script>
  
<main>
    <div bind:this={slider} class="slider-container">
      <div class="slider-track"></div>
        <div class="slider-range" style="width: {position}px"></div>

    <div 
        bind:this={button} 
        class="slider-button" 
        on:mousedown={startDrag} 
        on:touchstart={startDrag}
        style="left: {position}px"
      ></div>
    </div>
</main>

<style>
    .slider-container {
        width: 75%;
        height: 10px;
        background: #ddd;
        position: relative;
        border-radius: 5px;
        margin: auto;

    }

    .slider-track {
        width: 100%;
        height: 100%;
        background: #aaa;
        position: absolute;
        border-radius: 1rem;
    }

    .slider-range {
        height: 105%;
        background: #007bff;
        border-radius: 1rem 0px 0px 1rem;
        position: absolute;
    }

    .slider-button {
        width: 20px;
        height: 20px;
        background: #007bff;
        border-radius: 50%;
        position: absolute;
        top: -5px;
        cursor: grab;
    }

    .slider-button:active {
        cursor: grabbing;
    }
</style>