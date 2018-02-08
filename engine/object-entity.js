/**
 * Caves Engine: Game Object Entity
 * @copyright Bill Robitske, Jr. 2018
 * @author    Bill Robitske, Jr. <bill.robitske.jr@gmail.com>
 * @license   MIT
 */

import Entity from './entity.js';
import LocationEntity from './location-entity.js';

/**
 * Game object entity class
 */
export default class ObjectEntity extends Entity {

  /**
   * Create a new object entity
   * @constructor
   * @param {Object} config - Object entity configuration
   * @param {GameEntity} game - Current game entity
   */
  constructor(config = {}, game) {
    super(config);
    this._game = game;
    this.setState('id', config.id || 0);
    this.setState('name', config.name || 'nothing');
    this.setState('tags', config.tags || []);
    this.setState('location', config.location || null);
  }

  /**
   * @property {number} id - Unique object identifier number
   * @readonly
   */
  get id() { return this.getState('id'); }

  /**
   * @property {string} name - Name of this object
   * @readonly
   */
  get name() { return this.getState('name'); }

  /**
   * @property {RegExp} tagsExpression - Regular expression for matching this object in noun phrases
   * @readonly
   */
  get tagsExpression() { return new RegExp(`^(${this.getState('tags').join('|')})$`, 'i'); }

  /**
   * @property {?LocationEntity} location - Current location of this object
   */
  get location() { return this._game.locations.getByID(this.getState('location') || 0); }
  set location(value) {
    if (!(value instanceof LocationEntity) && value !== null) throw new TypeError(`Value is not an instance of LocationEntity or null.`);
    this.setState('location', value ? value.id : null);
  }
}
