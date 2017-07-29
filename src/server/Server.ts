/**
 * Server main module
 */
import * as express from 'express';
import * as http from 'http';
import * as bodyParser from 'body-parser';

import CommandsRoute from './CommandsRoute';

/**
 * Server class
 */
export default class Server {
  private _port: number;
  private _app: express.Application;
  private _server: http.Server;
  private _commandsRoute: CommandsRoute;

  /**
   * Build a new server instance
   * @param port HTTP port to listen on
   */
  constructor(port: number = 3000) {
    this._port = port;
    this._app = express();
    this._commandsRoute = new CommandsRoute();
    this.setupBodyParser();
    this.setupClientHost();
    this.setupRoutes();
  }

  /**
   * Path to static client files
   */
  static get clientDir(): string {
    return './client';
  }

  /**
   * Setup URL path for static hosting of the client
   */
  protected setupClientHost() {
    this._app.use('/', express.static(Server.clientDir));
  }

  protected setupRoutes() {
    this._app.use('/api/commands', this._commandsRoute.router);
  }

  protected setupBodyParser() {
    this._app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
  }

  /**
   * Start this server
   */
  start() {
    if (this._server) return;
    this._server = this._app.listen(this._port);
  }

  /**
   * Stop this server
   */
  stop() {
    if (!this._server) return;
    this._server.close();
    delete this._server;
  }
}