/**
 * Caves Engine: Game Entity
 * @copyright Bill Robitske, Jr. 2018
 * @author    Bill Robitske, Jr. <bill.robitske.jr@gmail.com>
 * @license   MIT
 */

import Entity from './entity.js';
import Collection from './collection.js';
import PlayerEntity from './player-entity.js';

/**
 * Game entity class
 */
export default class GameEntity extends Entity {

  /**
   * Create a new game entity
   * @constructor
   * @param {Object} config - Game entity configuration
   */
  constructor(config) {
    super(config);
    this._playerEntity = null;
    this._locationsCollection = null;
    this._objectsCollection = null;
    this._menuScreen = config.menuScreen || [];
    this._openingScreens = config.openingScreens || [];
    this._currentOpeningPage = 0;
  }

  /**
   * @property {PlayerEntity} player - This game's player entity
   */
  get player() { return this._playerEntity; }
  set player(value) {
    if (!(value instanceof PlayerEntity)) throw new TypeError(`Value is not an instance of PlayerEntity.`);
    this._playerEntity = value;
  }

  /**
   * @property {Collection} locations - This game's location entities collection
   */
  get locations() { return this._locationsCollection; }
  set locations(value) {
    if (!(value instanceof Collection)) throw new TypeError(`Value is not an instance of Collection.`);
    this._locationsCollection = value;
  }

  /**
   * @property {Collection} objects - This game's object entities collection
   */
  get objects() { return this._objectsCollection; }
  set objects(value) {
    if (!(value instanceof Collection)) throw new TypeError(`Value is not an instance of Collection.`);
    this._objectsCollection = value;
  }

  /**
   * @property {string[]} menuScreen - Lines of this game's title menu screen
   * @readonly
   */
  get menuScreen() { return this._menuScreen; }

  /**
   * @property {string[]} openingScreen - Lines of the current opening screen
   * @readonly
   */
  get openingScreen() { return this._openingScreens[this._currentOpeningPage] || []; }

  /**
   * @property {string[]} locationScreen - Lines of the current location screen
   */
  get locationScreen() {
    const location = this._playerEntity.location || { name: 'nowhere', exits: [], contents: [] };
    const exits = location.exits.map(exit => exit.direction).join(', ');
    const contents = location.contents.map(object => `   ${object.name}`).join('\n');
    const lines = [
      `You are ${location.name}.`,
      `You can go: ${exits || 'nowhere'}`,
      `You can see:`,
      `${contents || '   nothing of interest'}`
    ];
    return lines.join('\n');
  }

  /**
   * @property {string[]} playerScreen - Lines of the player status screen
   */
  get playerScreen() {
    const player = this._playerEntity || { inventory: [], maxCarry: 0 };
    const inventory = player.inventory.map(object => `   ${object.name}`).join('\n');
    const lines = [
      `You are carrying:`,
      `${inventory || '   nothing'}`,
      `You can carry ${player.maxCarry - player.inventory.length} more.`
    ];
    return lines.join('\n');
  }

  /**
   * Reset this game's opening to start on the first page
   */
  resetOpening() {
    this._currentOpeningPage = 0;
  }

  /**
   * Advance this game's opening to the next page
   * @returns {boolean} - The opening is complete
   */
  advanceOpening() {
    this._currentOpeningPage++;
    return this._currentOpeningPage >= this._openingScreens.length;
  }

  /**
   * Save this game entity's current state to a simple object for saving
   * @returns {Object} - Game entity state values
   */
  serialize() {
    const states = {
      game: super.serialize(),
      player: this._playerEntity.serialize(),
      locations: this._locationsCollection.serialize()
    };
    return states;
  }

  /**
   * Set this game entity's current state based on previous serialization
   * @param {Object} states - Game entity state values
   */
  deserialize(states) {
    super.deserialize(states.game);
    this._playerEntity.deserialize(states.player);
    this._locationsCollection.deserialize(states.locations);
  }
}
