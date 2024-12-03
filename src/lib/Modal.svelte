<script>
  import { fade, fly } from "svelte/transition";
  import { createEventDispatcher } from "svelte";
  import Fa from "svelte-fa";
  import { faX } from "@fortawesome/free-solid-svg-icons";

  // Props for customization
  export let show = false; // Controls visibility
  export let title = "Modal Title"; // Default title
  export let closable = true; // Allow closing modal with "X" button

  const dispatch = createEventDispatcher();

  function closeModal() {
    if (closable) {
      show = false; // Hide the modal
      dispatch("close");
    }
  }

  function handleConfirm() {
    dispatch("confirm");
    closeModal();
  }
</script>

{#if show}
  <div class="modal-overlay" on:click={closeModal} transition:fade>
    <div
      class="modal-container"
      on:click|stopPropagation
      transition:fly={{ y: 20, duration: 300 }}
    >
      <div class="modal-header">
        <span>{title}</span>
        {#if closable}
          <button class="close-button" on:click={closeModal}
            ><Fa icon={faX} /></button
          >
        {/if}
      </div>

      <div class="modal-body">
        <slot>Default modal content</slot>
      </div>

      <!-- <div class="modal-footer"> -->
        <!-- <button class="cancel" on:click={closeModal}>Close</button> -->
        <!-- <button class="confirm" on:click={handleConfirm}>Confirm</button> -->
      <!-- </div> -->
    </div>
  </div>
{/if}

<style>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .modal-container {
    background: var(--navy);
    padding: 2rem;
    border-radius: 8px;
    width: 80%;
    /* max-width: 500px; */
    
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    position: relative;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    @media (max-width: 768px) {
      height: 70vh;
    }
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 1.2rem;
    font-weight: bold;
  }

  .close-button {
    background: none;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    color: var(--white);
  }

  .modal-body {
    margin-top: 1rem;
  }

  .modal-footer {
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

  button.confirm {
    background-color: var(--orange, #f57c00);
    color: white;
  }

  button.cancel {
    background-color: rgba(0, 0, 0, 0.2);
    color: white;
  }
</style>
