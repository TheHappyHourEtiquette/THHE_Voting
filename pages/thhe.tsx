import type { NextPage } from 'next'
import Head from 'next/head'
import * as signalR from "@microsoft/signalr"
import { useState } from 'react';
import { Show } from '../model/Show';
import { Icon } from '@fluentui/react/lib/Icon';
import { Panellist } from '../model/Panellist';
import { Question } from '../model/Question';
import { DefendTheIndefensible } from '../model/DefendTheIndefensible';


const Thhe: NextPage = () => {
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
  const [scoreUpEffect, setScoreUpEffect] = useState(false);
  const [scoreBigEffect, setScoreBigEffect] = useState(false);
  const [scoreDownEffect, setScoreDownEffect] = useState(false);
  const [scoreUpdateEffect, setScoreUpdateEffect] = useState(false);
  
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

  connection.on('showUpdate', (showUpdate) => {
    console.log('Show update received');
    setShow(showUpdate);
    setScoreUpdateEffect(true);
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
  setScoreUpdateEffect(true);

});


connection.onclose(async () => {
  // await start();
});

async function start() {
  try {
    await connection.start();
    //console.log("SignalR connected");
    connection.send("newMessage", "started").then(()=> {
      console.log("It sent");
    }).catch((err) => {
      console.log("there was a sent error: " + err);
    })
    ;
    // console.log("message sent");
    
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

const sendScreenChange = (screenName: string) => {
  try {
    const body = { screenName: screenName};
    const res = fetch(`${functionsURL}/api/changeScreen`, {
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
    setScoreUpdateEffect(true);
  }
  catch(err) {
    console.log(err);
    setTimeout(start, 5000);
  }
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
        <title>The Happy Hour Etiquette Admin Page</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex w-full flex-1 flex-col items-center justify-top px-20 text-center">
        <h1 className="text-6xl font-bold">
          The Happy Hour Etiquette Admin
        </h1>

        <p className="mt-3 text-2xl">
          Controlling the show {show.Title}.
        </p>

        <p>
          <img src="/HappyHourEtiquette.png" alt="Cocktails as Happy Hour Etiquette logo" ></img>
        </p>

        <h2 className="text-4xl font-bold">
          Screens
        </h2>

        <div className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> 
            <div className="lg:text-center" onClick={() => sendScreenChange('Home')}>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              <Icon iconName="Send" />  Home
              </p>
            </div>
            <div className="lg:text-center" onClick={() => sendScreenChange('Questions - voting')}>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              <Icon iconName="Send" />  Questions - voting
              </p>
            </div>
            <div className="lg:text-center" onClick={() => sendScreenChange('Questions - summary')}>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              <Icon iconName="Send" />  Questions - summary
              </p>
            </div>
            <div className="lg:text-center" onClick={() => sendScreenChange('Scoreboard')}>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              <Icon iconName="Send" />  Scoreboard
              </p>
            </div>
            <div className="lg:text-center" onClick={() => sendScreenChange('Defend the indefensible')}>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              <Icon iconName="Send" />  Defend the indefensible
              </p>
            </div>
          </div>
        </div>

        <h2 className="text-4xl font-bold">
          Questions
        </h2>

        <div className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {
            show.Questions.map((question: any) => {
              return (  
                <div className="lg:text-center" key={question}>
                  <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                  <Icon iconName="Send" />  {question}?
                  </p>
                </div>
            )})
          }
          </div>
        </div>

        <h2 className="text-4xl font-bold">
          Panellists
        </h2>

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
                </div>
                )
            })
            }
            </dl>
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

export default Thhe
