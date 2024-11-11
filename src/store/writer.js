import {
  turn,
  bigBoardStatus,
  smallBoardStatus,
  isGameEnd,
  isNewGame,
  isPlaying,
  intervalId,
  gameRef,
} from "./store.js";

const writer = () => {
  const storeMap = {
    turn,
    bigBoardStatus,
    smallBoardStatus,
    isGameEnd,
    isNewGame,
    isPlaying,
    intervalId,
    gameRef,
  };

  return {
    write: (key, value) => {
      if (storeMap[key]) {
        storeMap[key].set(value);
      } else {
        console.warn(`Key "${key}" does not exist in storeMap`);
      }
    },
  };
};

export default writer();
