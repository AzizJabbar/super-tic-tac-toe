import { child, get, ref } from "firebase/database";
import { db } from "../firebase/firebase";

export default async function checkGameExists(gameId) {
  const dbRef = ref(db);
  try {
    const snapshot = await get(child(dbRef, `games/game${gameId}`));
    if (snapshot.exists()) {
      console.log("Game exists");
      return {isExist: true, val: snapshot.val()};
    } else {
      console.log("Game does not exist");
      return {isExist: false, val: null};
    }
  } catch (error) {
    console.error("Error checking if game exists", error);
    return { isExist: false, val: null };
  }
}
