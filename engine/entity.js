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
  constructor(config = {}) {
    this._id = config.id || 0;
    this._name = config.name || '';
    this._tag = config.tag || '';

    this._identity = Object.assign({}, config.identity || {});
    this._state = Object.assign({}, config.state || {});

    this._actions = Object.assign({}, config.actions || {});
    this._reactions = Object.assign({}, config.reactions || {});
  }

  get id() { return this._id; }
  get name() { return this._name; }
  get tag() { return this._tag; }

  get identity() { return Object.assign({}, this._identity); } // Immutable details
  get state() { return Object.assign({}, this._state); }    // Mutable details

  updateState(patch) { this._state = Object.assign({}, this.state, patch); }

  get actions() { return this._actions; }
  get reactions() { return this._reactions; }

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