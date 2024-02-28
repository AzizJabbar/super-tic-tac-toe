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
  let filledSquares = 0;

  $: if ($isNewGame) {
    boardStatus = Array(9).fill(null);
    isWin = null;
    filledSquares = 0;
  }

  function handleSquareClick(i) {
    boardStatus[i] = $turn;
    filledSquares++;
    isWin = checkWin(boardStatus);
    if (!isWin && filledSquares === 9) {
      isWin = "Draw"; // It's a draw if all filled and no winner
    }

    if (isWin) {
      handleSmallBoardWin(isWin);
    }
    updateActiveBoard(i);
    if ($isNewGame) {
      isNewGame.set(false);
    }

    turn.set($turn === "X" ? "O" : "X");
  }
</script>

<main>
  {#if isWin}
    <div class="{isWin === 'O' ? 'winningSquare border-red' : ''} {isWin === 'X' ? 'winningSquare border-blue' : ''}">
      {#if isWin === "X"}
        <span class="x">
          <Fa icon={faX} />
        </span>
      {:else if isWin === "O"}
        <span class="o">
          <Fa icon={faO} />
        </span>
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
    border: var(--line-size) solid #fff;
    font-size: 6rem;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: var(--border-radius);
  }
  .border-red {
    border-color: var(--red);
  }
  .border-blue {
    border-color: var(--blue);
  }
</style>
