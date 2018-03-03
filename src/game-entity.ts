import Entity from './entity';
import { EntityConfig } from './entity';
import PlayerEntity from './player-entity';
import LocationEntity from './location-entity';
import ObjectEntity from './object-entity';
import Collection from './collection';

export interface GameEntityConfig extends EntityConfig {
  titleScreen?: string[];
  openingScreens?: string[][];
}

export default class GameEntity extends Entity {
  private playerEntity: PlayerEntity;
  private locationEntities: Collection<LocationEntity>;
  private objectEntities: Collection<ObjectEntity>;

  constructor(config: GameEntityConfig) {
    super(config);
    this.setState('titleScreen', config.titleScreen || ['']);
    this.setState('openingScreens', config.openingScreens || [['']]);

    this.setState('openingPage', 0);
  }

  public get player(): PlayerEntity { return this.playerEntity; }
  public set player(playerEntity: PlayerEntity) { this.playerEntity = playerEntity; }

  public get locations(): Collection<LocationEntity> { return this.locationEntities; }
  public set locations(locationEntities: Collection<LocationEntity>) { this.locationEntities = locationEntities; }

  public get objects(): Collection<ObjectEntity> { return this.objectEntities; }
  public set objects(objectEntities: Collection<ObjectEntity>) { this.objectEntities = objectEntities; }

  public get titleScreen(): string[] { return this.getState('titleScreen'); }

  public get openingScreen(): string[] { return this.getState('openingScreens')[this.getState('openingPage')]; }

  public get locationStatusScreen(): string[] {
    const location = this.player.location;
    const exits = location ? location.exits : [];
    const exitDirections = exits.length > 0 ? exits.map(exit => exit.direction).join(', ') : 'nowhere';
    const contents = location ? location.contents : [];
    const contentNames = contents.length > 0 ? contents.map(object => `   ${object.name}`) : '   nothing of interest';
    // const contents = ['   nothing of interest'];
    return ([
      `You are ${location ? location.name : 'nowhere'}.`,
      `You can go: ${exitDirections}`,
      `You can see:`
    ]).concat(contentNames);
  }

  public get playerStatusScreen(): string[] {
    const inventory = this.player.inventory;
    const carryNames = inventory.length > 0 ? inventory.map(object => `   ${object.name}`) : ['   nothing'];
    const remainingCarry = this.player.getState('maxCarry') - inventory.length;
    return ([
      `You are carrying:`
    ]).concat(carryNames).concat([
      `You can carry ${remainingCarry} more.`
    ]);
  }
}
