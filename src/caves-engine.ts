import GameEntity from './game-entity';
import { GameEntityConfig } from './game-entity';
import PlayerEntity from './player-entity';
import { PlayerEntityConfig } from './player-entity';
import LocationEntity from './location-entity';
import { LocationEntityConfig } from './location-entity';
import ObjectEntity from './object-entity';
import { ObjectEntityConfig } from './object-entity';
import Collection from './collection';

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
  player?: PlayerEntityConfig;
  locations?: LocationEntityConfig[];
  objects?: ObjectEntityConfig[];
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
        this.handleTitleInput(input.trim());
        break;
      case GameState.opening:
        this.handleOpeningInput(input.trim());
        break;
      case GameState.playing:
        this.handlePlayingInput(input.trim());
        break;
    }
  }

  private handleTitleInput(input: string): void {
    if (input.match(/^start$/i)) {
      this.startOpening();
    } else {
      this.displayTitleScreen();
    }
  }

  private handleOpeningInput(input: string): void {
    this.gameEntity.setState('openingPage', this.gameEntity.getState('openingPage') + 1);
    if (this.gameEntity.openingScreen) {
      this.displayOpeningScreen();
    } else {
      this.startPlaying();
    }
  }

  private handlePlayingInput(input: string): void {
    if (this.gameEntity.getState('isQuitting')) {
      if (input.match(/^y(es)?$/i)) {
        this.gameEntity.setState('isQuitting', false);
        this.gameState = GameState.title;
        this.displayTitleScreen();
      } else if (input.match(/^n(o)?$/i)) {
        this.gameEntity.setState('isQuitting', false);
        const location = this.gameEntity.player.location;
        const locationName = location ? location.name : 'nowhere';
        this.outputs.main.print(`You are ${locationName}.`);
      } else {
        this.displayPlayingQuitPrompt();
      }
    } else if (input.match(/^quit$/i)) {
      this.gameEntity.setState('isQuitting', true);
      this.displayPlayingQuitPrompt();
    } else if (input) {
      this.outputs.main.print(`You don't know how to do that.`);
    }
    if (this.gameState === GameState.playing && !this.gameEntity.getState('isQuitting')) this.displayPlayingTurnStart();
  }

  private startOpening(): void {
    this.gameState = GameState.opening;
    this.gameEntity.setState('openingPage', 0);
    this.displayOpeningScreen();
  }
  
  private startPlaying(): void {
    this.gameState = GameState.playing;
    this.gameEntity.player = new PlayerEntity(this.config.player || {}, this.gameEntity);
    this.gameEntity.locations = new Collection<LocationEntity>((this.config.locations || []).map(config => new LocationEntity(config, this.gameEntity)));
    this.gameEntity.objects = new Collection<ObjectEntity>((this.config.objects || []).map(config => new ObjectEntity(config, this.gameEntity)));
    this.outputs.main.clear();
    const location = (this.gameEntity.player.location || {name: 'nowhere'});
    this.outputs.main.print(`You are ${location.name}.`);
    this.displayPlayingTurnStart();
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

  private displayPlayingTurnStart(): void {
    this.outputs.location.clear();
    this.gameEntity.locationStatusScreen.forEach(line => { this.outputs.location.print(line); });
    this.outputs.player.clear();
    this.gameEntity.playerStatusScreen.forEach(line => { this.outputs.player.print(line); });
  }

  private displayPlayingQuitPrompt(): void {
    this.outputs.main.print(`Do you want to quit? (Yes/no)`);
  }
}