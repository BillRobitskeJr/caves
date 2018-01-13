/**
 * Entity collection abstraction
 * @copyright   Bill Robitske, Jr. 2018
 * @author      Bill Robitske, Jr. <bill.robitske.jr@gmail.com>
 * @license     MIT
 */

import Entity from './entity.js'

// Symbols for semi-private members
const _entities = Symbol('entities');

/**
 * Entity collection class
 */
export default class Collection {

  /**
   * Create a new entity collection
   * @param     {Entity[]}  entities      - Entity configurations
   */
  constructor(entities = []) {
    this[_entities] = entities
      .reduce((entities, entity) => {
        entities[entity.id] = entity;
        return entities;
      }, {});
  }

  /**
   * Get the entity associated with this unique ID
   * @param     {number}    id  - Unique ID of the desired entity
   * @returns   {?Entity}       - Requested entity, or null
   */
  getEntity(id) { return this[_entities].hasOwnProperty(id) ? this[_entities][id] : null; }

  /**
   * @callback  Collection.FindCallback
   * @param     {Entity}  entity  - Entity to test
   * @returns   {boolean}         - Entity should be included in this find
   */

  /**
   * Get a single entity in this collection matching a test
   * @param     {Collection.FindCallback} test  - Function to test entities
   * @returns   {?Entity}                       - Matching entity, if any
   */
  findEntity(test = (() => false)) {
    return Object.keys(this[_entities]).map(id => this[_entities][id]).find(test);
  }

  /**
   * Get all entities in this collection matching a test
   * @param     {Collection.FindCallback} test  - Function to test entities
   * @returns   {Entity[]}                      - Matching entities
   */
  findEntities(test = (() => false)) {
    return Object.keys(this[_entities]).map(id => this[_entities][id]).filter(test);
  }

  /**
   * Create a copy of this collection and it's entities
   * @returns   {Collection}  - New copy of this collection
   */
  clone() {
    return new Collection(Object.keys(this[_entities])
                                .map(id => this[_entities][id].clone()));
  }

  /**
   * Create a new collection from entity configurations
   * @param     {Object[]}  configs       - Configuration objects of the new entities
   * @param     {function}  constructor   - Class of the new entities
   * @param     {string}    [type]        - Type of the new entities
   */
  static createFromConfigs(configs = [], constructor = Entity, type) {
    return new Collection(configs.map(config => new constructor(Object.assign({ type }, config))));
  }
}
