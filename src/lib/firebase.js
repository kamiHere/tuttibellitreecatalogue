import { initializeApp, getApps } from "firebase/app";
import { getFirestore, initializeFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAAhhPPObZ6lcjNESsS_STPfjxctQkzc0s",
  authDomain: "tb-tree-catalogue.firebaseapp.com",
  projectId: "tb-tree-catalogue",
  storageBucket: "tb-tree-catalogue.firebasestorage.app",
  messagingSenderId: "1043377655309",
  appId: "1:1043377655309:web:dfd1da21a5a8059025cf44",
  measurementId: "G-6X618XK6B5",
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

let db;
try {
  // Improves reliability in restrictive networks by forcing long polling.
  db = initializeFirestore(app, {
    experimentalForceLongPolling: true,
    useFetchStreams: false,
  });
} catch (error) {
  db = getFirestore(app);
}

export { db };
