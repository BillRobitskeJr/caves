/**
 * Game entity collection abstraction
 * @copyright   Bill Robitske, Jr. 2018
 * @author      Bill Robitske, Jr. <bill.robitske.jr@gmail.com>
 * @license     MIT
 */

import Entity from './entity.js'

/**
 * Entity collection class
 */
export default class Collection {

  /**
   * Create a new entity collection
   * @param   {Object[]}  items - Items to include in this collection
   * @param   {function}  type  - Class of items
   */
  constructor(items = [], type = Entity) {
    this._type = type;
    this._items = items.map(item => item instanceof type && typeof item.clone === 'function' ? item.clone() : new type(item));
  }

  /**
   * Get an entity from this collection by its ID
   * @param   {number}  id  - ID of the desired entity
   * @returns {?Entity}     - Desired entity, or null
   */
  getItem(id) {
    return this._items.find(item => item.id === id) || null;
  }

  /**
   * Get an entity from this collection by its tag
   * @param   {string}  tag - Tag associated with desired entity
   * @returns {?Entity}     - Desired entity, if any
   */
  getItemByTag(tag) {
    return this._items.find(item => item.tag instanceof RegExp ? tag.match(item.tag) !== null : item.tag === tag) || null;
  }

  /**
   * Get entities from this collection matching a state
   * @param   {Object.<string, *>}  state - State values for testing entities
   * @returns {Entity[]}                  - Entities matching the state
   */
  getItemsByState(state = {}) {
    const keys = Object.keys(state);
    return this._items.filter(item => keys.reduce((testValue, key) => testValue && item.state[key] === state[key], true));
  }

  /**
   * Make updates to this collection's entities' states
   * @param   {Object.<number, Object.<string, *>>} changes - Desired state changes
   */
  updateStates(changes = {}) {
    Object.keys(changes).forEach(id => {
      this.getItem(parseInt(id)).updateState(changes[id]);
    });
  }

  /**
   * Create a copy of this collection and its entities
   * @returns   {Collection}  - New copy of this collection
   */
  clone() {
    return new Collection(this._items, this._type);
  }
}
