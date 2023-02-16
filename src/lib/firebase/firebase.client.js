// Import the functions you need from the SDKs you need
import { getApps, getApp, initializeApp, deleteApp } from "firebase/app";
import { SECRET_APIKEY, SECRET_APPID, SECRET_AUTHDOMAIN, SECRET_MESSAGINGSENDERID, SECRET_PROJECTID, SECRET_STORAGEBUCKET } from '$env/static/private';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, setPersistence, inMemoryPersistence } from 'firebase/auth'

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: SECRET_APIKEY,
    authDomain: SECRET_AUTHDOMAIN,
    projectId: SECRET_PROJECTID,
    storageBucket: SECRET_STORAGEBUCKET,
    messagingSenderId: SECRET_MESSAGINGSENDERID,
    appId: SECRET_APPID
};


// Initialize Firebase
let firebaseApp;
if (!getApps().length) {
    firebaseApp = initializeApp(firebaseConfig)
} else {
    firebaseApp = getApp()
    deleteApp(firebaseApp)
    firebaseApp = initializeApp(firebaseConfig)
}

export const auth = getAuth(firebaseApp)