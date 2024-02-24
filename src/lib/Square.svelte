<script>
  export let mark;
  export let handleSquareClick;
  export let isActive;
</script>

<main>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-interactive-supports-focus -->
  <div class={isActive && mark === null ? "square active" : "square"} on:click={handleSquareClick} role="button">
    {#if mark === "X"}
      X
    {:else if mark === "O"}
      O
    {/if}
  </div>
</main>

<style>
  .square {
    width: var(--square-size);
    height: var(--square-size);
    border: 1px solid #000;
    opacity: 0.5;
    pointer-events: none;
    background-color: transparent;
  }
  .active {
    opacity: 1;
    cursor: pointer;
    pointer-events: auto;
    border-color: lightskyblue;
    filter: drop-shadow(0 0 5px lightskyblue);
  }
</style>
