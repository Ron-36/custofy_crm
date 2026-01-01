import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

export async function checkAvailableStock(ownerId, itemId) {
  const ref = doc(db, "inventory", `${ownerId}_${itemId}`);
  const snap = await getDoc(ref);

  return snap.exists() ? snap.data().quantity : 0;
}
