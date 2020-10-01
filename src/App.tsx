import React from "react";

import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

import { useAuthState } from "react-firebase-hooks/auth";
// import { useCollectionData } from "react-firebase-hooks/firestore";
import firebaseconfig from "./firebaseconfig";

firebase.initializeApp(firebaseconfig);

const auth = firebase.auth();
// const firestore = firebase.firestore();

function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header className="App-header">
        <h4>Money Talks</h4>
      </header>
      <section>{user ? <ChatRoom /> : <SignIn />}</section>
    </div>
  );
}

export function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };

  return <button onClick={signInWithGoogle}>Sign in with Google</button>;
}

function ChatRoom() {
  return <></>;
}

export default App;
