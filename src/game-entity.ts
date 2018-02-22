import Entity from './entity';
import { EntityConfig } from './entity';

export interface GameEntityConfig extends EntityConfig {
  titleScreen?: string[];
}

export default class GameEntity extends Entity {
  constructor(config: GameEntityConfig) {
    super(config);
    this.setState('titleScreen', config.titleScreen || ['']);
  }

  public get titleScreen(): string[] { return this.getState('titleScreen'); }
}
