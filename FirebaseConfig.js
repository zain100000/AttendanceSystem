import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

const firebaseConfig = {
  apiKey: "AIzaSyD0_eh05AW8ChptWMk3xjrDhFce6M5Ziyk",
  authDomain: "attendance-system-c9a07.firebaseapp.com",
  projectId: "attendance-system-c9a07",
  storageBucket: "attendance-system-c9a07.appspot.com",
  messagingSenderId: "420838111204",
  appId: "1:420838111204:web:128af2d96be8e7d84039f1",
  measurementId: "G-RFKG9S63Q4"
};

firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();

export const roles = {
  student: 'Student',  
  admin: 'Admin',  
};
