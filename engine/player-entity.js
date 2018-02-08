/**
 * Caves Engine: Game Player Entity
 * @copyright Bill Robitske, Jr. 2018
 * @author    Bill Robitske, Jr. <bill.robitske.jr@gmail.com>
 * @license   MIT
 */

import Entity from './entity.js';
import Command from './command.js';
import Action from './action.js';
import LocationEntity from './location-entity.js';

/**
 * Player entity class
 */
export default class PlayerEntity extends Entity {

  /**
   * Create a new player entity
   * @param {Object} config - Player entity configuration
   * @param {GameEntity} game - Current game entity
   */
  constructor(config, game) {
    super(config);
    this._game = game;
    this.setState('inventory', []);
    this.setState('maxCarry', config.maxCarry || 0);
    this.setState('location', config.location || 1);
    this._actions = ACTIONS.concat(config.actions || []).map(action => new Action(action));
  }

  get inventory() { return this.getState('inventory'); }

  /**
   * @property {number} maxCarry - Maximum number of objects this player can carry
   * @readonly
   */
  get maxCarry() { return this.getState('maxCarry'); }

  /**
   * @property {LocationEntity} location - This player's current location
   */
  get location() { return this._game.locations.getByID(this.getState('location')); }
  set location(value) {
    if (!(value instanceof LocationEntity)) throw new TypeError(`Value is not an instance of LocationEntity.`);
    this.setState('location', value.id);
  }

  /**
   * Perform a command
   * @param {Command} command - Command to attempt to perform
   * @returns {string[]} - Lines of output to display
   */
  perform(command) {
    if (!(command instanceof Command)) return;
    const action = this.getAction(command.verb);
    if (!action) return [ `You don't know how to do that!` ];
    const { stop, output } = action.start(this, command, this._game);
    if (stop) return output || [];
    const completeOutput = action.complete(this, command, this._game);
    return [].concat(output, completeOutput);
  }

  /**
   * Get this player's action associated with a verb, if any
   * @param {string} verb - Verb to get an action for
   * @return {?Action} - Action associated with this verb
   */
  getAction(verb) {
    return this._actions.find(action => action.verbTest.test(verb)) || null;
  }
}

/**
 * Built-in/engine-defined player actions
 * @type {Object[]}
 * @private
 * @readonly
 */
const ACTIONS = [
  {
    verbs: ['go'],
    start: (actor, command, game) => {
      const direction = command.nounPhrase;
      const exit = actor.location.exits.find(exit => exit.direction === direction);
      if (exit) {
        return { output: [ exit.transition || `You head ${direction}...`] };
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
