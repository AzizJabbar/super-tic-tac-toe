<script>
  import Square from "./Square.svelte";
  import { turn, isNewGame } from "../store/store";
  import checkWin from "../utils/checkWin";
  import Fa from "svelte-fa";
  // @ts-ignore
  import { faX, faO } from "@fortawesome/free-solid-svg-icons";

  export let handleSmallBoardWin;
  export let updateActiveBoard;
  export let isActive;
  let boardStatus = Array(9).fill(null);
  let isWin = null;

  $: if ($isNewGame) {
    boardStatus = Array(9).fill(null);
    isWin = null;
  }

  function handleSquareClick(i) {
    boardStatus[i] = $turn;
    isWin = checkWin(boardStatus);
    updateActiveBoard(i);
    if (isWin) {
      handleSmallBoardWin(isWin);
    }
    if ($isNewGame) {
      isNewGame.set(false);
    }

    turn.set($turn === "X" ? "O" : "X");
  }
</script>

<main>
  {#if isWin}
    <div class="winningSquare">
      {#if isWin === "X"}
        <Fa icon={faX} />
      {:else if isWin === "O"}
        <Fa icon={faO} />
      {/if}
    </div>
  {:else}
    <div class="smallBoard">
      {#each boardStatus as item, i}
        <Square {i} {isActive} handleSquareClick={() => handleSquareClick(i)} mark={boardStatus[i]} />
      {/each}
    </div>
  {/if}
</main>

<style>
  .smallBoard {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, 1fr);
    width: fit-content;
  }
  .winningSquare {
    width: 100%;
    height: 100%;
    border: 2px solid #fff;
    font-size: 6rem;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: var(--border-radius);
  }
</style>
