<script>
  import SmallBoard from "./SmallBoard.svelte";
  import { bigBoardStatus, isGameEnd, isNewGame } from "../store/store";
  import checkWin from "../utils/checkWin";

  let isActive = Array(9).fill(true);

  function handleSmallBoardWin(i, winner) {
    let newStatus = $bigBoardStatus.slice();
    newStatus[i] = winner;
    bigBoardStatus.set(newStatus);
    isGameEnd.set(checkWin($bigBoardStatus));
    if ($isGameEnd) {
      isActive = Array(9).fill(false);
    }
  }

  function handleReset() {
    bigBoardStatus.set(Array(9).fill(null));
    isGameEnd.set(null);
    isActive = Array(9).fill(true);
    isNewGame.set(true);
  }

  function updateActiveBoard(i) {
    if ($bigBoardStatus[i]) {
      isActive = $bigBoardStatus.map((e) => e === null);
    } else {
      isActive = Array(9).fill(false);
      isActive[i] = true;
    }
  }
</script>

<main>
  {#if $isGameEnd}
    {$isGameEnd} is the winner
    <button on:click={handleReset}>reset</button>
  {/if}
  <div class="bigBoard">
    {#each $bigBoardStatus as item, i}
      <SmallBoard
        updateActiveBoard={(i) => updateActiveBoard(i)}
        handleSmallBoardWin={(winner) => handleSmallBoardWin(i, winner)}
        isActive={isActive[i]}
      />
    {/each}
  </div>
</main>

<style>
  .bigBoard {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, 1fr);
    gap: 10px;
    width: fit-content;
  }
</style>
