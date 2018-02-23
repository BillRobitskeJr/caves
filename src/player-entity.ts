import Entity from './entity';
import { EntityConfig } from './entity';
import GameEntity from './game-entity';

export interface PlayerEntityConfig extends EntityConfig {
  maxCarry?: number;
  location?: number;
}

export default class PlayerEntity extends Entity {
  private readonly gameEntity: GameEntity;

  constructor(config: PlayerEntityConfig, gameEntity: GameEntity) {
    super(config);
    this.gameEntity = gameEntity;
    
    this.setState('maxCarry', config.maxCarry || 0);
    this.setState('location', config.location || 1);
  }

}