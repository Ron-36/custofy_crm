import {
  doc,
  setDoc,
  addDoc,
  serverTimestamp,
  collection,
  increment,
} from "firebase/firestore";
import { db } from "../utils/firebaseConfig";

export async function updateInventory({
  ownerId,
  itemId,
  itemName,
  unit,
  change,
  reason,
  refId = null,
}) {
  if (!ownerId || !itemId) {
    throw new Error("Missing ownerId or itemId");
  }

  const inventoryRef = doc(db, "inventory", `${ownerId}_${itemId}`);

  // ✅ NO READ — ONLY WRITE
  await setDoc(
    inventoryRef,
    {
      ownerId,
      itemId,
      itemName,
      unit,
      quantity: increment(change), // 🔥 ATOMIC
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

  // Inventory log
  await addDoc(collection(db, "inventory_logs"), {
    ownerId,
    itemId,
    itemName,
    change,
    reason,
    refId,
    createdAt: serverTimestamp(),
  });
}
