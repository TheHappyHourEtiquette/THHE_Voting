import * as signalR from "@microsoft/signalr";
import { Show } from "../model/Show";
//const URL = process.env.HUB_ADDRESS ?? "https://localhost:5001/hub"; //or whatever your backend port is
const URL = "https://thhe-voting-functions.azurewebsites.net/api";

class Connector {
    private connection: signalR.HubConnection;
    public events: (
        showUpdate: (showUpdate: Show) => void,
        screenChanged: (screenName: string) => void,
        updatedScore: (recipient: string, scoreChange: number) => void
    ) => void;
    static instance: Connector;
    constructor() {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(URL)
            .withAutomaticReconnect()
            .build();
        this.connection.start().catch(err => document.write(err));

        this.events = (onShowUpdate, onScreenChanged, onUpdatedScore) => {
            this.connection.on("showUpdate", (showUpdate) => {
                onShowUpdate(showUpdate);
            });
            this.connection.on("screenChanged", (screenName) => {
                onScreenChanged(screenName);
            });
            
            this.connection.on("updatedScore", (recipient, scoreChange) => {
                onUpdatedScore(recipient, scoreChange);
            });
        };
    }
    public newMessage = (messages: string) => {
        this.connection.send("newMessage", "foo", messages).then(x => console.log("sent"))
    }
    public static getInstance(): Connector {
        console.log("Calling Get Instance");
        if (!Connector.instance)
            Connector.instance = new Connector();
        return Connector.instance;
    }
}
