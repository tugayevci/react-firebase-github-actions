import React, { useState } from "react";

import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC012hXdX33X8-ITOawjz-4S0NbR0Uf0FY",
  authDomain: "react-github-firebase-549de.firebaseapp.com",
  databaseURL: "https://react-github-firebase-549de.firebaseio.com",
  projectId: "react-github-firebase-549de",
  storageBucket: "react-github-firebase-549de.appspot.com",
  messagingSenderId: "59819350027",
  appId: "1:59819350027:web:c484d5056358e4c0d34f0e",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header className="App-header"></header>
      <section>{user ? <ChatRoom /> : <SignIn />}</section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };

  return <button onClick={signInWithGoogle}>Sign in with Google</button>;
}

function SignOut() {
  return auth.currentUser && <button onClick={() => auth.signOut()}>Sign Out</button>;
}

function ChatRoom() {
  const messagesRef = firestore.collection("messages");
  console.log("messagesRef", messagesRef);

  const query = messagesRef.limit(5);
  const [messages] = useCollectionData(query);
  console.log("messages", messages);

  const [formValue, setFormValue] = useState("");

  const sendMessage = async (e: any) => {
    e.preventDefault();

    //@ts-ignore
    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });

    setFormValue("");
  };

  return (
    <>
      <div>
        {messages &&
          messages.map((msg) => (
            <ChatMessage
              //@ts-ignore
              key={msg.id}
              message={msg}></ChatMessage>
          ))}
        <form onSubmit={sendMessage}>
          <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="say something nice" />

          <button type="submit" disabled={!formValue}>
            🕊️
          </button>
        </form>
        <SignOut />
      </div>
    </>
  );
}

function ChatMessage(props: any) {
  const { text, uid } = props.message;

  return <p>{text}</p>;
}

export default App;
