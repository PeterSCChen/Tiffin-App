import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

import {
  onAuthStateChanged,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
    apiKey: "AIzaSyB_scGVycYz7fioaLWkCc7BYWiULIbc8CI",
    authDomain: "tiffin-wala-dev.firebaseapp.com",
    projectId: "tiffin-wala-dev",
    storageBucket: "tiffin-wala-dev.appspot.com",
    messagingSenderId: "201822516681",
    appId: "1:201822516681:web:6ad59a8cab92bec7902418",
    measurementId: "G-8MRRD2CPX7"
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const firestore = getFirestore(app);
const storage = getStorage(app);
const functions = getFunctions(app);

export {
  auth,
  onAuthStateChanged,
  firestore,
  storage as firebaseStorage,
  functions,
};