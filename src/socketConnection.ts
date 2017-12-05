import {ResponseType, RequestType} from "./interfaces";
var shortId = require("shortid");

declare var socket: any;

var handlerByEventName: any = {};

var resolves: any = {};

export function setupHandler(type: ResponseType, handler: (data: any) => any): void {
    console.log("setup: " + type);

    handlerByEventName[type] = handler;
}

export function send(type: RequestType, data: any): Promise<any> {
    if(RequestType.isWaitRequest(type)) {
        return sendWithResponse(type, data);
    }

    socket.emit(type, data);

    return null;
}

function subscribeHandlers(): void {
    ResponseType.values().forEach(type => {
        subscribeOn(type, ResponseType.isOnRequest(type));
    })
}

function subscribeOn(eventName: string, accept: boolean = false): void {
    console.log("subscribed on: " + eventName + ", accept: " + accept);

    socket.on(eventName, data => {
        var handler = accept ? reponse => acceptResponse(reponse) : handlerByEventName[eventName];

        console.log("received: " + eventName + ", accept: " + accept);

        if(handler) {
            console.log("accepted: " + eventName + ", accept: " + accept);

            handler(data);
        }
    });

}

function sendWithResponse(requestName: string, data: any): Promise<any> {
    var requestId = shortId.generate();

    socket.emit(requestName, {requestId, data});

    return new Promise((resolve, reject) => {
        resolves[requestId] = {resolve, reject};
    });
}

function acceptResponse(data) {
    var requestId = data.requestId;

    if(resolves[requestId]) {
        resolves[requestId].resolve(data.payload);

        delete resolves[requestId];
    }
}

export function sendReady() {
    socket.emit('clientIsReady', "OK");
}

subscribeHandlers();