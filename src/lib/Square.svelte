<script>
  import Fa from "svelte-fa";
  // @ts-ignore
  import { faX, faO } from "@fortawesome/free-solid-svg-icons";
  export let mark;
  export let handleSquareClick;
  export let isActive;
  export let i;
</script>

<main>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-interactive-supports-focus -->
  <div
    class="square"
    class:active={isActive && mark === null}
    class:roundBorderUpLeft={i === 0}
    class:roundBorderUpRight={i === 2}
    class:roundBorderBottomLeft={i === 6}
    class:roundBorderBottomRight={i === 8}
    on:click={handleSquareClick}
    role="button"
  >
    {#if mark === "X"}
      <Fa icon={faX} />
    {:else if mark === "O"}
      <Fa icon={faO} />
    {/if}
  </div>
</main>

<style>
  .square {
    width: var(--square-size);
    height: var(--square-size);
    border: 2px solid rgba(255, 255, 255, 0.5);
    color: white;
    pointer-events: none;
    background-color: transparent;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2rem;
  }
  .active {
    opacity: 1;
    cursor: pointer;
    pointer-events: auto;
    border-color: lightskyblue;
    filter: drop-shadow(0 0 5px lightskyblue);
  }
  .roundBorderUpLeft {
    border-top-left-radius: var(--border-radius);
  }
  .roundBorderUpRight {
    border-top-right-radius: var(--border-radius);
  }
  .roundBorderBottomLeft {
    border-bottom-left-radius: var(--border-radius);
  }
  .roundBorderBottomRight {
    border-bottom-right-radius: var(--border-radius);
  }
</style>
