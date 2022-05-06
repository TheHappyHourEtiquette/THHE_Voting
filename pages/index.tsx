import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import * as signalR from "@microsoft/signalr"
import { useState } from 'react';
import {useHub} from '../utils/useHub';
import {useClientMethod} from '../utils/useClientMethod';
import {useHubMethod} from '../utils/useHubMethod';
import { start } from 'repl';
import { connect } from 'http2';
import { sign } from 'crypto';


const Home: NextPage = () => {

  const connection = new signalR.HubConnectionBuilder()
    .withUrl("http://localhost:7071/api")
    //.withUrl("https://thhe-voting-functions.azurewebsites.net/api")
    .configureLogging(signalR.LogLevel.Information)
    .withAutomaticReconnect()
    .build();

  //TODO: close connection!

  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");
  const [errorText, setErrorText] = useState<string>("");
  //const { hubConnectionState, error } = useHub(connection);
  const [ hubConnectionState, setHubConnectionState ] = useState<signalR.HubConnectionState>(signalR.HubConnectionState.Disconnected);
  const [hubConnectionId, setHubConnectionId] = useState<string>("");
  //const { invoke, loading } = useHubMethod(connection, "newMessage");

  if (hubConnectionId == "") {
    console.log("Not yet connected");
    //connection.start()

    start().then(() => {
      console.log("connected: " + connection.state);
      setHubConnectionState(signalR.HubConnectionState.Connected);
      let connectionId = connection.connectionId;
      if (connectionId == null) { connectionId=""};
      setHubConnectionId(connectionId);
    });
  }
  /*
  useClientMethod(connection, "newMessage", (user, message) => {
    console.log('Received message ' + message)
    setMessages([...messages, message]);
    //messages += message;
});*/

connection.on('newMessage', (messageText) => {
  console.log('Response: ' + messageText);
  console.log('Received message with state as ' + connection.state);
  setMessages(messages => [messageText, ...messages]);
  setMessage('');
});


connection.onclose(async () => {
  await start();
});

async function start() {
  try {
    await connection.start();
    console.log("SignalR connected");
    connection.invoke("newMessage", "kevmcdonk", "started").then(()=> {
      console.log("It invoked");
    }).catch((err) => {
      console.log("there was an error: " + err);
    })
    ;
    console.log("message invoked");
    connection.send("newMessage", "started").then(()=> {
      console.log("It sent");
    }).catch((err) => {
      console.log("there was an error: " + err);
    })
    ;
    console.log("message sent");
    
  }
  catch(err) {
    console.log("Humph, it failed: " + err);
    setTimeout(start, 5000);
  }
}

async function sendMessage(message: string) {
  try {
    const body = { message: "Azure" };
    const res = await fetch("http://localhost:7071/api/sendMessage", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    let data = await res.text();
    console.log(data);
  
    /*
    console.log("sending message");
    if (connection.state == signalR.HubConnectionState.Disconnected) {
      connection.start().then(()=>{
        connection.send('newMessage', message).then(()=> {
          console.log("It sent the message from disconnected");
        }).catch((err) => {
          console.log("there was an error: " + err);
        });
      });
    }
    else {
      connection.send('newMessage', "kevmcdonk", message).then(()=> {
        console.log("It sent the message");
      }).catch((err) => {
        console.log("there was an error: " + err);
      });
    }
    */
  }
  catch(err) {
    console.log(err);
    setTimeout(start, 5000);
  }
}

  const handleSubmit = (event: any) => {//React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    console.warn('setting message:' + event.target.name.value);
    console.log("HandleSubmit ConnectionState: " + hubConnectionState + ", " + connection.state);
    /* invoke("newMessage","here is the message").then(()=> {
      console.log("something has happened: " + hubConnectionState);
    }).catch(()=> {
      console.log("something has failed");
    });
    if (!loading) {
      console.log("Hmmm");
    }*/

    sendMessage("bla");
  };
  const newMessage = () => {
    console.log('a new message');
  }

  const inputChanged = (event: React.KeyboardEvent<HTMLInputElement>) => {
    event.preventDefault();
  }
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
        <h1 className="text-6xl font-bold">
          Welcome to{' '}
          <a className="text-blue-600" href="https://nextjs.org">
            Next.js!
          </a>
        </h1>

        <p className="mt-3 text-2xl">
          Get started by editing{' '}
          <code className="rounded-md bg-gray-100 p-3 font-mono text-lg">
            pages/index.tsx
          </code>
        </p>

        <div className="mt-6 flex max-w-4xl flex-wrap items-center justify-around sm:w-full">
          <div>
            Hello
            <form onSubmit={handleSubmit}>
              <label htmlFor="name">Name</label>
              <input id="name" name="name" type="text" autoComplete="name" required />
              <button type="submit">Register</button>
            </form>
          </div>
          <div id="divMessages" className="messages">{messages}</div>
        </div>
      </main>

      <footer className="flex h-24 w-full items-center justify-center border-t">
        <a
          className="flex items-center justify-center gap-2"
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
        </a>
      </footer>
    </div>
  )
}

export default Home
