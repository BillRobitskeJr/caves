/**
 * Game object entity abstraction
 * @copyright   Bill Robitske, Jr. 2018
 * @author      Bill Robitske, Jr. <bill.robitske.jr@gmail.com>
 * @license     MIT
 */

import Entity from './entity.js'

/**
 * Game object entity class
 */
export default class ObjectEntity extends Entity {

  /**
   * @typedef   {Entity.Config} ObjectEntity.Config
   * @property  {string}        name    - Display name for this object
   * @property  {string[]}      tags    - Tags for identifying this object in command predicates
   */

  /**
   * Create a new game object entity
   * @param {Object} config 
   */
  constructor(config = {}) {
    super(Object.assign({}, config, { type: 'object', states: [
      { key: 'name', isImmutable: true, value: config.name },
      { key: 'tags', isImmutable: true, value: config.tags }
    ].concat(config.states || [])}));
  }

  /**
   * @property  {string}  name          - Display name for this object
   * @readonly
   */
  get name() { return this.getState('name'); }

  /**
   * @property  {RegExp}  tagExpression - Regular expression for matching this object in command predicates
   * @readonly
   */
  get tagExpression() { return new RegExp(`(${this.getState('tags').join('|')})`, 'i'); }

  /**
   * Create a copy of this entity
   * @returns   {ObjectEntity}  - New copy of this entity
   */
  clone() {
    return new ObjectEntity({
      id: this.id,
      name: this.name,
      tags: this.tags,
      states: this.states,
      actions: this.actions,
      reactions: this.reactions
    });
  }
}