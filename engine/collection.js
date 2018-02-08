/**
 * Caves Engine: Entity Collection
 * @copyright Bill Robitske, Jr. 2018
 * @author    Bill Robitske, Jr. <bill.robitske.jr@gmail.com>
 * @license   MIT
 */

/**
 * Entity collection class
 */
export default class Collection {

  /**
   * Create a new entity collection
   * @constructor
   * @param {Entity[]} entities - Entity to include in this collection
   */
  constructor(entities = []) {
    this._entities = entities;
  }

  /**
   * Get an entity from this collection by its ID
   * @param {number} id - Desired entity's ID
   * @returns {?Entity} - Requested entity, or null
   */
  getByID(id) {
    return this._entities.find(entity => entity.id === id) || null;
  }

  /**
   * Get entities from this collection that match a filter
   * @param {function} filter - Filter function
   * @returns {Entity[]} - Entities for which `filter` returns true
   */
  findEntities(filter = () => false) {
    return this._entities.filter(filter) || [];
  }

  /**
   * Get this first entity in this collection that matches a filter
   * @param {function} filter - Filter function
   * @returns {?Entity} - First entity found for which `filter` returns true
   */
  findEntity(filter = () => false) {
    return this._entities.find(filter) || null;
  }

  /**
   * Save this collection's entity's current state to a simple object for saving
   * @returns {Object.<number,Object.<string,*>>} - Collection entity state values
   */
  serialize() {
    return this._entities.reduce((states, entity) => {
      states[entity.id] = entity.serialize();
      return states;
    }, {});
  }

  /**
   * Set this collection's entity's current state based on previous serialization
   * @param {Object.<number,Object.<string,*>>} states - Collection entity state values
   */
  deserialize(states) {
    Object.keys(states).forEach(id => {
      const entity = this.getByID(id);
      if (entity) entity.deserialize(states[id]);
    });
  }
}
