import Entity from './entity';
import { EntityConfig } from './entity';
import GameEntity from './game-entity';
import LocationEntity from './location-entity';

export interface ObjectEntityConfig extends EntityConfig {
  id: number;
  name: string;
  tags: string[];
  location?: number;
}

export default class ObjectEntity extends Entity {
  private readonly gameEntity: GameEntity;

  constructor(config: ObjectEntityConfig, gameEntity: GameEntity) {
    super(config);
    this.gameEntity = gameEntity;

    this.setState('id', config.id);
    this.setState('name', config.name);
    this.setState('tags', config.tags);
    this.setState('location', config.location || null);
  }

  public get id(): number { return this.getState('id'); }

  public get name(): string { return this.getState('name'); }

  public get location(): LocationEntity|null {
    return null;
  }
}