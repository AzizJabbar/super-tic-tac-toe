<script>
  import BigBoard from "./lib/BigBoard.svelte";
  import {
    turn,
    isNewGame,
    isGameEnd,
    isPlaying,
    intervalId,
    gameRef,
    currentPlayer,
    playerNumber,
    lastMove,
    smallBoardStatus,
    isReconnect,
    opponentDisconnected,
  } from "./store/store";
  import Fa from "svelte-fa";
  import { faX, faO } from "@fortawesome/free-solid-svg-icons";
  import {
    ref,
    onValue,
    set,
    off,
    remove,
    onDisconnect,
  } from "firebase/database";
  import { db } from "./firebase/firebase";
  import writer from "./store/writer";
  import { onDestroy, onMount, tick } from "svelte";
  import checkGameExists from "./utils/checkGameExists";
  import Alert from "./lib/Alert.svelte";
  import Modal from "./lib/Modal.svelte";

  let selectMode = false;
  let selectHost = false;
  let enterId = false;
  let waiting = false;
  let gameId = null;
  let loadingGame = false;
  let storedValue = null;
  let showModal = false;

  async function handleStartGame() {
    if (enterId || storedValue) {
      loadingGame = true;
      const inputId = storedValue || document.getElementById("input-id").value;
      console.log(inputId);
      const { isExist, val } = await checkGameExists(inputId);
      loadingGame = false;
      if (isExist) {
        console.log(val);
        if (
          val.player1 !== "on" &&
          val.player2 !== "off" &&
          val.player1 !== "off"
        ) {
          alert("Game already started");
          return;
        }
        if (val.player1 === "off" || val.player2 === "off") {
          for (const [key, value] of Object.entries(val)) {
            writer.write(key, value);
          }
          if (val.player1 === "off") {
            $currentPlayer = val.player2 === "X" ? "O" : "X";
            playerNumber.set("player1");
          } else {
            $currentPlayer = val.player1 === "X" ? "O" : "X";
            playerNumber.set("player2");
          }
          gameRef.set(ref(db, `games/game${inputId}`));
          localStorage.setItem("gameRef", inputId);
          isReconnect.set(true);
          set($gameRef, {
            smallBoardStatus: $smallBoardStatus,
            turn: $turn,
            lastMove: $lastMove,
            player1:
              $playerNumber === "player1"
                ? $currentPlayer
                : $currentPlayer === "X"
                  ? "O"
                  : "X",
            player2:
              $playerNumber === "player2"
                ? $currentPlayer
                : $currentPlayer === "X"
                  ? "O"
                  : "X",
          });
          document.getElementById("menu").style.opacity = "0";
          isNewGame.set(true);
          isPlaying.set(true);
          enterId = false;
          waiting = false;
          selectMode = false;
          selectHost = false;
          setTimeout(() => {
            intervalId.set(null);
          }, 1000);
          return;
        }
        gameRef.set(ref(db, `games/game${inputId}`));
        currentPlayer.set(Math.random() > 0.5 ? "X" : "O");
        playerNumber.set("player2");
        set($gameRef, {
          player2: $currentPlayer,
          turn: "X",
        });
      } else {
        alert("Game not found");
        return;
      }
    }
    document.getElementById("menu").style.opacity = "0";
    isNewGame.set(true);
    isPlaying.set(true);
    enterId = false;
    waiting = false;
    selectMode = false;
    selectHost = false;
    setTimeout(() => {
      intervalId.set(null);
    }, 1000);
  }

  $: if ($gameRef) {
    if (!waiting) {
      onDisconnect($gameRef).set({
        smallBoardStatus: $smallBoardStatus,
        turn: $turn,
        lastMove: $lastMove,
        player1:
          $playerNumber === "player1"
            ? "off"
            : $currentPlayer === "X"
              ? "O"
              : "X",
        player2:
          $playerNumber === "player2"
            ? "off"
            : $currentPlayer === "X"
              ? "O"
              : "X",
      });
    }
  }

  onDestroy(() => {
    if (waiting || $opponentDisconnected) {
      localStorage.removeItem("gameRef");
      deleteGame();
    }
  });

  let waitingText = "Waiting for opponent";
  let waitingReconnectText = "Opponent disconnected, waiting for reconnection";
  let dotCount = 0;

  onMount(() => {
    const interval = setInterval(() => {
      dotCount = (dotCount % 3) + 1; // Cycle dotCount from 1 to 3
      waitingText = "Waiting for opponent" + ".".repeat(dotCount);
      waitingReconnectText =
        "Opponent disconnected, waiting for reconnection" +
        ".".repeat(dotCount);
    }, 500);

    // Cleanup interval when the component is destroyed
    return () => clearInterval(interval);
  });

  async function deleteGame() {
    try {
      await remove($gameRef);
    } catch (error) {
      console.error("Error deleting game:", error);
    }
  }

  function generateRandom4DigitString() {
    const randomNum = Math.floor(Math.random() * 10000); // Generates a number between 0 and 9999
    return randomNum.toString().padStart(4, "0"); // Pads with leading zeros if necessary
  }

  async function createRoom() {
    gameId = generateRandom4DigitString();
    let { isExist, val } = await checkGameExists(gameId);
    while (isExist) {
      gameId = generateRandom4DigitString();
      isExist = (await checkGameExists(gameId)).isExist;
    }
    localStorage.setItem("gameRef", gameId);
    gameRef.set(ref(db, `games/game${gameId}`));
    waiting = true;
    playerNumber.set("player1");
    set($gameRef, {
      player1: "on",
    });
    // handleStartGame();
  }
  $: if ($gameRef) {
    onValue($gameRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        console.log("listener hear data", data);
        if (data === "Opponent disconnected") {
          isGameEnd.set("Opponent disconnected");
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
          setTimeout(() => {
            isPlaying.set(false);
          }, 1000);
          deleteGame();
          gameRef.set(null);
          return;
        }
        if (data.player2 === "off") {
          opponentDisconnected.set(true);
        } else {
          opponentDisconnected.set(false);
        }
        if (data.player2 && waiting) {
          waiting = false;
          currentPlayer.set(data.player2 === "X" ? "O" : "X");
          set($gameRef, {
            player1: $currentPlayer,
          });
          handleStartGame();
        }
        for (const [key, value] of Object.entries(data)) {
          writer.write(key, value);
        }
      }
    });
  }

  function runDemo() {
    intervalId.set(
      setInterval(() => {
        let activeSquare = document.querySelectorAll(".active");
        if ($isPlaying || !activeSquare.length) return;
        let randomSquare =
          activeSquare[Math.floor(Math.random() * activeSquare.length)];
        // @ts-ignore
        randomSquare.click();
      }, 1500)
    );
  }

  $: if (!$isPlaying && !$isGameEnd) {
    runDemo();
  }

  $: if (!$isPlaying && $isGameEnd) {
    document.getElementById("menu").style.opacity = "1";
    document.getElementById("menu").style.pointerEvents = "auto";
    document.getElementById("turn").style.opacity = "0";
    currentPlayer.set(null);
    playerNumber.set(null);
    turn.set("X");
    lastMove.set(null);
    isReconnect.set(false);
    opponentDisconnected.set(false);
    localStorage.removeItem("gameRef");
    if ($gameRef) {
      off($gameRef);
      deleteGame();
      gameRef.set(null);
    }
  }

  $: if ($isPlaying) {
    document.getElementById("menu").style.pointerEvents = "auto";
    document.getElementById("turn").style.opacity = "1";
    document.getElementById("menu").style.pointerEvents = "none";
    clearInterval($intervalId);
  }
  $: if ($isGameEnd) {
    document.getElementById("turn").style.opacity = "0";
    if ($intervalId) {
      clearInterval($intervalId);
      isGameEnd.set(null);
    }
  }
</script>

<main>
  <Alert
    message="You have an ongoing game on this browser. Do you want to continue?"
    show={!!localStorage.getItem("gameRef")}
    on:confirm={(e) => {
      if (e.detail.choice === "yes") {
        storedValue = localStorage.getItem("gameRef");
        handleStartGame();
      } else {
        localStorage.removeItem("gameRef");
      }
    }}
  />
  <div class="turn" id="turn">
    Turn:
    {#if $turn === "X"}
      <Fa icon={faX} />
    {:else if $turn === "O"}
      <Fa icon={faO} />
    {/if}
    {#if $currentPlayer}
      {#if $isPlaying && $currentPlayer !== $turn}
        <div class="waiting-text">
          {$opponentDisconnected ? waitingReconnectText : waitingText}
        </div>
      {:else if $isPlaying}
        <div class="waiting-text">Your turn!</div>
      {/if}
    {/if}
  </div>
  <div class="game-container">
    <BigBoard />
    <div class="menu" id="menu">
      {#if $isGameEnd && !$intervalId}
        {#if $isGameEnd === "Draw"}
          <div class="title">Game is draw</div>
        {:else if $isGameEnd === "Opponent disconnected"}
          <div class="title">Opponent disconnected</div>
        {:else}
          <div class="title">
            {$isGameEnd} is the winner
          </div>
        {/if}
      {/if}
      {#if waiting}
        <div>{waitingText}</div>
        {#if gameId}
          <div class="title">
            Game ID: {gameId}
          </div>
          <div
            on:click={() => {
              off($gameRef);
              waiting = false;
              deleteGame();
              gameRef.set(null);
            }}
            on:keydown={(e) =>
              e.key === "Escape" &&
              (() => {
                off($gameRef);
                waiting = false;
                deleteGame();
                gameRef.set(null);
              })}
            class="other-button"
            role="button"
            tabindex="0"
          >
            Cancel
          </div>
        {/if}
      {:else if selectMode && !selectHost}
        <div
          on:click={handleStartGame}
          on:keydown={(e) => e.key === "Enter" && handleStartGame()}
          class="start-button"
          role="button"
          tabindex="0"
        >
          Offline
        </div>
        <div
          on:click={() => (selectHost = true)}
          on:keydown={(e) => e.key === "Enter" && (selectHost = true)}
          class="start-button"
          role="button"
          tabindex="0"
        >
          Online
        </div>
        <div
          on:click={() => (selectMode = false)}
          on:keydown={(e) => e.key === "Enter" && (selectMode = false)}
          class="other-button"
          role="button"
          tabindex="0"
        >
          Back
        </div>
      {:else if selectHost && !enterId}
        <div
          on:click={() => (enterId = true)}
          on:keydown={(e) => e.key === "Enter" && (enterId = true)}
          class="start-button"
          role="button"
          tabindex="0"
        >
          Join a game
        </div>
        <div
          on:click={createRoom}
          on:keydown={(e) => e.key === "Enter" && createRoom()}
          class="start-button"
          role="button"
          tabindex="0"
          style={loadingGame ? "pointer-events: none;" : ""}
        >
          {loadingGame ? "Loading..." : "Host a new game"}
        </div>
        <div
          on:click={() => (selectHost = false)}
          on:keydown={(e) => e.key === "Escape" && (selectHost = false)}
          class="other-button"
          role="button"
          tabindex="0"
        >
          Back
        </div>
      {:else if enterId}
        <input
          id="input-id"
          class="styled-input"
          type="text"
          placeholder="Enter game ID"
        />
        <div
          on:click={handleStartGame}
          on:keydown={(e) => e.key === "Enter" && handleStartGame()}
          class="start-button"
          style={loadingGame ? "pointer-events: none;" : ""}
          role="button"
          tabindex="0"
        >
          {loadingGame ? "Loading..." : "Join"}
        </div>
        <div
          on:click={() => (enterId = false)}
          on:keydown={(e) => e.key === "Escape" && (enterId = false)}
          class="other-button"
          role="button"
          tabindex="0"
        >
          Back
        </div>
      {:else if !$isGameEnd}
        <div class="title">Super Tic Tac Toe</div>
        <div
          on:click={() => (selectMode = true)}
          on:keydown={(e) => e.key === "Enter" && (selectMode = true)}
          class="start-button"
          role="button"
          tabindex="0"
        >
          Play
        </div>
        <div
          class="other-button"
          on:click={() => (showModal = true)}
          type="button"
        >
          How to play
        </div>
      {:else}
        <div
          on:click={() => isGameEnd.set(false)}
          on:keydown={(e) => e.key === "Escape" && isGameEnd.set(false)}
          class="other-button"
          role="button"
          tabindex="0"
        >
          Back to Home
        </div>
      {/if}
    </div>
  </div>
  <Modal
    bind:show={showModal}
    title="How to play"
    on:close={() => (showModal = false)}
  >
    <p>This is a custom message inside the modal!</p>
  </Modal>
</main>

<style>
  .game-container {
    /* display: flex;
    justify-content: center;
    align-items: center;
    gap: 120px; */
    position: relative;
    height: 100vh;
    margin: 0;
    width: 100%;
  }
  .start-button {
    background-color: var(--orange);
    /* text-shadow: 2px 1px 4px var(--light-black); */
    color: var(--light-gray);
    cursor: pointer;
    font-weight: 800;
    font-size: 2rem;
    padding: 0.75rem;

    border-radius: 12px;
    text-align: center;
    width: 100%;
    min-width: 460px;
  }
  .styled-input {
    border: none; /* Removes all borders */
    border-bottom: 2px solid var(--orange); /* Adds a bottom border */
    background-color: transparent; /* Makes background transparent */
    font-size: 2rem; /* Sets font size */
    padding: 5px; /* Adds some padding (optional) */
    outline: none; /* Removes the outline on focus */
    width: 100%; /* Optional: set desired width */
    color: var(--light-gray);
    text-align: center;
    /* letter-spacing: 1.5px; */
    font-weight: bold;
    font-family: "Montserrat", sans-serif;
  }
  .menu {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    transition: opacity 0.5s ease-in-out;
    position: absolute;
    top: 50%;
    left: 70%;
    width: max-content;
    transform: translate(-50%, -50%);
    opacity: 1;
  }

  @media (max-width: 1570px) {
    .menu {
      left: 73%;
    }
  }
  @media (max-width: 1330px) {
    .menu {
      left: 74%;
    }
  }
  @media (max-width: 1100px) {
    .menu {
      left: 75%;
    }
    .title {
      font-size: 2rem;
    }
    .start-button {
      font-size: 1.5rem;
      padding: 0.5rem;
    }
  }
  /* @media (max-width: 940px) {
    .menu {
      left: 90%;
    }
  } */

  .other-button {
    background-color: rgba(0, 0, 0, 0.2);
    width: 100%;
    color: var(--light-gray);
    cursor: pointer;
    font-weight: 700;
    font-size: 2rem;
    padding: 0.75rem;
    text-align: center;
    border-radius: 12px;
  }

  .title {
    font-size: 3rem;
    font-weight: 700;
    color: var(--light-gray);
  }
  .turn {
    font-size: 2rem;
    color: var(--light-gray);
    position: absolute;
    left: 50%;
    top: 20px;
    transform: translateX(-50%);
    font-weight: 700;
    letter-spacing: 0.5px;
    transition: opacity 0.5s ease-in-out;
    opacity: 0;
    text-align: center;
  }

  .waiting-text {
    font-size: 1rem;
    color: var(--light-gray);
    font-weight: 500;
    letter-spacing: 0.5px;
    width: 100%;
  }

  @media (max-width: 1200px) {
    .title {
      font-size: 2.5rem;
    }
    .start-button {
      font-size: 1.75rem;
      padding: 0.5rem;
    }
    .menu {
      left: 76%;
    }
  }

  @media (max-width: 948px) {
    .turn {
      font-size: 1.5rem;
    }
    .styled-input {
      font-size: 1.5rem;
    }
    .waiting-text {
      font-size: 0.7rem;
    }
    .menu {
      left: 50%;
      top: 73%;
      gap: 10px;
      width: 90%;
    }
    .title {
      font-size: 1.5rem;
    }
    .start-button {
      font-size: 1.5rem;
      padding: 0.5rem;
      min-width: 0;
    }
    .other-button {
      font-size: 1.5rem;
      padding: 0.5rem;
      min-width: 0;
      width: 100%;
    }
  }
</style>
