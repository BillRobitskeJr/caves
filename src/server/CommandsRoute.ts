import { Router } from 'express';

import Command from './model/Command';
import Interpreter from './interpreter/Interpreter';

export default class CommandsRoute {
  private _router: Router;
  private _interpreter: Interpreter;

  constructor() {
    this._router = Router();
    this._interpreter = new Interpreter();
    this.setupRoutes();
  }

  get router(): Router {
    return this._router;
  }

  protected setupRoutes() {
    this._router.route('/')
      .get((req, res) => {
        res.status(200);
      })
      .post((req, res) => {
        const command = new Command({
          rawCommand: req.body.data.properties.rawCommand
        });
        const commandResponse = this._interpreter.processCommand(command);
        const response = new Buffer(JSON.stringify({
          data: {
            id: `${command.timestamp.toISOString()}`,
            type: 'commands',
            properties: {
              rawCommand: command.rawCommand,
              action: command.action,
              target: command.target,
              timestamp: command.timestamp.toISOString()
            },
            relationships: {
              response: {
                id: `${commandResponse.timestamp.toISOString()}`,
                type: 'responses'
              }
            }
          },
          included: [
            {
              id: `${commandResponse.timestamp.toISOString()}`,
              type: 'responses',
              properties: {
                textResponse: commandResponse.textResponse,
                timestamp: commandResponse.timestamp.toISOString()
              }
            }
          ]
        }));
        res.status(201).contentType('application/vnd.api+json').send(response);
      });
  }
}
export { CommandsRoute }
