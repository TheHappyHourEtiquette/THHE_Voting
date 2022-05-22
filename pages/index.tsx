import type { NextPage } from 'next'
import Head from 'next/head'
import * as signalR from "@microsoft/signalr";
import { useState, useEffect } from 'react';
import { Icon } from '@fluentui/react/lib/Icon';
import { Show } from '../model/Show';
import { Panellist } from '../model/Panellist';
import { Question } from '../model/Question';
import { DefendTheIndefensible } from '../model/DefendTheIndefensible';
import { IGroupShowAllProps } from '@fluentui/react';


const Home: NextPage = () => {
  const functionsURL = "https://thhe-voting-functions.azurewebsites.net";
  // const functionsURL = "http://localhost:4280";
  //const functionsURL = "http://localhost:7071";

  /*
  const connection = new signalR.HubConnectionBuilder()
    .withUrl(`${functionsURL}/api`)
    .configureLogging(signalR.LogLevel.Information)
    .withAutomaticReconnect()
    .build();
  */
  
  const [connection, setConnection] = useState<signalR.HubConnection>();
  const [loaded, setLoaded] = useState<Boolean>(false);
  const [connected, setConnected] = useState<Boolean>(false);
  //const { hubConnectionState, error } = useHub(connection);
  const [ hubConnectionState, setHubConnectionState ] = useState<signalR.HubConnectionState>(signalR.HubConnectionState.Disconnected);
  const [hubConnectionId, setHubConnectionId] = useState<string>("");
  const [scoreUpEffect, setScoreUpEffect] = useState(false);
  const [scoreBigEffect, setScoreBigEffect] = useState(false);
  const [scoreDownEffect, setScoreDownEffect] = useState(false);
  const [scoreUpdateEffect, setScoreUpdateEffect] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<string>("Home");
  const [SelectedPanellist, setSelectedPanellist] = useState<Panellist>({
    PanellistId: 0,
    Title: "",
    ImageUrl: "",
    TotalScore: 0
  });
  const [SelectedQuestion, setSelectedQuestion] = useState<Question>({
    "QuestionId":0,
    "QuestionText": "",
    "QuestionOrder":1,
    "Scores": []
  });
  
  const [show, setShow] = useState<Show>({
    id: "",
    Title: "",
    session: "",
    Host: {
      PanellistId: 0,
      Title: "",
      ImageUrl: "",
      TotalScore: 0
    },
    SelectedQuestionId: 1,
    SelectedPanellistId: 1,
    SelectedDFIId: 1,
    CurrentScreen: "Home",
    Panellists: [],
    Questions: [],
    DefendTheIndefensibles: []
  });
  //const { invoke, loading } = useHubMethod(connection, "newMessage");

  useEffect(() => {
    const newConnection: signalR.HubConnection = new signalR.HubConnectionBuilder()
        .withUrl(`${functionsURL}/api`)
        .withAutomaticReconnect()
        .build();

    setConnection(newConnection);
}, []);

  useEffect(() => {
    if (connection) {
        connection.start()
            .then(result => {
                console.log('Connected!');

                connection.on('showUpdate', (showUpdate) => {
                  console.log('Show update received');
                  setShow(showUpdate);
                  setCurrentScreen(showUpdate.CurrentScreen);
                  //console.log(show.SelectedPanellistId);
                  const matchingPanellist = show.Panellists.find(p => p.PanellistId == show.SelectedPanellistId); 
                  console.log(matchingPanellist);
                  if (matchingPanellist != null) {
                    console.log("Panellist: " + matchingPanellist.Title);
                    setSelectedPanellist(matchingPanellist);
                  }
                  //console.log(show.SelectedQuestionId);
                  console.log(show.Questions);
                  const matchingQuestion = show.Questions.find(q => q.QuestionId == show.SelectedQuestionId); 
                  if (matchingQuestion != null) {
                    console.log("Selected question: " + SelectedQuestion.QuestionText);
                    setSelectedQuestion(matchingQuestion);
                  }
                  else {
                    console.log("no question found for " + show.SelectedQuestionId);
                  }
                  setScoreUpdateEffect(true);
                });
              
                connection.on('screenChanged', (screenName) => {
                  console.log('Screen changed: ' + screenName);
                  setCurrentScreen(screenName);
                });
              
              connection.on('updatedScore', (recipient, scoreChange) => {
                console.log('Response: ' + recipient + ' ' + scoreChange + ' score change');
                console.log('Received updated score with state as ' + connection.state);
                updateSingleScore(recipient, scoreChange);
                setScoreUpdateEffect(true);
              
              });

              connection.on('panellistChanged', (panellistId) => {
                const matchingPanellist = show.Panellists.find(p => p.PanellistId == panellistId); 
                if (matchingPanellist != null) {
                  setSelectedPanellist(matchingPanellist);
                }
              });

              connection.on('questionChanged', (questionId) => {
                const matchingQuestion = show.Questions.find(q => q.QuestionId == questionId); 
                  if (matchingQuestion != null) {
                    setSelectedQuestion(matchingQuestion);
                  }
                  setScoreUpdateEffect(true);
              });
            })
            .catch(e => console.log('Connection failed: ', e));
    };
    
  loadShow();
}, [connection]);

/*
  // onShowUpdate, onScreenChanged, onUpdatedScore)
  useEffect(() => {
    const handleShowUpdate = (showUpdate: Show) => {
      //console.log('Show update received');
      setShow(showUpdate);
      setCurrentScreen(showUpdate.CurrentScreen);
      //console.log(show.SelectedPanellistId);
      const matchingPanellist = show.Panellists.find(p => p.PanellistId == show.SelectedPanellistId); 
      if (matchingPanellist != null) {
        setSelectedPanellist(matchingPanellist);
      }
      //console.log(show.SelectedQuestionId);
      const matchingQuestion = show.Questions.find(q => q.QuestionId == show.SelectedQuestionId); 
      if (matchingQuestion != null) {
        setSelectedQuestion(matchingQuestion);
      }
      setScoreUpdateEffect(true);
    };

    const handleScreenChanged = (screenName: string) => {
      console.log('Screen changed: ' + screenName);
      setCurrentScreen(screenName);
    };

    const handleUpdatedScore = (recipient: string, scoreChange: number) => {
      console.log('Response: ' + recipient + ' ' + scoreChange + ' score change');
      updateSingleScore(recipient, scoreChange);
      setScoreUpdateEffect(true);
    };

    srConnector.events(handleShowUpdate, handleScreenChanged,handleUpdatedScore);
  });
*/
  /*
  connection.on('showUpdate', (showUpdate) => {
    //console.log('Show update received');
    setShow(showUpdate);
    setCurrentScreen(showUpdate.CurrentScreen);
    //console.log(show.SelectedPanellistId);
    const matchingPanellist = show.Panellists.find(p => p.PanellistId == show.SelectedPanellistId); 
    if (matchingPanellist != null) {
      setSelectedPanellist(matchingPanellist);
    }
    //console.log(show.SelectedQuestionId);
    const matchingQuestion = show.Questions.find(q => q.QuestionId == show.SelectedQuestionId); 
    if (matchingQuestion != null) {
      setSelectedQuestion(matchingQuestion);
    }
    setScoreUpdateEffect(true);
  });

  connection.on('screenChanged', (screenName) => {
    console.log('Screen changed: ' + screenName);
    setCurrentScreen(screenName);
  });

connection.on('updatedScore', (recipient, scoreChange) => {
  console.log('Response: ' + recipient + ' ' + scoreChange + ' score change');
  console.log('Received updated score with state as ' + connection.state);
  updateSingleScore(recipient, scoreChange);
  setScoreUpdateEffect(true);

});


connection.onclose(async () => {
  // await start();
});


async function start() {
  try {
    //if (!connected) {
      console.log('Connecting');
      await connection.start();
      setConnected(true);
      //console.log("SignalR connected");
      
      // console.log("message sent");
    //}
  }
  catch(err) {
    console.log("Humph, it failed: " + err);
    setTimeout(start, 5000);
  }
}
*/
async function loadShow() {
  
    const res = await fetch(`${functionsURL}/api/getShow`, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    });
    let data = await res.json() as Show;
    // console.log(data);
    setShow(data => {
      return data
    });
    setShow(data);
    setCurrentScreen(data.CurrentScreen);
    setLoaded(true);
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
    // console.log(data);
  }
  catch(err) {
    console.log(err);
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
      // console.log(data);
    });
  }
  catch(err) {
    console.log(err);
  }
}

async function updateSingleScore(recipient: string, scoreChange:number){
  try {
    /*console.log("Initial panellists")
    console.log(show.Panellists);
    console.log(show);*/
    const updatedPanellists = show.Panellists.map(p => p.Title == recipient ? { ...p, TotalScore: (p.TotalScore+scoreChange)} : p);
    /*console.log("Updated panellists")
    console.log(updatedPanellists);*/
    setShow({...show, Panellists:updatedPanellists});
    setScoreUpdateEffect(true);
  }
  catch(err) {
    console.log(err);
  }
}

  const handleSubmit = (event: any) => {//React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    console.warn('setting message:' + event.target.name.value);
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

        {(currentScreen === 'Home') && <div>
          <h2 className="text-4xl font-bold">
            How does it work?
          </h2>

          <p className="mt-3 text-2xl">
            Happy Hour Etiquette helps to share the best of etiquette around Microsoft 365. Our panel will be given three questions and each person has three minutes to share their thoughts.
          </p>

          <p className="mt-3 text-2xl">
            Every time that someone that someone makes a great point, give them a tick. Everytime that make an amazing point, give them a star. However, if there is something you do not like then you can give them a cross. Simple as that.
          </p>
        </div>
        }

        {(currentScreen == 'Questions - voting' || currentScreen == 'Questions - summary') &&
        <div className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">Question {SelectedQuestion.QuestionId}</p>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">{SelectedQuestion.QuestionText}?</p>
            </div>
          </div>
        </div>
        }

      {(currentScreen == 'Questions - summary') && 
        <div className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mt-10">
              <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-1 md:gap-x-8 md:gap-y-10"> 
                <div className="relative">
                  <dt>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Time to chat! Let us know what you think to by putting your hand up.</p>
                  </dt>
                </div>
              </dl>
            </div>
          </div>
        </div>
        }

        {(currentScreen == 'Scoreboard') && 
        <div className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                  
                  <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-1 md:gap-x-8 md:gap-y-16">
                  <p className={`${scoreUpdateEffect && "animate-ping"} mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl`} onAnimationEnd={() => setScoreUpdateEffect(false)}>
                    Score: {panellist.TotalScore}
                  </p>
                  </dl>
                </div>
                )
            })
            }
            </dl>
            </div>
          </div>
        </div>
        }

        {(currentScreen == 'Questions - voting') && 
        <div className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mt-10">
              <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-1 md:gap-x-8 md:gap-y-10">
                <div className="relative" key={SelectedPanellist.Title}>
                  <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                      <img src={SelectedPanellist.ImageUrl} alt={SelectedPanellist.Title}/>
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{SelectedPanellist.Title}</p>
                  </dt>
                  <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-4 md:gap-x-8 md:gap-y-16">
                    <div className="relative">  
                    </div>
                    <div className={`${scoreUpEffect && "animate-ping"} relative`} onClick={() => {
                      sendScore(SelectedPanellist.Title,1);
                      setScoreUpEffect(true);
                    }} onAnimationEnd={() => setScoreUpEffect(false)}>  
                      <Icon iconName="CompletedSolid" />
                    </div>
                    <div className={`${scoreBigEffect && "animate-ping"} relative`} onClick={() => {
                      sendScore(SelectedPanellist.Title,3);
                      setScoreBigEffect(true);
                    }} onAnimationEnd={() => setScoreBigEffect(false)}>  
                    <Icon iconName="HeartFill" />
                    </div>
                    <div className={`${scoreDownEffect && "animate-ping"} relative`} onClick={() => {
                      sendScore(SelectedPanellist.Title,-1);
                      setScoreDownEffect(true);
                    }} onAnimationEnd={() => setScoreDownEffect(false)}>
                      <Icon iconName="AlertSolid" />
                    </div>
                  </dl>
                  <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-1 md:gap-x-8 md:gap-y-16">
                  <p className={`${scoreUpdateEffect && "animate-ping"} mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl`} onAnimationEnd={() => setScoreUpdateEffect(false)}>
                    Score: {SelectedPanellist.TotalScore}
                  </p>
                  </dl>
                </div>
            </dl>
            </div>
          </div>
        </div>
        }
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
