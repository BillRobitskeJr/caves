import * as compromise from 'compromise';

interface CommandSettings {
  rawCommand: string;
}

export default class Command {
  private _rawCommand: string;
  private _action: string;
  private _target: string;
  private _timestamp: Date;

  constructor(settings: CommandSettings) {
    this._rawCommand = settings.rawCommand;
    this.processCommand();
    this._timestamp = new Date();
  }

  protected processCommand() {
    const command = compromise(this._rawCommand).normalize().match('#Verb (#Topic|#Noun)?');
    this._action = command.verbs(0).trim().out();
    this._target = command.topics(0).trim().out() || command.nouns(0).trim().out();
  }

  get rawCommand(): string {
    return this._rawCommand;
  }

  get action(): string {
    return this._action;
  }

  get target(): string {
    return this._target;
  }

  get timestamp(): Date {
    return this._timestamp;
  }
}