import socketConnection = require("./socketConnection");
import {EditorInfo, EditorPosition, EditorRange, ResponseType, RequestType} from "./interfaces";

var onEditorOpenedListeners: any = [];

import textProcessor = require("./textProcessor");

import utils = require("./utils");

export class EditorProxyModel {
    uri: string;
    
    constructor(private info: EditorInfo, private owner: EditorProxy) {
        this.uri = info.uri;
        
        socketConnection.setupHandler(ResponseType.DID_CHANGE_CONTENT, (newInfo: EditorInfo) => this.didChange(newInfo));
    }
    
    private onDidChangeListeners = [];
    
    getOffsetAt(position: EditorPosition): number {
        return utils.offsetAt(position, this.info.value);
    }
    
    getPositionAt(offset: number): EditorPosition {
        return utils.positionAt(offset, this.info.value);
    }
    
    getValue(): string {
        return this.info.value;
    }
    
    onDidChangeContent(callback: () => any): void {
        this.onDidChangeListeners.push(callback);
    }
    
    private didChange(info: EditorInfo) {
        this.info = info;
        this.owner.setInfo(info);

        this.uri = info.uri;
        
        this.onDidChangeListeners.forEach(callback => callback());
    }
}

export class EditorProxy {
    private model;
    
    constructor(private info: EditorInfo) {
        this.model = new EditorProxyModel(info, this);
    }
    
    setValue(value: string, offset?: number): void {
        if(offset || offset === 0) {
            setContentAndOffset(value, offset).then(payload => {
                this.info.value = value;
                
                this.info.offset = payload.offset;
                this.info.position = payload.position;
            });
        } else {
            this.info.value = value;
            
            setContent(value);
        }
    }
    
    getModel(): EditorProxyModel {
        return this.model;
    }
    
    getPosition(): EditorPosition {
        return this.info.position;
    }
    
    setInfo(info: EditorInfo): void {
        this.info = info;
    }
    
    setSelection(range: EditorRange): void {
        setSelectionRange(range);
    }
}

function editorFromInfo(info: EditorInfo): EditorProxy {
    return new EditorProxy(info);
}

export function onEditorOpened(callback: (editor: EditorProxy) => void): void {
    onEditorOpenedListeners.push(callback);
}

export function onDetailsReport(callback: (report: any) => void) {
    socketConnection.setupHandler(ResponseType.DETAILS_REPORT, callback);
}

export function onStructureReport(callback: (report: any) => void) {
    socketConnection.setupHandler(ResponseType.STRUCTURE_REPORT, callback);
}

export function setContent(content: string): void {
    socketConnection.send(RequestType.SET_CONTENT, content);
}

export function setContentAndOffset(content: string, offset: number): Promise<any> {
    return socketConnection.send(RequestType.SET_CONTENT_AND_OFFSET, {content, offset});
}

export function setSelectionRange(range: EditorRange): void {
    socketConnection.send(RequestType.SET_SELECTION_RANGE, range);
}

export function applyDocumentEdits(oldContents: string, edits: any) {
    return textProcessor.applyDocumentEdits(oldContents, edits);
}

export function changeDetailValue(uri: string, position: number, itemID: string, value: string | number| boolean) {
    return socketConnection.send(RequestType.CHANGE_DETAIL_VALUE, {uri, position, itemID, value});
}

export function positionChanged(uri, position) {
    return socketConnection.send(RequestType.POSITION_CHANGED, {uri, position});
}

export function documentChanged(data: any) {
    return socketConnection.send(RequestType.DOCUMENT_CHANGED, data);
}

export function getDetails(uri: string, position: number): Promise<any> {
    return socketConnection.send(RequestType.GET_DETAILS, {uri, position});
}

export function getLatestVersion(uri: string): Promise<any> {
    return socketConnection.send(RequestType.GET_LATEST_VERSION, {uri});
}

export function getStructure(uri: string): Promise<any> {
    return socketConnection.send(RequestType.GET_STRUCTURE, {uri});
}


export function documentClosed(uri: string) {
    
}

export function markOccurrences(uri: string, position: number): Promise<any> {
    return Promise.resolve([]);
}

export function init() {
    socketConnection.setupHandler(ResponseType.EDITOR_OPENED, (editorInfo: EditorInfo) => {
        var editorProxy = editorFromInfo(editorInfo);

        onEditorOpenedListeners.forEach(callback => callback(editorProxy));
    });

    socketConnection.sendReady();
}
