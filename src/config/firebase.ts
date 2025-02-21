import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyACZPubimPLAFWm5vebMJdgRtxmnY5ThOk",
  authDomain: "fft-solucoes.firebaseapp.com",
  projectId: "fft-solucoes",
  storageBucket: "fft-solucoes.firebasestorage.app",
  messagingSenderId: "478444990886",
  appId: "1:478444990886:web:02365a5028c823d3dcdf67",
  measurementId: "G-YT6J674H4V"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);