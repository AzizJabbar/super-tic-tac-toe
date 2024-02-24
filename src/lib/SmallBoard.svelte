<script>
  import Square from "./Square.svelte";
  import { turn, isNewGame } from "../store/store";
  import checkWin from "../utils/checkWin";
  import { onDestroy } from "svelte";

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
      {isWin}
    </div>
  {:else}
    <div class="smallBoard">
      {#each boardStatus as item, i}
        <Square {isActive} handleSquareClick={() => handleSquareClick(i)} mark={boardStatus[i]} />
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
    border: 1px solid #000;
  }
</style>
