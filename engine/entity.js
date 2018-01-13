/**
 * Game entity abstraction
 * @copyright   Bill Robitske, Jr. 2017-2018
 * @author      Bill Robitske, Jr. <bill.robitske.jr@gmail.com>
 * @license     MIT
 */

import Action from './action.js'

// Symbols for semi-private members
const _type = Symbol('type');
const _id = Symbol('id');
const _states = Symbol('states');
const _actions = Symbol('actions');

/**
 * Game entity class
 */
export default class Entity {

  /**
   * @typedef   Entity.StateDefinition
   * @property  {string}  key           - State key name
   * @property  {boolean} isImmutable   - State is immutable outside possessing entity
   * @property  {*}       value         - State value
   */

  /**
   * @typedef   Entity.Config
   * @property  {string}                    type    - Entity "class" (i.e. game, player, location, or object)
   * @property  {number}                    id      - Unique ID number
   * @property  {Entity.StateDefinition[]}  states  - Initial entity states
   */

  /**
   * Create a new game entity
   * @param     {Entity.Config}   config      - Configuration for this entity
   */
  constructor(config = {}) {
    this[_type] = config.type || this[_type] || 'generic';
    this[_id] = config.id || this[_id] || 0;
    this[_states] = (config.states || []).reduce((states, state) => {
      states[state.key] = { isImmutable: !!state.isImmutable, value: state.value };
      return states;
    }, this[_states] || {});
    this[_actions] = (config.actions || []).map(action => action instanceof Action ? action.cloneForActor(this) : new Action(this, action));
  }

  /**
   * @property  {string}  type  - Class of entity
   * @readonly
   */
  get type() { return this[_type]; }

  /**
   * @property  {number}  id    - Unique (within class) entity ID
   * @readonly
   */
  get id() { return this[_id]; }

  /**
   * @property  {Entity.StateDefinition[]}  states  - Definitions of this entity's current states
   * @readonly
   */
  get states() { return Object.keys(this[_states]).map(key => ({ key, isImmutable: this[_states][key].isImmutable, value: this[_states][key].value })); }

  /**
   * Get a state value of this entity
   * @param     {string}  key   - Key name of the desired state
   * @returns   {?*}            - This entity's state value for this key
   */
  getState(key) { return this[_states].hasOwnProperty(key) ? (typeof this[_states][key].value === 'function' ? this[_states][key].value(this) || null : this[_states][key].value) : null; }

  /**
   * Request an update a state value of this entity
   * @param     {string}  key         - Key name of the desired state
   * @param     {*}       value       - Desired new value for this state
   * @param     {Entity}  requester   - Entity requesting this change
   */
  updateState(key, value, requester) {
    if (!this[_states].hasOwnProperty(key)) this[_states][key] = { isImmutable: false, value: null };
    if (requester === this || !this[_states][key].isImmutable) this[_states][key] = value;
  }

  /**
   * @property  {string[]}  performableVerbs  - All verbs this entinty can perform an action for
   * @readonly
   */
  get performableVerbs() { return this[_actions].reduce((verbs, action) => verbs.concat(action.verbs), []); }

  /**
   * @property  {Action[]}  actions - Actions performable by this entity
   * @readonly
   */
  get actions() { return Array.from(this[_actions]); }

  /**
   * Get this entity's action associated with a verb
   * @param     {string}  verb  - Verb associated with the desired action
   * @returns   {?Action}       - This entity's action associated with this verb
   */
  getAction(verb) { return this[_actions].find(action => verb.match(action.verbExpression) !== null); }

  /**
   * Create a copy of this entity
   * @returns   {Entity}  - New copy of this entity
   */
  clone() {
    return new Entity({
      type: this[_type],
      id: this[_id],
      states: Object.keys(this[_states])
                    .map(key => ({ key, isImmutable: this[_states][key].isImmutable, value: this[_states][key].value })),
      actions: this[_actions]
    });
  }
}
