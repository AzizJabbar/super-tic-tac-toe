<script>
  import Fa from "svelte-fa";
  import { faX, faO } from "@fortawesome/free-solid-svg-icons";
  import { currentPlayer, turn } from "../store/store";
  import { intervalId } from "../store/store";
  export let mark;

  export let handleSquareClick;
  export let isActive;
  export let i;

  let isMouseOver = false;
  let childComponent;

  function handleMouseEnter() {
    isMouseOver = true;
    childComponent = { icon: $turn === "X" ? faX : faO }; // Set the icon for the child component
  }

  function handleMouseLeave() {
    isMouseOver = false;
    childComponent = null; // Remove the child component
  }
</script>

<main>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-interactive-supports-focus -->
  <div
    class="square"
    id={`square${i}`}
    on:mouseenter={handleMouseEnter}
    on:mouseleave={handleMouseLeave}
    class:active={isActive &&
      mark === false &&
      (!$currentPlayer || $currentPlayer === $turn)}
    style={`pointer-events: ${!$intervalId && isActive && mark === false ? "auto" : "none"};`}
    class:noBorderUp={i === 0 || i === 1 || i === 2}
    class:noBorderRight={i === 2 || i === 5 || i === 8}
    class:noBorderLeft={i === 6 || i === 3 || i === 0}
    class:noBorderBottom={i === 6 || i === 7 || i === 8}
    on:click={() => {
      handleMouseLeave();
      handleSquareClick();
    }}
    role="button"
  >
    {#if isMouseOver && childComponent}
      <span class={$turn === "X" ? "x" : "o"}>
        <Fa icon={childComponent.icon} />
      </span>
    {/if}
    {#if mark === "X"}
      <span class="x">
        <Fa icon={faX} />
      </span>
    {:else if mark === "O"}
      <span class="o">
        <Fa icon={faO} />
      </span>
    {/if}
  </div>
</main>

<style>
  .square {
    width: var(--square-size);
    height: var(--square-size);
    border: calc(0.6 * (var(--line-size))) solid rgba(255, 255, 255, 0.7);
    color: white;
    pointer-events: none;
    background-color: transparent;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2rem;
    box-sizing: border-box;
    transition: all 0.1s linear;
  }

  .active {
    opacity: 1;
    cursor: pointer;
    border-width: calc(1 * (var(--line-size)));
    border-color: lightskyblue;
    filter: drop-shadow(0px 0 4px lightskyblue);
  }
  .noBorderUp {
    border-top: 0;
  }
  .noBorderRight {
    border-right: 0;
  }
  .noBorderLeft {
    border-left: 0;
  }
  .noBorderBottom {
    border-bottom: 0;
  }
  @media (max-width: 768px) {
    .square {
      font-size: 1.3rem;
    }
    .active {
      border-width: calc(0.8 * (var(--line-size)));
    }
  }
</style>
