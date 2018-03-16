import Entity from './entity';
import { EntityConfig } from './entity';
import GameEntity from './game-entity';
import ObjectEntity from './object-entity';
import LocationEntity from './location-entity';
import Command from './command';

export interface PlayerEntityConfig extends EntityConfig {
  maxCarry?: number;
  location?: number;
}

export interface BehaviorFunc {
  (): string[]
}

export interface BehaviorMapping {
  verbExpression: RegExp;
  mounExpression?: RegExp;
  behaviorKey: string;
  behaviorPropertyMapper: BehaviorPropertyMapper;
}

export interface BehaviorPropertyMapper {
  (command: Command, self: PlayerEntity): any[];
}

export interface BehaviorsDict {
  [key: string]: (...params: any[]) => string[];
}

export default class PlayerEntity extends Entity {
  private readonly gameEntity: GameEntity;

  constructor(config: PlayerEntityConfig, gameEntity: GameEntity) {
    super(config);
    this.gameEntity = gameEntity;

    this.setState('maxCarry', config.maxCarry || 0);
    this.setState('location', config.location || 1);
    this.setState('inventory', []);
  }

  public get inventory(): ObjectEntity[] {
    const inventory = this.getState('inventory');
    return this.gameEntity.objects.findAll(object => inventory.indexOf(object.id) !== -1);
  }
  public set inventory(value: ObjectEntity[]) {
    this.setState('inventory', value.map(object => object.id));
  }

  public get location(): LocationEntity|null {
    return this.gameEntity.locations.findOne(location => location.id === this.getState('location'));
  }

  public getBehaviorForCommand(command: Command): BehaviorFunc|null {
    const mapping = PlayerEntity.defaultBehaviorMappings.filter(mapping => mapping.verbExpression.test(command.verbPhrase))[0];
    if (!mapping) return null;
    const behavior = PlayerEntity.defaultBehaviors[mapping.behaviorKey];
    if (!behavior) return null;
    return () => behavior.apply(this, mapping.behaviorPropertyMapper(command, this));
  }

  public static get defaultBehaviorMappings(): BehaviorMapping[] {
    return [
      { verbExpression: /^go$/i, behaviorKey: 'move', behaviorPropertyMapper: (command, self) => [command.nounPhrase, self] },
      { verbExpression: /^(get|take)$/i, behaviorKey: 'get', behaviorPropertyMapper: (command, self) => {
        const object = self.gameEntity.objects.findOne(object => object.nounExpression.test(command.nounPhrase) && (object.location === self.location || self.inventory.indexOf(object) !== -1));
        return [object, self];
      } }
    ];
  }

  public static get defaultBehaviors(): BehaviorsDict {
    return {
      move: (direction: string, self: PlayerEntity): string[] => {
        if (!self.location) return [`You can't move!`];
        const exit = self.location.exits.filter(exit => exit.direction === direction)[0];
        if (!exit) return [`You can't go there.`];
        self.setState('location', exit.destination);
        const location = self.location || { name: 'nowhere' };
        return [
          `You head ${direction}.`,
          `You are ${location.name}.`
        ];
      },
      get: (object: ObjectEntity|null, self: PlayerEntity): string[] => {
        if (!object) return [`You can't get that.`];
        if (self.inventory.indexOf(object) !== -1) return [`You are already carrying ${object.name}.`];
        object.location = null;
        const inventory = self.inventory;
        inventory.push(object);
        self.inventory = inventory;
        return [`You pick up ${object.name}.`];
      }
    }
  }
}