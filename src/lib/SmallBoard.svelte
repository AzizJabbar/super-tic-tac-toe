<script>
  import Square from "./Square.svelte";
  import {
    turn,
    isNewGame,
    gameRef,
    smallBoardStatus,
    lastMove,
    intervalId,
    playerNumber,
    isReconnect,
    opponentDisconnected,
    currentPlayer,
  } from "../store/store";
  import checkWin from "../utils/checkWin";
  import Fa from "svelte-fa";
  // @ts-ignore
  import { faX, faO } from "@fortawesome/free-solid-svg-icons";
  import { onValue, set, update } from "firebase/database";

  export let handleSmallBoardWin;
  export let updateActiveBoard;
  export let isActive;
  export let index;
  // let boardStatus = Array(9).fill(null);
  let isWin = null;
  let filledSquares = 0;

  $: if ($isNewGame) {
    if(!$isReconnect){
      smallBoardStatus.set(Array.from({ length: 9 }, () => Array(9).fill(false)));
    }
    if(!$lastMove){
      updateActiveBoard("all");
    }
    isWin = null;
    filledSquares = 0;
  }

  $: if ($lastMove) {
    updateActiveBoard($lastMove[1]);
  }

  $: if ($gameRef) {
    onValue($gameRef, (snapshot) => {
      const data = snapshot.val();
      if (data?.lastMove?.[0] === index) {
        filledSquares++;
        isWin = checkWin($smallBoardStatus[index]);
        if (
          !isWin &&
          $smallBoardStatus[index].every((item) => item !== false)
        ) {
          isWin = "Draw"; // It's a draw if all filled and no winner
        }

        if (isWin) {
          handleSmallBoardWin(isWin);
        }
        updateActiveBoard(data?.lastMove?.[1]);
        if ($isNewGame) {
          isNewGame.set(false);
        }
      }
    });
  }
  function handleSquareClick(i) {
    smallBoardStatus.update((value) => {
      value[index][i] = $turn;
      return value;
    });
    filledSquares++;
    isWin = checkWin($smallBoardStatus[index]);

    if (!isWin && $smallBoardStatus[index].every((item) => item !== false)) {
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
    if ($gameRef && !$intervalId) {
      set($gameRef, {
        smallBoardStatus: $smallBoardStatus,
        turn: $turn,
        lastMove: [index, i],
        player1: $playerNumber === "player1" ? $currentPlayer : $opponentDisconnected ? "off": $currentPlayer === "X" ? "O" : "X",
        player2: $playerNumber === "player2" ? $currentPlayer : $opponentDisconnected ? "off": $currentPlayer === "X" ? "O" : "X",
      });
    }
  }
</script>

<main>
  {#if isWin === "X" || isWin == "O"}
    <div
      class="{isWin === 'O' ? 'winningSquare border-red' : ''} {isWin === 'X'
        ? 'winningSquare border-blue'
        : ''}"
    >
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
      {#each $smallBoardStatus[index] as item, i}
        <Square
          {i}
          {index}
          {isActive}
          handleSquareClick={() => handleSquareClick(i)}
          mark={$smallBoardStatus[index][i]}
        />
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
    width: calc(var(--square-size) * 3);
    height: calc(var(--square-size) * 3);
    border: var(--line-size) solid #fff;
    font-size: 6rem;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: var(--border-radius);
  }

  @media (max-width: 768px) {
    .winningSquare {
      font-size: 4.5em;
    }
  }
  .border-red {
    border-color: var(--red);
  }
  .border-blue {
    border-color: var(--blue);
  }
</style>
