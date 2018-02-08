/**
 * Caves Engine: Game Entity
 * @copyright Bill Robitske, Jr. 2018
 * @author    Bill Robitske, Jr. <bill.robitske.jr@gmail.com>
 * @license   MIT
 */

/**
 * Game entity class
 */
export default class Entity {

  /**
   * Create a new game entity
   * @constructor
   * @param {Object} config - Entity configuration
   */
  constructor(config = {}) {
    this._states = (config.states || []).reduce((states, state) => {
      states[state.name] = state.value;
      return states;
    }, {});
  }

  /**
   * Get the value of one of this entity's states
   * @param {string} name - Name of the desired state
   */
  getState(name) {
    if (!this._states.hasOwnProperty(name)) return null;
    if (typeof this._states[name].value === 'function') return this._states[name].value.call(this);
    return this._states[name].value;
  }

  /**
   * Set the value of one of this entity's states
   * @param {string} name - Name of the desired state
   * @param {*} value - Desired new value of the state
   */
  setState(name, value) {
    if (!this._states.hasOwnProperty(name)) this._states[name] = { value: null };
    this._states[name].value = value;
  }

  /**
   * Save this entity's current state to a simple object for saving
   * @returns {Object.<string,*>} - Entity state values
   */
  serialize() {
    return Object.keys(this._states).reduce((states, name) => {
      if (typeof this._states[name].value !== 'function') states[name] = this._states[name].value;
      return states;
    }, {});
  }

  /**
   * Set this entity's current state based on previous serialization
   * @param {Object.<string,*>} states - Entity state values
   */
  deserialize(states) {
    Object.keys(states).forEach(name => {
      this.setState(name, states[name]);
    });
  }
}
