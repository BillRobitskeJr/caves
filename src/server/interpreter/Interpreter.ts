import Command from '../model/Command';
import Response from '../model/Response';

export default class Interpreter {
  processCommand(command: Command): Response {
    command.response = new Response({
      command,
      textResponse: `You don't know how to ${command.action}.`
    });
    return command.response;
  }
}
export { Interpreter }
