import Entity from './entity';
import { GameEntityConfig } from './game-config';

export default class GameEntity extends Entity {

  constructor(config: GameEntityConfig = {}) {
    super(config);
  }
}
