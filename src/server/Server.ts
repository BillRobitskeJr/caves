/**
 * Server main module
 */
import * as express from 'express';
import * as http from 'http';

/**
 * Server class
 */
export default class Server {
  private _port: number;
  private _app: express.Application;
  private _server: http.Server;

  /**
   * Build a new server instance
   * @param port HTTP port to listen on
   */
  constructor(port: number = 3000) {
    this._port = port;
    this._app = express();
    this.setupClientHost();
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