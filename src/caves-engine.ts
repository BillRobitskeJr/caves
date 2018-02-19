
import { OutputsDict } from './outputs';
import { GameConfig } from './game-config';

/**
 * Core engine class
 */
export default class CavesEngine {
  private outputs: OutputsDict;
  private config: GameConfig;

  constructor(outputs: OutputsDict = {}, config: GameConfig = {}) {
    this.outputs = outputs;
    this.config = config;
  }

  public handleInput(input: string = ''): void {

  }
}
