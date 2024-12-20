import { writable } from "svelte/store";

const turn = writable("X");
const isGameEnd = writable(null);
const isNewGame = writable(false);
const isPlaying = writable(false);
const bigBoardStatus = writable(Array(9).fill(false));
const smallBoardStatus = writable(
  Array.from({ length: 9 }, () => Array(9).fill(false))
);
const intervalId = writable(null);
const currentPlayer = writable(null);
const playerNumber = writable(null);
const lastMove = writable(null);
const gameRef = writable(null);
const isReconnect = writable(false);
const opponentDisconnected = writable(false);

export {
  turn,
  bigBoardStatus,
  smallBoardStatus,
  isGameEnd,
  isNewGame,
  isPlaying,
  intervalId,
  currentPlayer,
  playerNumber,
  lastMove,
  gameRef,
  isReconnect,
  opponentDisconnected,
};
