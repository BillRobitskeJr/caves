/**
 * Caves Engine: Game Location Entity
 * @copyright Bill Robitske, Jr. 2018
 * @author    Bill Robitske, Jr. <bill.robitske.jr@gmail.com>
 * @license   MIT
 */

import Entity from './entity.js';

/**
 * Location entity class
 */
export default class LocationEntity extends Entity {

  /**
   * Create a new location entity
   * @constructor
   * @param {Object} config - Location entity configuration
   * @param {GameEntity} game - Current game entity
   */
  constructor(config = {}, game) {
    super(config);
    this._game = game || null;
    this.setState('id', config.id || 0);
    this.setState('name', config.name || 'nowhere');
    this.setState('exits', config.exits || []);
    this.setState('contents', config.contents || []);
  }

  /**
   * @property {number} id - Unique location identifier number
   * @readonly
   */
  get id() { return this.getState('id'); }

  /**
   * @property {string} name - Name of this location
   * @readonly
   */
  get name() { return this.getState('name'); }

  /**
   * @property {Object[]} exits - Exits from this location
   * @readonly
   */
  get exits() { return this.getState('exits'); }

  /**
   * @property {ObjectEntity[]} contents - Objects in this location
   * @readonly
   */
  get contents() {
    return this._game.objects.findEntities(object => object.location && object.location.id === this.id);
  }
}
