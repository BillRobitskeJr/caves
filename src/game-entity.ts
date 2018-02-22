import Entity from './entity';
import { EntityConfig } from './entity';

export interface GameEntityConfig extends EntityConfig {
  titleScreen?: string[];
  openingScreens?: string[][];
}

export default class GameEntity extends Entity {
  constructor(config: GameEntityConfig) {
    super(config);
    this.setState('titleScreen', config.titleScreen || ['']);
    this.setState('openingScreens', config.openingScreens || [['']]);

    this.setState('openingPage', 0);
  }

  public get titleScreen(): string[] { return this.getState('titleScreen'); }

  public get openingScreen(): string[] { return this.getState('openingScreens')[this.getState('openingPage')]; }
}
