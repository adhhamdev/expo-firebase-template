import {
  getFirestore,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  onSnapshot,
  type FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";

export function db() {
  return getFirestore();
}

export {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  onSnapshot,
};

export type DocumentData = FirebaseFirestoreTypes.DocumentData;
export type QuerySnapshot = FirebaseFirestoreTypes.QuerySnapshot;
export type DocumentSnapshot = FirebaseFirestoreTypes.DocumentSnapshot;
