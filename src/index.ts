/**
 * Server startup script
 */
import Server from './server/Server';

// Startup server on default port (3000)
const server = new Server();
server.start();
