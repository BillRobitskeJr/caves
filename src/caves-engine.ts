import GameEntity from './game-entity';
import { GameEntityConfig } from './game-entity';

export interface OutputPrintFunc {
  (message: string): void;
}

export interface OutputClearFunc {
  (): void;
}

export interface Output {
  print: OutputPrintFunc;
  clear: OutputClearFunc;
}

export interface OutputsDict {
  main: Output;
  location: Output;
  player: Output;
}

export interface GameConfig {
  game?: GameEntityConfig;
}

export default class CavesEngine {
  private outputs: OutputsDict;
  private config: GameConfig;
  private gameEntity: GameEntity;

  constructor(outputs: OutputsDict, config: GameConfig) {
    this.outputs = outputs;
    this.config = config;
    
    this.gameEntity = new GameEntity(config.game || {});
    this.displayTitleScreen();
  }

  public handleInput(): void {}

  private displayTitleScreen(): void {
    this.gameEntity.titleScreen.forEach(line => { this.outputs.main.print(line); });
    this.outputs.location.clear();
    this.outputs.player.clear();
  }
}