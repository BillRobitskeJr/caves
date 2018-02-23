import Entity from './entity';
import { EntityConfig } from './entity';
import PlayerEntity from './player-entity';

export interface GameEntityConfig extends EntityConfig {
  titleScreen?: string[];
  openingScreens?: string[][];
}

export default class GameEntity extends Entity {
  private playerEntity: PlayerEntity;

  constructor(config: GameEntityConfig) {
    super(config);
    this.setState('titleScreen', config.titleScreen || ['']);
    this.setState('openingScreens', config.openingScreens || [['']]);

    this.setState('openingPage', 0);
  }

  public get player(): PlayerEntity { return this.playerEntity; }
  public set player(playerEntity: PlayerEntity) { this.playerEntity = playerEntity; }

  public get titleScreen(): string[] { return this.getState('titleScreen'); }

  public get openingScreen(): string[] { return this.getState('openingScreens')[this.getState('openingPage')]; }

  public get locationStatusScreen(): string[] {
    const name = 'nowhere';
    const exits = 'nowhere';
    const contents = ['   nothing of interest'];
    return ([
      `You are ${name}.`,
      `You can go: ${exits}`,
      `You can see:`
    ]).concat(contents);
  }

  public get playerStatusScreen(): string[] {
    const inventory = ['   nothing'];
    const remainingCarry = 0;
    return ([
      `You are carrying:`
    ]).concat(inventory).concat([
      `You can carry ${remainingCarry} more.`
    ]);
  }
}
