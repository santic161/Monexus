// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, initializeAuth, getReactNativePersistence, GoogleAuthProvider } from "firebase/auth"
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    "apiKey": process.env.EXPO_PUBLIC_apiKey,
    "authDomain": process.env.EXPO_PUBLIC_authDomain,
    "projectId": process.env.EXPO_PUBLIC_projectId,
    "storageBucket": process.env.EXPO_PUBLIC_storageBucket,
    "messagingSenderId": process.env.EXPO_PUBLIC_messagingSenderId,
    "appId": process.env.EXPO_PUBLIC_appId,
    "measurementId": process.env.EXPO_PUBLIC_measurementId
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);



const googleProvider = new GoogleAuthProvider();
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
const db = getFirestore(app);

export { auth, db, googleProvider };