import * as firebase from 'firebase';

var firebaseConfig = {
  apiKey: "AIzaSyAB58gmEv3eE2ZhIf7lZhdV-1ogiduacs4",
  authDomain: "studybuddy-c5bcc.firebaseapp.com",
  databaseURL: "https://studybuddy-c5bcc.firebaseio.com",
  projectId: "studybuddy-c5bcc",
  storageBucket: "studybuddy-c5bcc.appspot.com",
  messagingSenderId: "974547488573",
  appId: "1:974547488573:web:dd1a03ea98f521e6893f54",
  measurementId: "G-2KTTZRQS3S"
};

var firebaseApp = firebase.initializeApp(firebaseConfig);
var firestore = firebase.firestore();

export {firestore, firebaseApp};