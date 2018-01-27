
import Entity from './entity.js';
import Command from './command.js';
import Action from './action.js';
import LocationEntity from './location-entity.js';

export default class PlayerEntity extends Entity {

  constructor(config, game) {
    super(config);
    this._game = game;
    this._inventory = [];
    this._maxCarry = config.maxCarry || 0;
    this._location = config.location || 1;
    this._actions = ACTIONS.concat(config.actions || []).map(action => new Action(action));
  }

  get inventory() { return this._inventory; }

  get maxCarry() { return this._maxCarry; }

  get location() { return this._game.locations.getByID(this._location); }

  set location(value) {
    if (!(value instanceof LocationEntity)) throw new TypeError(`Value is not an instance of LocationEntity.`);
    this._location = value.id;
  }

  perform(command) {
    if (!(command instanceof Command)) return;
    const action = this.getAction(command.verb);
    if (!action) return [ `You don't know how to do that!` ];
    const { stop, output } = action.start(this, command, this._game);
    if (stop) return output || [];
    const completeOutput = action.complete(this, command, this._game);
    return [].concat(output, completeOutput);
  }

  getAction(verb) {
    return this._actions.find(action => action.verbTest.test(verb)) || null;
  }
}

const ACTIONS = [
  {
    verbs: ['go'],
    start: (actor, command, game) => {
      const direction = command.nounPhrase;
      if (actor.location.exits.find(exit => exit.direction === direction)) {
        return { output: [`You head ${direction}...`] };
      } else {
        return { stop: true, output: [`You can't go that way!`] };
      }
    },
    complete: (actor, command, game) => {
      const direction = command.nounPhrase;
      const exit = actor.location.exits.find(exit => exit.direction === direction);
      const destination = game.locations.getByID(exit.destination);
      actor.location = destination;
      return [`You are ${destination.name}.`];
    }
  }
];
