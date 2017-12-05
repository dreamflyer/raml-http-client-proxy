export interface EditorPosition {
    column: number;
    lineNumber: number;
}

export interface EditorRange {
    start: EditorPosition;
    end: EditorPosition;
}

export interface EditorInfo {
    uri: string;
    value: string;
    offset: number;
    position: EditorPosition;
}

export enum RequestType {
    SET_CONTENT = 'setContent',
    SET_SELECTION_RANGE = 'setSelectionRange',
    SET_CONTENT_AND_OFFSET = 'getSetContentAndOffset',
    CHANGE_DETAIL_VALUE = 'getChangeDetailValue',
    POSITION_CHANGED = 'positionChanged',
    DOCUMENT_CHANGED = 'documentChanged',
    GET_DETAILS = 'getDetails',
    GET_LATEST_VERSION = 'getLatestVersion',
    GET_STRUCTURE = "getStructure"
}

export namespace RequestType {
    export function isWaitRequest(type: RequestType): boolean {
        return type.indexOf('get') === 0;
    }

    export function values(): RequestType[] {
        return [
            RequestType.SET_CONTENT,
            RequestType.SET_SELECTION_RANGE,
            RequestType.SET_CONTENT_AND_OFFSET,
            RequestType.CHANGE_DETAIL_VALUE,
            RequestType.POSITION_CHANGED,
            RequestType.DOCUMENT_CHANGED,
            RequestType.GET_DETAILS,
            RequestType.GET_LATEST_VERSION,
            RequestType.GET_STRUCTURE
        ]
    }
}

export enum ResponseType {
    EDITOR_OPENED = 'editorOpened',
    DID_CHANGE_CONTENT = 'didChangeContent',
    DETAILS_REPORT = 'detailsReport',
    STRUCTURE_REPORT = 'structureReport',
    REQUESTED_DETAILS_REPORT = 'requestedDetailsReport',
    REQUESTED_LATEST_VERSION = 'requestedLatestVersion',
    REQUESTED_STRUCTURE = 'requestedLatestVersion',
    REQUESTED_DETAIL_VALUE = 'requestedDetailValue',
    REQUESTED_OFFSET_UPDATE = 'requestedGetSetContentAndOffset'
}

export namespace ResponseType {
    export function isOnRequest(type: ResponseType): boolean {
        return type.indexOf('requested') === 0;
    }
    
    export function values(): ResponseType[] {
        return [
            ResponseType.EDITOR_OPENED,
            ResponseType.DID_CHANGE_CONTENT,
            ResponseType.DETAILS_REPORT,
            ResponseType.STRUCTURE_REPORT,
            ResponseType.REQUESTED_DETAILS_REPORT,
            ResponseType.REQUESTED_LATEST_VERSION,
            ResponseType.REQUESTED_STRUCTURE,
            ResponseType.REQUESTED_DETAIL_VALUE,
            ResponseType.REQUESTED_OFFSET_UPDATE
        ]
    }
}
