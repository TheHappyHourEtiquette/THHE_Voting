import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import * as signalR from "@microsoft/signalr"

/*
let messages = document.querySelector('#messages');
    const apiBaseUrl = window.location.origin;
    const connection = new signalR.HubConnectionBuilder()
        .withUrl(apiBaseUrl + '/api')
        .configureLogging(signalR.LogLevel.Information)
        .build();
      connection.on('newMessage', (message) => {
        document.getElementById("messages").innerHTML = message;
      });

      connection.start()
        .catch(console.error);
*/
const connection = new signalR.HubConnectionBuilder()
    .withUrl("/hub")
    .build();

    connection.on("messageReceived", (username: string, message: string) => {
      const m = document.createElement("div");
    
      m.innerHTML = `<div class="message-author">${username}</div><div>${message}</div>`;
    
      divMessages.appendChild(m);
      divMessages.scrollTop = divMessages.scrollHeight;
    });
    
    connection.start().catch((err) => document.write(err));
    
    tbMessage.addEventListener("keyup", (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        send();
      }
    });
    
    btnSend.addEventListener("click", send);
    
    function send() {
      connection.send("newMessage", username, tbMessage.value)
        .then(() => (tbMessage.value = ""));
    }

const Home: NextPage = () => {
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
        <div id="divMessages" className="messages"></div>
          <div className="input-zone">
            <label id="lblMessage" htmlFor="tbMessage">Message:</label>
            <input id="tbMessage" className="input-zone-input" type="text" />
            <button id="btnSend">Send</button>
          </div>
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
          <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
        </a>
      </footer>
    </div>
  )
}

export default Home
