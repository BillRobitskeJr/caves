/**
 * Game action abstraction
 * @copyright   Bill Robitske, Jr. 2018
 * @author      Bill Robitske, Jr. <bill.robitske.jr@gmail.com>
 * @license     MIT
 */

/**
 * Action class
 */
export default class Action {

  /**
   * @typedef   Action~stateChanges
   * @property  {boolean}                             [abort]     - Abort the current action after this "stage" (pre-action, action, or post-action)
   * @property  {Object.<string, *>}                  [game]      - Game state changes
   * @property  {Object.<string, *>}                  [player]    - Player state changes
   * @property  {Object.<number, Object.<string, *>>} [locations] - Location state changes
   * @property  {Object.<number, Object.<string, *>>} [objects]   - Object state changes
   */

  /**
   * @callback  Action~callback
   * @param   {EngineCore~output}                 output    - Main output interface
   * @param   {{action: string, object: string}}  command   - Parsed player-entered command
   * @param   {Entity}                            location  - Current location entity
   * @param   {Entity}                            object    - Action's target object entity
   * @param   {Entity}                            game      - Game entity
   * @param   {Entity}                            player    - Player entity
   * @param   {Collection}                        locations - All location entities
   * @param   {Collection}                        objects   - All object entities
   * @returns {Action~stateChanges}                         - Changes to apply to entity states
   */

  /**
   * Create a new action
   * @param   {Object}          [config]
   * @param   {string[]}        [config.tags]
   * @param   {string}          [config.tag]
   * @param   {Action~callback} [config.action]
   */
  constructor(config = {}) {
    this._tags = config.tags || [config.tag]
    this._action = config.action || (() => {});
  }

  /**
   * @property  {string[]}  tags  - All possible command action tags for this action
   * @readonly
   */
  get tags() { return [].concat(this._tags); }

  /**
   * @property  {RegExp}    tag   - Command action tag matching expression
   * @readonly
   */
  get tag() { return new RegExp(`^(${this._tags.join('|')})`); }

  /**
   * Perform this action
   * @param   {EngineCore~output}                 output    - Main output interface
   * @param   {{action: string, object: string}}  command   - Parsed player-entered command
   * @param   {Entity}                            location  - Current location entity
   * @param   {Entity}                            object    - Action's target object entity
   * @param   {Entity}                            game      - Game entity
   * @param   {Entity}                            player    - Player entity
   * @param   {Collection}                        locations - All location entities
   * @param   {Collection}                        objects   - All object entities
   * @returns {Action~stateChanges}                         - Changes to apply to entity states
   */
  perform(output, command, location, object, game, player, locations, objects) {
    // Clone current state (avoid premature overwrites)
    const primaryTag = this._tags[0];
    const _game = game.clone();
    const _player = player.clone();
    const _locations = locations.clone();
    const _objects = objects.clone();
    const _location = location ? _locations.getItem(location.id) : null;
    const _object = object ? _objects.getItem(object.id) : null;
    
    let changes = {};
    
    // Perform "pre-action" and gather state changes
    // if (_game.preactions.hasOwnProperty(primaryTag)) changes = Object.assign(changes, _game.preActions[primaryTag](output, command, location, object, game, player, locations, objects));
    // if (_player.preactions.hasOwnProperty(primaryTag)) changes = Object.assign(changes, _game.preActions[primaryTag](output, command, location, object, game, player, locations, objects));
    // if (_location && _location.preactions.hasOwnProperty(primaryTag)) changes = Object.assign(changes, _game.preActions[primaryTag](output, command, location, object, game, player, locations, objects));
    // if (_object && _object.preactions.hasOwnProperty(primaryTag)) changes = Object.assign(changes, _game.preActions[primaryTag](output, command, location, object, game, player, locations, objects));
    
    // Apply "pre-action" state changes
    // _game.updateState(changes.game || {});
    // _player.updateState(changes.player || {});
    // _locations.updateStates(changes.locations || {});
    // _objects.updateStates(changes.objects || {});
    // if (changes.abort) return changes;

    // Perform action and gather state changes
    changes = Object.assign(changes, this._action(output, command, location, object, game, player, locations, objects));
    if (_game.actions.hasOwnProperty(primaryTag)) changes = Object.assign(changes, _game.actions[primaryTag](output, command, location, object, game, player, locations, objects));
    if (_player.actions.hasOwnProperty(primaryTag)) changes = Object.assign(changes, _game.actions[primaryTag](output, command, location, object, game, player, locations, objects));
    if (_location && _location.actions.hasOwnProperty(primaryTag)) changes = Object.assign(changes, _game.actions[primaryTag](output, command, location, object, game, player, locations, objects));
    if (_object && _object.actions.hasOwnProperty(primaryTag)) changes = Object.assign(changes, _game.actions[primaryTag](output, command, location, object, game, player, locations, objects));
    
    // Apply "action" state changes
    _game.updateState(changes.game || {});
    _player.updateState(changes.player || {});
    _locations.updateStates(changes.locations || {});
    _objects.updateStates(changes.objects || {});
    if (changes.abort) return changes;

    if (_game.reactions.hasOwnProperty(primaryTag)) changes = Object.assign(changes, _game.postActions[primaryTag](output, command, location, object, game, player, locations, objects));
    if (_player.reactions.hasOwnProperty(primaryTag)) changes = Object.assign(changes, _game.postActions[primaryTag](output, command, location, object, game, player, locations, objects));
    if (_location && _location.reactions.hasOwnProperty(primaryTag)) changes = Object.assign(changes, _game.postActions[primaryTag](output, command, location, object, game, player, locations, objects));
    if (_object && _object.reactions.hasOwnProperty(primaryTag)) changes = Object.assign(changes, _game.postActions[primaryTag](output, command, location, object, game, player, locations, objects));

    return changes;
  }
}