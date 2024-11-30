<script>
  import { fade } from "svelte/transition";
  import { faAngleRight, faAngleLeft } from "@fortawesome/free-solid-svg-icons";
  import Fa from "svelte-fa";

  // Props
  export let images = []; // Array of image URLs
  export let initialIndex = 0; // Start at a specific image
  export let text = [];

  let currentIndex = initialIndex;

  // Navigation handlers
  function nextImage() {
    currentIndex = (currentIndex + 1) % images.length; // Loop back to the first image
  }

  function prevImage() {
    currentIndex = (currentIndex - 1 + images.length) % images.length; // Loop to the last image
  }
</script>

<div class="slider-container">
  {#if images.length > 0}
    <img
      class="slider-image"
      src={images[currentIndex]}
      alt={`Image ${currentIndex + 1}`}
      transition:fade
    />
    <div class="image-caption">{text[currentIndex]}</div>

    <!-- Navigation buttons -->
    <div class="navigation">
      {#if currentIndex > 0}
        <button class="nav-button" on:click={prevImage}
          ><Fa icon={faAngleLeft} /></button
        >
      {:else}
        <button class="nav-button hid" ><Fa icon={faAngleLeft} /></button>
      {/if}

      {#if currentIndex < images.length - 1}
        <button class="nav-button" on:click={nextImage}
          ><Fa icon={faAngleRight} /></button
        >
      {:else}
        <button class="nav-button hid" ><Fa icon={faAngleRight} /></button>
      {/if}
    </div>

    <!-- Indicators -->
    <div class="indicator-container">
      {#each images as _, i}
        <div class="indicator {currentIndex === i ? 'active' : ''}"></div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .slider-container {
    position: relative;
    flex-direction: column;
    display: flex;
    gap: 1rem;
    align-items: center;
    justify-content: center;
    width: 100%;
    /* max-width: 800px; */
    margin: auto;
    overflow: hidden;
    border-radius: 8px;
  }

  .slider-image {
    width: 100%;
    height: 400px;
    object-fit: contain;
    border-radius: 8px;
  }

  .navigation {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding: 0 1rem;
  }

  .nav-button {
    background: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    transition: background 0.2s;
  }

  .nav-button:hover {
    background: rgba(0, 0, 0, 0.8);
  }

  .indicator-container {
    position: absolute;
    bottom: 0px;
    display: flex;
    justify-content: center;
    gap: 0.5rem;
  }

  .image-caption {
    margin-bottom: 3rem;
    text-align: center;
  }

  .indicator {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.5);
    transition: background 0.2s;
  }

  .indicator.active {
    background: white;
  }

    .hid {
        opacity: 0;
        pointer-events: none;
    }
</style>
