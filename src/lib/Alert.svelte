<script>
  import { fade, fly } from 'svelte/transition';
  import { createEventDispatcher } from 'svelte';

  // Props for customization
  export let message = "Are you sure?";
  export let show = false;

  const dispatch = createEventDispatcher();

  // Handlers for button clicks
  function handleYes() {
    dispatch('confirm', { choice: 'yes' });
    closeAlert();
  }

  function handleNo() {
    dispatch('confirm', { choice: 'no' });
    closeAlert();
  }

  function closeAlert() {
    show = false; // Hide the alert
  }
</script>

<style>
  .alert-container {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.5);
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    padding: 1rem 1.5rem;
    border-radius: 8px;
    z-index: 1000;
    text-align: center;
  }
  .buttons {
    margin-top: 1rem;
    display: flex;
    justify-content: end;
    gap: 1rem;
  }
  button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 5px;

    cursor: pointer;
  }
  button.yes {
    background-color: var(--orange);
    color: white;
  }
  button.no {
    background-color: rgba(0, 0, 0, 0.2);
    color: white;
  }
</style>

{#if show}
  <div 
    class="alert-container" 
    transition:fly="{{ y: -100, duration: 300 }}" 
  >
    <p>{message}</p>
    <div class="buttons">
      <button class="yes" on:click={handleYes}>Yes</button>
      <button class="no" on:click={handleNo}>No</button>
    </div>
  </div>
{/if}
