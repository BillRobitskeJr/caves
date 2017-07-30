import Command from './Command';

export interface ResponseSettings {
  textResponse: string;
  command: Command;
}

export default class Response {
  private _textResponse: string;
  private _timestamp: Date;
  private _command: Command;

  constructor(settings: ResponseSettings) {
    this._textResponse = settings.textResponse;
    this._timestamp = new Date();
    this._command = settings.command;
  }

  get textResponse(): string {
    return this._textResponse;
  }

  get timestamp(): Date {
    return this._timestamp;
  }

  get command(): Command {
    return this._command;
  }
}
export { Response }
