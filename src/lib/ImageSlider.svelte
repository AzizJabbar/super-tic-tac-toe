<script>
  import { fade } from 'svelte/transition';

  // Props
  export let images = []; // Array of image URLs
  export let initialIndex = 0; // Start at a specific image

  let currentIndex = initialIndex;

  // Navigation handlers
  function nextImage() {
    currentIndex = (currentIndex + 1) % images.length; // Loop back to the first image
  }

  function prevImage() {
    currentIndex = (currentIndex - 1 + images.length) % images.length; // Loop to the last image
  }
</script>

<style>
  .slider-container {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 800px;
    margin: auto;
    overflow: hidden;
    border-radius: 8px;
  }

  .slider-image {
    width: 100%;
    max-height: 400px;
    object-fit: cover;
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
    padding: 0.5rem 1rem;
    border-radius: 50%;
    cursor: pointer;
    font-size: 1.2rem;
    transition: background 0.2s;
  }

  .nav-button:hover {
    background: rgba(0, 0, 0, 0.8);
  }

  .indicator-container {
    position: absolute;
    bottom: 10px;
    display: flex;
    justify-content: center;
    gap: 0.5rem;
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
</style>

<div class="slider-container">
  {#if images.length > 0}
    <img
      class="slider-image"
      src={images[currentIndex]}
      alt={`Image ${currentIndex + 1}`}
      transition:fade
    />

    <!-- Navigation buttons -->
    <div class="navigation">
      <button class="nav-button" on:click={prevImage}>&lt;</button>
      <button class="nav-button" on:click={nextImage}>&gt;</button>
    </div>

    <!-- Indicators -->
    <div class="indicator-container">
      {#each images as _, i}
        <div
          class="indicator {currentIndex === i ? 'active' : ''}"
        ></div>
      {/each}
    </div>
  {/if}
</div>
