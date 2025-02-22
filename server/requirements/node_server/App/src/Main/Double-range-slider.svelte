<script>
    import { onMount } from "svelte";
    export let min_age = 18;
    export let max_age = 100;
    let sliderWidth = 0;
    let buttonWidth = 0;
    let position1 = 0;
    let position2 = 0;
    let isDragging = false;
    let activeButton = null;

    let slider;
    let button1;
    let button2;



    onMount(() => {
        sliderWidth = slider.offsetWidth;
        buttonWidth = button1.offsetWidth;
        position1 = scaleValue(min_age, 18, 100, 0, sliderWidth - buttonWidth);
        position2 = scaleValue(max_age, 18, 100, 0, sliderWidth - buttonWidth);
    });

    function startDrag(event, button) {
        isDragging = true;
        activeButton = button;
        const startX = event.clientX || event.touches[0].clientX;
        const startPosition1 = position1;
        const startPosition2 = position2;

            function move(event) {
            if (!isDragging) return;
            const currentX = event.clientX || event.touches[0].clientX;
            let newPos = (activeButton === 1 ? startPosition1 : startPosition2) + (currentX - startX);

            if (activeButton === 1) {
                position1 = Math.min(Math.max(newPos, 0), position2 - buttonWidth);
                min_age = Math.round(scaleValue(position1, 0, sliderWidth - buttonWidth, 18, 100));
            } else {
                position2 = Math.max(Math.min(newPos, sliderWidth - buttonWidth), position1 + buttonWidth);
                max_age = Math.round(scaleValue(position2, 0, sliderWidth - buttonWidth, 18, 100));
            }
        }

        function stopDrag() {
            isDragging = false;
            activeButton = null;
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
      
        <div 
          class="slider-range" 
          style="left: {position1}px; width: {position2 - position1}px"
        ></div>
        
        <div 
          bind:this={button1} 
          class="slider-button" 
          on:mousedown={(e) => startDrag(e, 1)} 
          on:touchstart={(e) => startDrag(e, 1)}
          style="left: {position1}px"
        ></div>
      
        <div 
          bind:this={button2} 
          class="slider-button" 
          on:mousedown={(e) => startDrag(e, 2)} 
          on:touchstart={(e) => startDrag(e, 2)}
          style="left: {position2}px"
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
      height: 100%;
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