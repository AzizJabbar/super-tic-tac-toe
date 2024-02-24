import { writable } from "svelte/store";

const turn = writable("X");
const isGameEnd = writable(null);
const isNewGame = writable(true);
const bigBoardStatus = writable(Array(9).fill(null));

export { turn, bigBoardStatus, isGameEnd, isNewGame };
