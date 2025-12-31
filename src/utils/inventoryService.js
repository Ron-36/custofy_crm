import {
  doc,
  getDoc,
  setDoc,
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../utils/firebaseConfig";

export async function updateInventoryServices({
  ownerId,
  itemId,
  itemName,
  unit,
  change,
  reason,
  referenceId = null,
}) {
  const inventoryId = `${ownerId}_${itemId}`;
  const inventoryRef = doc(db, "inventory", inventoryId);

  const snap = await getDoc(inventoryRef);
  const currentStock = snap.exists() ? snap.data().stock : 0;
  const newStock = currentStock + change;

  // ❌ Optional safety (can enable later)
  // if (newStock < 0) {
  //   throw new Error("Insufficient stock");
  // }

  // Update inventory
  await setDoc(
    inventoryRef,
    {
      ownerId,
      itemId,
      itemName,
      unit,
      stock: newStock,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

  // Add inventory log
  await addDoc(collection(db, "inventory_logs"), {
    ownerId,
    itemId,
    itemName,
    change,
    reason,
    referenceId,
    createdAt: serverTimestamp(),
  });
}
