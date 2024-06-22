const firebase = require("firebase/app")
const { getAuth } = require('firebase/auth')
const { getStorage } = require('firebase/storage')
const { getFirestore } = require('firebase/firestore')
const { initializeApp } = require('firebase/app')


const firebaseConfig = {
  apiKey: "AIzaSyBonL9FW0W0KtKJJZFrQh4RlRGukGjo_UU",
  authDomain: "amigo-chocolate-e17be.firebaseapp.com",
  projectId: "amigo-chocolate-e17be",
  storageBucket: "amigo-chocolate-e17be.appspot.com",
  messagingSenderId: "250778316502",
  appId: "1:250778316502:web:74ea7420b866bc2643a377",
  measurementId: "G-M0QT4KDCBV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
  
const auth = getAuth(app)

const db = getFirestore(app)

const storage = getStorage(app)

module.exports = { auth, db, storage }