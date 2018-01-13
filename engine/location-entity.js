/**
 * Game object entity abstraction
 * @copyright   Bill Robitske, Jr. 2018
 * @author      Bill Robitske, Jr. <bill.robitske.jr@gmail.com>
 * @license     MIT
 */

import Entity from './entity.js'

/**
 * Game location entity class
 */
export default class LocationEntity extends Entity {

  /**
   * @typedef   {Entity.Config} ObjectEntity.Config
   * @property  {string}        name    - Display name for this location
   */

  /**
   * Create a new game object entity
   * @param {Object} config 
   */
  constructor(config = {}) {
    super(Object.assign({}, config, { type: 'object', states: [
      { key: 'name', isImmutable: true, value: config.name }
    ].concat(config.states || [])}));
  }

  /**
   * @property  {string}  name          - Display name for this object
   * @readonly
   */
  get name() { return this.getState('name'); }

  /**
   * Create a copy of this entity
   * @returns   {ObjectEntity}  - New copy of this entity
   */
  clone() {
    return new LocationEntity({
      id: this.id,
      name: this.name,
      states: this.states,
      actions: this.actions
    });
  }
}