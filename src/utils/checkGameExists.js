import { child, get, ref } from "firebase/database";
import { db } from "../firebase/firebase";

export default async function checkGameExists(gameId) {
  const dbRef = ref(db);
  try {
    const snapshot = await get(child(dbRef, `games/game${gameId}`));
    if (snapshot.exists()) {
      console.log("Game exists");
      return true;
    } else {
      console.log("Game does not exist");
      return false;
    }
  } catch (error) {
    console.error("Error checking if game exists", error);
    return false;
  }
}
