import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import firebaseconfig from "./firebaseconfig";

firebase.initializeApp(firebaseconfig);

const auth = firebase.auth();
const firestore = firebase.firestore();

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

function SignOut() {
  return auth.currentUser && <button onClick={() => auth.signOut()}>Sign Out</button>;
}

function ChatRoom() {
  const dummy = useRef(null);

  const messagesRef = firestore.collection("messages");
  const query = messagesRef.orderBy("createdAt").limit(25);
  const [messages] = useCollectionData(query, { idField: "id" });

  useEffect(() => {
    if (dummy) {
      //@ts-ignore
      dummy.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <>
      <main>
        {messages?.map((msg) => (
          <ChatMessage
            //@ts-ignore
            key={msg.id}
            message={msg}></ChatMessage>
        ))}
        <div ref={dummy}></div>
      </main>
      <ChatMessageForm scrollDownRef={dummy} />
    </>
  );
}

function ChatMessageForm(props: any) {
  const [message, setMessage] = useState("");

  const sendMessage = async (e: any) => {
    e.preventDefault();
    const messagesRef = firestore.collection("messages");

    //@ts-ignore
    const { uid, photoURL } = auth.currentUser;

    console.log("uid", uid);
    console.log("photoURL", photoURL);

    await messagesRef.add({
      text: message,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
    });

    setMessage("");
    props.scrollDownRef.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <form onSubmit={sendMessage}>
      <input value={message} onChange={(e: any) => setMessage(e.target.value)}></input>
      <button disabled={message.length < 1} type="submit">
        Send
      </button>
    </form>
  );
}

function ChatMessage(props: any) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser?.uid ? "sent" : "received";

  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL}></img>
      <p>{text}</p>
    </div>
  );
}

export default App;
