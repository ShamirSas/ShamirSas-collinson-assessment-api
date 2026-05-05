import { IMessage } from "../interfaces/share.interface";


export abstract class ResponseMessage implements IMessage {
    constructor(public message: string) {}
}

export class NoDataFoundMessage extends ResponseMessage {
    constructor() {
        super("No data found");
    }
}