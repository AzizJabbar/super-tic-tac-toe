<script>
  import BigBoard from "./lib/BigBoard.svelte";
  import { turn, isNewGame, isGameEnd, isPlaying, intervalId, gameRef, currentPlayer } from "./store/store";
  import Fa from "svelte-fa";
  import { faX, faO } from "@fortawesome/free-solid-svg-icons";
  import { ref, onValue, set } from "firebase/database";
  import { db } from "./firebase/firebase";
  import writer from "./store/writer";

  let selectMode = false;
  let selectHost = false;
  let enterId = false;
  let waiting = false;
  let gameId = null;

  function handleStartGame() {
    if(enterId){
       gameRef.set(ref(db, `games/game${(document.getElementById("input-id")).value}`));
       currentPlayer.set(Math.random() > 0.5 ? "X" : "O");
       set($gameRef, {
        player2: $currentPlayer,
        turn: "X",
      });
    }
    document.getElementById("menu").style.opacity = "0";
    isNewGame.set(true);
    isPlaying.set(true);
    enterId = false;
    waiting = false;
    setTimeout(() => {
      intervalId.set(null);
    }, 1000);
  }

  function createRoom() {
    gameId = "0001"; // Could be generated dynamically for each game
    gameRef.set(ref(db, `games/game${gameId}`));
    console.log(gameRef);
    waiting = true;
    // handleStartGame();
  }
  $: if($gameRef){
    onValue($gameRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      console.log(data);
      if(data.player2 && waiting){
        waiting = false;
        currentPlayer.set(data.player2 === "X" ? "O" : "X");
        handleStartGame();
      }
      for (const [key, value] of Object.entries(data)) {
        writer.write(key, value);
      }
    }
  });

  }

  function runDemo() {
    console.log("demo running")
    intervalId.set(
      setInterval(() => {
        let activeSquare = document.querySelectorAll(".active");
        if ($isPlaying || !activeSquare.length) return;
        let randomSquare = activeSquare[Math.floor(Math.random() * activeSquare.length)];
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
  }

  $: if ($isPlaying) {
    document.getElementById("menu").style.pointerEvents = "auto";
    document.getElementById("turn").style.opacity = "1";
    document.getElementById("menu").style.pointerEvents = "none";
    clearInterval($intervalId);
  }
  $: if ($isGameEnd) {
    document.getElementById("turn").style.opacity = "0";
  }
</script>

<main>
  <div class="turn" id="turn">
    Turn:
    {#if $turn === "X"}
      <Fa icon={faX} />
    {:else if $turn === "O"}
      <Fa icon={faO} />
    {/if}
  </div>
  <div class="game-container">
    <BigBoard />
    <div class="menu" id="menu">
      {#if waiting}
        <div>
          Waiting for opponent
        </div>
        {#if gameId}
        <div>
          Game ID: {gameId}
        </div>
        {/if}
      {:else}
      {#if selectMode && !selectHost}
        <div on:click={handleStartGame} on:keydown={handleStartGame} class="start-button" role="button" tabindex="0">
          Offline
        </div>
        <div on:click={() => selectHost = true} on:keydown={() => selectHost = true} class="start-button" role="button" tabindex="0">
          Online
        </div>
      {:else if selectHost && !enterId}
         <div on:click={() => enterId = true} on:keydown={() => enterId = true} class="start-button" role="button" tabindex="0">
          Join a game
        </div>
        <div on:click={createRoom} on:keydown={() => selectHost = true} class="start-button" role="button" tabindex="0">
          Host a new game
        </div>
      {:else if enterId}
        <input id="input-id" type="text" placeholder="Enter game ID" />
        <div on:click={handleStartGame} on:keydown={handleStartGame} class="start-button" role="button" tabindex="0">
          Join
        </div>
      {:else}
      <div class="title">
        {#if $isGameEnd && !$intervalId}
          {#if $isGameEnd === "Draw"}
            Game is draw
          {:else}
            {$isGameEnd} is the winner
          {/if}
        {:else}
          Super Tic Tac Toe
        {/if}
      </div>
      <div on:click={() => selectMode = true} on:keydown={() => selectMode = true} class="start-button" role="button" tabindex="0">
          Play
      </div>
      {/if}
      {/if}
      <!-- <div class="other-button">How to play</div> -->
    </div>
  </div>
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

  @media (max-width: 1100px) {
    .menu {
      left: 75%;
    }
  }
  @media (max-width: 940px) {
    .menu {
      left: 90%;
    }
  }

  .other-button {
    background-color: rgba(0, 0, 0, 0.3);
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
  }

  @media (max-width: 1200px) {
    .title {
      font-size: 2.5rem;
    }
    .start-button {
      font-size: 1.75rem;
      padding: 0.5rem;
    }
  }

  @media (max-width: 768px) {
    .menu {
      left: 50%;
      top: 70%;
    }
    .title {
      font-size: 2rem;
    }
    .start-button {
      font-size: 1.5rem;
      padding: 0.5rem;
    }
  }
</style>
