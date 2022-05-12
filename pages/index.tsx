import type { NextPage } from 'next'
import Head from 'next/head'
import * as signalR from "@microsoft/signalr"
import { useState } from 'react';
import { Show } from '../model/Show';
import { Panellist } from '../model/Panellist';
import { Question } from '../model/Question';
import { DefendTheIndefensible } from '../model/DefendTheIndefensible';


const Home: NextPage = () => {
  const functionsURL = "https://thhe-voting-functions.azurewebsites.net";
  // const functionsURL = "http://localhost:4280";
  //const functionsURL = "http://localhost:7071";

  const connection = new signalR.HubConnectionBuilder()
    .withUrl(`${functionsURL}/api`)
    .configureLogging(signalR.LogLevel.Information)
    .withAutomaticReconnect()
    .build();

    

  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");
  const [loaded, setLoaded] = useState<Boolean>(false);
  //const { hubConnectionState, error } = useHub(connection);
  const [ hubConnectionState, setHubConnectionState ] = useState<signalR.HubConnectionState>(signalR.HubConnectionState.Disconnected);
  const [hubConnectionId, setHubConnectionId] = useState<string>("");
  const [show, setShow] = useState<Show>({
    Title: "",
    Host: {
      Title: "",
      ImageUrl: "",
      TotalScore: 0
    },
    Panellists: [],
    Questions: [],
    DefendTheIndefensibles: []
  });
  //const { invoke, loading } = useHubMethod(connection, "newMessage");

  connection.on('newMessage', (messageText) => {
  console.log('Response: ' + messageText);
  console.log('Received message with state as ' + connection.state);
  setMessages(messages => [messageText, ...messages]);
  setMessage('');
});

connection.on('updatedScore', (recipient, scoreChange) => {
  console.log('Response: ' + recipient + ' ' + scoreChange + ' score change');
  console.log('Received updated score with state as ' + connection.state);
  /*let updatedShow = show;
  let matchingPanellist = updatedShow.Panellists.find(p => p.Title == recipient);
  if (matchingPanellist != null) {
    matchingPanellist.TotalScore += scoreChange;
  }*/
  updateSingleScore(recipient, scoreChange);

});


connection.onclose(async () => {
  // await start();
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

async function loadShow() {
  
  if (!loaded) {
    const res = await fetch(`${functionsURL}/api/getShow`, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    });
    let data = await res.json() as Show;
    console.log(data);
    setShow(data => {
      return data
    });
    setShow(data);
    setLoaded(true);
  }
}

async function sendMessage(message: string) {
  try {
    const body = { message: "Azure" };
    const res = await fetch(`${functionsURL}/api/sendMessage`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    let data = await res.text();
    console.log(data);
  }
  catch(err) {
    console.log(err);
    setTimeout(start, 5000);
  }
}

const sendScore = (recipient: string, scoreChange:number) => {
  try {
    const body = { recipient: recipient, scoreChange: scoreChange };
    const res = fetch(`${functionsURL}/api/sendScore`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }).then((res)=>{
      let data = res.text();
      console.log(data);
    });
  }
  catch(err) {
    console.log(err);
    setTimeout(start, 5000);
  }
}

async function updateSingleScore(recipient: string, scoreChange:number){
  try {
    console.log("Initial panellists")
    console.log(show.Panellists);
    console.log(show);
    const updatedPanellists = show.Panellists.map(p => p.Title == recipient ? { ...p, TotalScore: (p.TotalScore+scoreChange)} : p);
    console.log("Updated panellists")
    console.log(updatedPanellists);
    setShow({...show, Panellists:updatedPanellists});
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
    //loadShow();
  };
  const newMessage = () => {
    console.log('a new message');
  }

  const inputChanged = (event: React.KeyboardEvent<HTMLInputElement>) => {
    event.preventDefault();
  }
  start();
  loadShow();
  //console.log(show.Panellists);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>The Happy Hour Etiquette Voting App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex w-full flex-1 flex-col items-center justify-top px-20 text-center">
        <h1 className="text-6xl font-bold">
          The Happy Hour Etiquette
        </h1>

        <p className="mt-3 text-2xl">
          Welcome to our session for {show.Title}.
        </p>

        <p>
          <img src="/HappyHourEtiquette.png" alt="Cocktails as Happy Hour Etiquette logo" ></img>
        </p>

        <h2 className="text-4xl font-bold">
          How does it work?
        </h2>

        <p className="mt-3 text-2xl">
          Happy Hour Etiquette helps to share the best of etiquette around Microsoft 365. Our panel will be given three questions and each person has three minutes to share their thoughts.
        </p>

        <p className="mt-3 text-2xl">
          Every time that someone that someone makes a great point, give them a tick. Everytime that make an amazing point, give them a star. However, if there is something you do not like then you can give them a cross. Simple as that.
        </p>

        <div className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">Question One</p>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">What is the behaviour that people should stop doing in Microsoft 365 (and how should they do it)?</p>
            </div>

            <div className="mt-10">
              <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              {
              show.Panellists.map((panellist: any) => {
                return (  
                <div className="relative" key={panellist.Title}>
                  <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                      <img src={panellist.ImageUrl} alt={panellist.Title}/>
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{panellist.Title}</p>
                  </dt>
                  <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-4 md:gap-x-8 md:gap-y-16">
                    <div className="relative">  
                    </div>
                    <div className="relative" onClick={() => sendScore(panellist.Title,1)}>  
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8192 8192" className="svg_dd790ee3" focusable="false"><path d="M1024 0q141 0 272 36t244 104 207 160 161 207 103 245 37 272q0 141-36 272t-104 244-160 207-207 161-245 103-272 37q-141 0-272-36t-244-104-207-160-161-207-103-245-37-272q0-141 36-272t104-244 160-207 207-161T752 37t272-37zm603 685l-136-136-659 659-275-275-136 136 411 411 795-795z" className="x-hidden-focus"></path></svg>
                    </div>
                    <div className="relative">  
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8192 8192" className="svg_dd790ee3" focusable="false"><path d="M1416 1254l248 794-640-492-640 492 248-794L0 768h784L1024 0l240 768h784l-632 486z" className="x-hidden-focus"></path></svg>
                    </div>
                    <div className="relative">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8192 8192" className="svg_dd790ee3 x-hidden-focus" focusable="false"><path d="M1024 0q141 0 272 36t244 104 207 160 161 207 103 245 37 272q0 141-36 272t-104 244-160 207-207 161-245 103-272 37q-141 0-272-36t-244-104-207-160-161-207-103-245-37-272q0-141 36-272t104-244 160-207 207-161T752 37t272-37zm128 1536v-256H896v256h256zm0-384V512H896v640h256z"></path></svg>
                    </div>
                  </dl>
                  <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-1 md:gap-x-8 md:gap-y-16">
                  <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">Score: {panellist.TotalScore}</p>
                  </dl>
                </div>
                )
            })
            }
            </dl>
            </div>
          </div>
        </div>


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
          Powered by gin
        </a>
      </footer>
    </div>
  )
}

export default Home
