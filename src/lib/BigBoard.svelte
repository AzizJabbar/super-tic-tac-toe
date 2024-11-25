<script>
  import SmallBoard from "./SmallBoard.svelte";
  import {
    bigBoardStatus,
    isGameEnd,
    isNewGame,
    isPlaying,
    lastMove,
    currentPlayer,
    turn,
    isReconnect,
  } from "../store/store";
  import checkWin from "../utils/checkWin";

  let isActive = Array(9).fill(true);

  function handleSmallBoardWin(i, winner) {
    let newStatus = $bigBoardStatus.slice();
    newStatus[i] = winner;
    bigBoardStatus.set(newStatus);
    isGameEnd.set(checkWin($bigBoardStatus));
    console.log('we got the winner', $isGameEnd);
    if ($isGameEnd) {
      const element = document.getElementById("bigBoard");

      if (window.innerWidth > 1210) {
        element.style.left = "30%";
      } else if (window.innerWidth > 1110) {
        element.style.left = "25%";
      } else if (window.innerWidth > 948) {
        element.style.left = "23%";
      } else {
        element.style.top = "33%";
      }
      isActive = Array(9).fill(false);
      setTimeout(() => {
        isPlaying.set(false);
      }, 1000);
    }
    if (winner === "Draw") {
      let newStatus = $bigBoardStatus.slice();
      newStatus[i] = winner;
      bigBoardStatus.set(newStatus);
      checkDraw(); // Check the overall game for draw
    }
  }

  $: if ($isNewGame) {
    if(!$isReconnect){
      bigBoardStatus.set(Array(9).fill(false));
      isActive = Array(9).fill(true);
    }
    setTimeout(() => {
      isGameEnd.set(null);
    }, 500);
  }

  $: if ($isPlaying) {
    const element = document.getElementById("bigBoard");
    if (window.innerWidth > 948) {
      element.style.left = "50%";
    }
    if(!$isReconnect){
      isActive = Array(9).fill(true);
    }
  }

  $: if ($isGameEnd) {
    isActive = Array(9).fill(false);
  }

  function checkDraw() {
    if (
      $bigBoardStatus.every((status) => status !== false) &&
      !checkWin($bigBoardStatus)
    ) {
      isGameEnd.set("Draw"); // Overall draw
      isPlaying.set(false);
    }
  }

  function updateActiveBoard(i) {
    console.log("iiiiii", i)
    if(i === "all"){
      isActive = Array(9).fill(true);
      return;
    }
    if ($bigBoardStatus[i]) {
      isActive = $bigBoardStatus.map((e) => e === false);
    } else {
      isActive = Array(9).fill(false);
      isActive[i] = true;
    }
  }
</script>

<main>
  <div class="bigBoard" id="bigBoard">
    {#each $bigBoardStatus as item, i}
      <SmallBoard
        updateActiveBoard={(i) => updateActiveBoard(i)}
        handleSmallBoardWin={(winner) => handleSmallBoardWin(i, winner)}
        isActive={isActive[i]}
        index={i}
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
  @media (max-width: 1210px) {
    .bigBoard {
      left: 25%;
    }
  }
  @media (max-width: 1110px) {
    .bigBoard {
      left: 23%;
    }
  }
  @media (max-width: 948px) {
    .bigBoard {
      top: 33%;
      left: 50%;
    }
  }
</style>
