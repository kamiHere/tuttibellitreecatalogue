import {collection, doc, getDoc, getDocs} from "firebase/firestore";
import {db} from "./firebase.js";

const TREES_COLLECTION = "trees";

const normalizeTree = (tree) => ({
  id: tree.id,
  commonName: tree.commonName ?? "",
  scientificName: tree.scientificName ?? "",
  location: tree.location ?? "",
});

export const fetchTrees = async () => {
  try {
    const snapshot = await getDocs(collection(db, TREES_COLLECTION));
    return snapshot.docs
        .map((item) => normalizeTree({id: item.id, ...item.data()}))
        .sort((a, b) => a.id.localeCompare(b.id));
  } catch (error) {
    console.error("Firestore fetchTrees failed:", error);
    throw error;
  }
};

export const fetchTreeById = async (id) => {
  if (!id) return null;
  try {
    const snap = await getDoc(doc(db, TREES_COLLECTION, id));
    if (!snap.exists()) return null;
    return normalizeTree({ id: snap.id, ...snap.data() });
  } catch (error) {
    console.error("Firestore fetchTreeById failed:", error);
    throw error;
  }
};
