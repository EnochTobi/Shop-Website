import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js';
import { getFirestore, collection, getDocs } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-storage.js';

const firebaseConfig = {
  apiKey: "AIzaSyBUS49gtbTgr2reZtVBEtzTUdQX6JEb11c",
  authDomain: "berachahboutiques-b6d5e.firebaseapp.com",
  projectId: "berachahboutiques-b6d5e",
  storageBucket: "berachahboutiques-b6d5e.firebasestorage.app",
  messagingSenderId: "971892836817",
  appId: "1:971892836817:web:6bf2c3847aef97973cf8f0",
  measurementId: "G-3KGGM1NLQT",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const colRef = collection(db, 'products');
getDocs(colRef)
  .then((snapshot) => {
    let products = [];
    snapshot.docs.forEach((doc) => {
      console.log(doc.id, '=>', doc.data());
    });
  })
  .catch((error) => {
    console.log('Error getting documents: ', error);
  });