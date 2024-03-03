import { writable } from "svelte/store";

const turn = writable("X");
const isGameEnd = writable(null);
const isNewGame = writable(false);
const isPlaying = writable(false);
const bigBoardStatus = writable(Array(9).fill(null));
const intervalId = writable(null);

export { turn, bigBoardStatus, isGameEnd, isNewGame, isPlaying, intervalId };
