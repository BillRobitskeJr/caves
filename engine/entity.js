/**
 * Game entity abstraction
 * @copyright   Bill Robitske, Jr. 2017-2018
 * @author      Bill Robitske, Jr. <bill.robitske.jr@gmail.com>
 * @license     MIT
 */

/**
 * Game entity class
 */
export default class Entity {

  /**
   * Create a new game entity
   * @param   {Object}                            [config]            - Initialization values
   * @param   {number}                            [config.id]         - ID of this entity
   * @param   {string}                            [comfig.name]       - Human-readable name of this entity
   * @param   {string}                            [config.tag]        - Tag associated with this entity
   * @param   {Object.<string, *>}                [config.identity]   - Immutable state
   * @param   {Object.<string, *>}                [config.state]      - Mutable state
   * @param   {Object.<string, Action~callback>}  [config.actions]    - Actions related to this entity
   * @param   {Object.<string, Action~callback>}  [config.reactions]  - Action reactions related to this entity
   */
  constructor(config = {}) {
    this._id = config.id || 0;
    this._name = config.name || '';
    this._tag = config.tag || '';

    this._identity = Object.assign({}, config.identity || {});
    this._state = Object.assign({}, config.state || {});

    this._actions = Object.assign({}, config.actions || {});
    this._reactions = Object.assign({}, config.reactions || {});
  }

  /**
   * @property  {number}  id    - This entity's ID
   * @readonly
   */
  get id() { return this._id; }

  /**
   * @property  {string}  name  - This entity's human-readable name
   * @readonly
   */
  get name() { return this._name; }

  /**
   * @property  {string}  tag   - This entity's tag
   * @readonly
   */
  get tag() { return this._tag; }

  /**
   * @property  {Object.<string, *>}  identity  - This entity's immutable state
   * @readonly
   */
  get identity() { return Object.assign({}, this._identity); }

  /**
   * @property  {Object.<string, *>}  state     - This entity's mutable state
   * @readonly
   */
  get state() { return Object.assign({}, this._state); }

  /**
   * Apply changes to this entity's mutable state
   * @param {Object.<string, *>}  patch - Changes to apply
   */
  updateState(patch) { this._state = Object.assign({}, this.state, patch); }

  /**
   * @property  {Object.<string, Action~callback>}  actions   - Actions related to this entity
   * @readonly
   */
  get actions() { return this._actions; }

  /**
   * @property  {Object.<string, Action~callback>}  reactions - Reactions related to this entity
   * @readonly
   */
  get reactions() { return this._reactions; }

  /**
   * Create a copy of this entity
   * @returns   {Entity}  - New copy of this entity
   */
  clone() {
    return new Entity({
      id: this._id,
      name: this._name,
      tag: this._tag,
      identity: this._identity,
      state: this._state,
      actions: this._actions,
      reactions: this._reactions
    });
  }
}