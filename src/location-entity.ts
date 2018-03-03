import Entity from './entity';
import { EntityConfig } from './entity';
import GameEntity from './game-entity';
import ObjectEntity from './object-entity';

export interface LocationExit {
  direction: string;
  destination: number;
}

export interface LocationEntityConfig extends EntityConfig {
  id: number;
  name: string;
  exits?: LocationExit[];
}

export default class LocationEntity extends Entity {
  private readonly gameEntity: GameEntity;

  constructor(config: LocationEntityConfig, gameEntity: GameEntity) {
    super(config);
    this.gameEntity = gameEntity;

    this.setState('id', config.id);
    this.setState('name', config.name);
    this.setState('exits', config.exits || []);
  }

  public get id(): number { return this.getState('id'); }

  public get name(): string { return this.getState('name'); }

  public get exits(): LocationExit[] { return this.getState('exits'); }

  public get contents(): ObjectEntity[] { return this.gameEntity.objects.findAll(object => object.getState('location') === this.id); }
}