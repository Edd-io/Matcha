<script>
    let sliderWidth = 0;
    let buttonWidth = 0;
    let position1 = 0;
    let position2 = 100;
    let isDragging = false;
    let activeButton = null;
  
    let slider;
    let button1;
    let button2;
  
    import { onMount } from "svelte";
  
    onMount(() => {
        sliderWidth = slider.offsetWidth;
        buttonWidth = button1.offsetWidth;
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
            } else {
                position2 = Math.max(Math.min(newPos, sliderWidth - buttonWidth), position1 + buttonWidth);
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
  </script>
  
<main>
    <div class="top-notif">
        <button class="back-button" aria-label='Retour'>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" class="arrow-icon">
                <path fill="none" stroke="currentColor" stroke-width="2" d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
        </button>
        <p class="small-text" id="notif-txt">Filtrage</p>
    </div>
    <p class="text">Tranche d'age</p>
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
      width: 300px;
      height: 10px;
      background: #ddd;
      position: relative;
      border-radius: 5px;
      margin-top: 20px;
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

    .top-notif {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 20px;
        height: 10vh;
        width: 100%;
    }

    .back-button {
        position: absolute;
        left: 40px;
        border: none;
        cursor: pointer;
        background: none;
        color: #111111;
        transform: rotate(180deg) scale(2);
    }

    #notif-txt {
        font-weight: 400;
        font-size: 1.1rem;
        text-align: center;
        justify-content: center;
        margin-top: 5px;
    }
  </style>
  