import { initializeApp } from 'firebase/app'; 
import { getFirestore } from 'firebase/firestore';
import { collection, addDoc,getDocs,deleteDoc,doc,updateDoc} from "firebase/firestore";  

const firebaseConfig = {
    apiKey: "AIzaSyAtG_vk-qkM6uqkkuls3T8fllTSL1eb3W4",
    authDomain: "project1test-6bc26.firebaseapp.com",
    projectId: "project1test-6bc26",
    storageBucket: "project1test-6bc26.appspot.com",
    messagingSenderId: "192963045731",
    appId: "1:192963045731:web:23c535ef8afa6e3c4c0b56",
    measurementId: "G-F4D6EFHWTV"
  };
  
const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);

export {firebaseApp,db,addDoc,collection,getDocs,deleteDoc,doc,updateDoc}; 