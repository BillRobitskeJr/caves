/**
 * Caves Engine: Game Entity Action
 * @copyright Bill Robitske, Jr. 2018
 * @author    Bill Robitske, Jr. <bill.robitske.jr@gmail.com>
 * @license   MIT
 */

/**
 * Game entity action class
 */
export default class Action {

  /**
   * Create a new action
   * @constructor
   * @param {Object} config - Action configuration
   */
  constructor(config = {}) {
    this._verbs = config.verbs || [];
    this._start = config.start || null;
    this._complete = config.complete || null;
  }

  /**
   * @property {RegExp} verbTest - Regular expression matching verbs to this action
   * @readonly
   */
  get verbTest() { return new RegExp(`(${this._verbs.join('|')})`, 'i'); }

  /**
   * @typedef {Object} Action.ActionStartResponse
   * @property {boolean} stop - This action should be stopped without completing
   * @property {string[]} output - Lines of output to be displayed
   */

  /**
   * Start performing this action
   * @param {Entity} actor - Entity performing this action
   * @param {Command} command - Command triggering this action
   * @param {GameEntity} game - Current game entity
   * @returns {Action.ActionStartResponse} - Response to starting this action
   */
  start(actor, command, game) {
    if (typeof this._start !== 'function') return { stop: false, output: [] };
    const { stop, output } = this._start(actor, command, game);
    return { stop: !!stop, output: output || [] };
  }

  /**
   * Complete performing this action
   * @param {Entity} actor - Entity performing this action
   * @param {Command} command - Command triggering this action
   * @param {GameEntity} game - Current game entity
   * @returns {string[]} - Lines of output to be displayed
   */
  complete(actor, command, game) {
    if (typeof this._complete !== 'function') return [];
    return this._complete(actor, command, game) || [];
  }
}
