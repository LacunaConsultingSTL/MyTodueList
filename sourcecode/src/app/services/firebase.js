import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firebase-firestore'
import 'firebase/firebase-database'


const config = {
  apiKey: "AIzaSyDd5hiHu_pHZFJT0YiPZuUoVgUtgKlsG4o",
  authDomain: "todue-mullan.firebaseapp.com",
  databaseURL: "https://todue-mullan.firebaseio.com",
  projectId: "todue-mullan",
  storageBucket: "todue-mullan.appspot.com",
  messagingSenderId: "345532771312",
  appId: "1:345532771312:web:e211aa4bc3cfcfddb80b35"
};

firebase.initializeApp(config);

export default firebase;
