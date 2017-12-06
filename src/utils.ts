import {EditorPosition} from "./interfaces";

export function offsetAt(position: EditorPosition, content: string): number {
    var lines = content.split("\n");

    var offset = position.column;

    for(var i = 0; i < position.lineNumber && i < lines.length; i++) {
        offset += lines[i].length + 1;
    }

    return offset < content.length ? offset : content.length - 1;
}

export function positionAt(offset: number, content: string): EditorPosition {
    var lines = content.split("\n");

    var currentOffset = 0;

    for(var i = 0; i < lines.length && currentOffset < offset; i++) {
        var lineLength = lines[i].length + (i === lines.length - 1 ? 0 : 1);
        
        currentOffset += lineLength;
    }
    
    var column = offset - (currentOffset - lineLength);

    return {
        lineNumber: i === 0 ? 0 : i - 1,

        column: column > 0 ? column : 0
    }
}