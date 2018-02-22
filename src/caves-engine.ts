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

export enum GameState {
  title,
  opening,
  playing,
  ending,
  loading,
  saving
}

export default class CavesEngine {
  private outputs: OutputsDict;
  private config: GameConfig;
  private gameState: GameState;
  private gameEntity: GameEntity;

  constructor(outputs: OutputsDict, config: GameConfig) {
    this.outputs = outputs;
    this.config = config;
    this.gameState = GameState.title;
    
    this.gameEntity = new GameEntity(config.game || {});
    this.displayTitleScreen();
  }

  public handleInput(input: string): void {
    switch(this.gameState) {
      case GameState.title:
        this.handleTitleInput(input);
    }
  }

  private handleTitleInput(input: string): void {
    if (input.trim().match(/^start$/i)) {
      this.startOpening();
    } else {
      this.displayTitleScreen();
    }
  }

  private startOpening(): void {
    this.gameState = GameState.opening;
    this.gameEntity.setState('openingPage', 0);
    this.displayOpeningScreen();
  }

  private displayTitleScreen(): void {
    this.outputs.main.clear();
    this.gameEntity.titleScreen.forEach(line => { this.outputs.main.print(line); });
    this.outputs.location.clear();
    this.outputs.player.clear();
  }

  private displayOpeningScreen(): void {
    this.outputs.main.clear();
    this.gameEntity.openingScreen.forEach(line => { this.outputs.main.print(line); });
    this.outputs.main.print(`Press Return to continue...`);
    this.outputs.location.clear();
    this.outputs.player.clear();
  }
}