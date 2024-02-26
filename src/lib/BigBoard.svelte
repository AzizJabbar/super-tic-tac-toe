<script>
  import SmallBoard from "./SmallBoard.svelte";
  import { bigBoardStatus, isGameEnd, isNewGame, isPlaying } from "../store/store";
  import checkWin from "../utils/checkWin";
  import { slide } from "svelte/transition";
  import { flip } from "svelte/animate";

  let isActive = Array(9).fill(true);

  function handleSmallBoardWin(i, winner) {
    let newStatus = $bigBoardStatus.slice();
    newStatus[i] = winner;
    bigBoardStatus.set(newStatus);
    isGameEnd.set(checkWin($bigBoardStatus));
    if ($isGameEnd) {
      const element = document.getElementById("bigBoard");

      element.style.left = "30%";
      isActive = Array(9).fill(false);
      setTimeout(() => {
        isPlaying.set(false);
      }, 1000);
    }
  }

  $: if ($isNewGame) {
    bigBoardStatus.set(Array(9).fill(null));
    setTimeout(() => {
      isGameEnd.set(null);
    }, 500);
    isActive = Array(9).fill(true);
  }

  $: if ($isPlaying) {
    const element = document.getElementById("bigBoard");
    element.style.left = "50%";
    isActive = Array(9).fill(true);
  }

  function updateActiveBoard(i) {
    // if ($bigBoardStatus[i]) {
    //   isActive = $bigBoardStatus.map((e) => e === null);
    // } else {
    //   isActive = Array(9).fill(false);
    //   isActive[i] = true;
    // }
  }
</script>

<main>
  <div class="bigBoard" id="bigBoard">
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
    gap: 40px;
    width: fit-content;
    top: 50%;
    left: 30%;
    transform: translate(-50%, -50%);
    will-change: left;
    transition: left 1s ease-in-out;
    position: absolute;
    z-index: 10;
  }
</style>
