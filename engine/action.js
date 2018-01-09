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
    this._completion = config.completion || (() => {});
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
    const _carriedObjects = _player.state.inventory.map(_carriedObject => _objects.getItem(_carriedObject));
    const _localObjects = _objects.getItemsByState({ room: _location.id });
    
    let changes = {};
    
    // Perform action and gather state changes
    changes = Object.assign(changes, this._action(output, command, _location, _object, _game, _player, _locations, _objects));
    if (_game.actions.hasOwnProperty(primaryTag)) changes = Object.assign(changes, _game.actions[primaryTag](output, command, _location, _object, _game, _player, _locations, _objects));
    if (_player.actions.hasOwnProperty(primaryTag)) changes = Object.assign(changes, _player.actions[primaryTag](output, command, _location, _object, _game, _player, _locations, _objects));
    if (_location && _location.actions.hasOwnProperty(primaryTag)) changes = Object.assign(changes, _location.actions[primaryTag](output, command, _location, _object, _game, _player, _locations, _objects));
    if (_object && _object.actions.hasOwnProperty(primaryTag)) changes = Object.assign(changes, _object.actions[primaryTag](output, command, _location, _object, _game, _player, _locations, _objects));
    if (!changes.abort) changes = Object.assign(changes, this._completion(output, command, _location, _object, _game, _player, _locations, _objects));
    
    // Apply "action" state changes
    _game.updateState(changes.game || {});
    _player.updateState(changes.player || {});
    _locations.updateStates(changes.locations || {});
    _objects.updateStates(changes.objects || {});
    if (changes.abort) return changes;

    // Perform reactions and gather state changes
    if (_object && _object.reactions.hasOwnProperty(primaryTag)) changes = Object.assign(changes, _object.reactions[primaryTag](output, command, _location, _object, _game, _player, _locations, _objects));
    if (_location && _location.reactions.hasOwnProperty(primaryTag)) changes = Object.assign(changes, _location.reactions[primaryTag](output, command, _location, _object, _game, _player, _locations, _objects));
    _carriedObjects.forEach(_carriedObject => {
      if (_carriedObject !== _object && _carriedObject.reactions.hasOwnProperty(primaryTag)) changes = Object.assign(changes, _carriedObject.reactions[primaryTag](output, command, _location, _object, _game, _player, _locations, _objects));
    });
    _localObjects.forEach(_localObject => {
      if (_localObject !== _object && _localObject.reactions.hasOwnProperty(primaryTag)) changes = Object.assign(changes, _localObject.reactions[primaryTag](output, command, _location, _object, _game, _player, _locations, _objects));
    });
    if (_player.reactions.hasOwnProperty(primaryTag)) changes = Object.assign(changes, _player.reactions[primaryTag](output, command, _location, _object, _game, _player, _locations, _objects));
    if (_game.reactions.hasOwnProperty(primaryTag)) changes = Object.assign(changes, _game.reactions[primaryTag](output, command, _location, _object, _game, _player, _locations, _objects));
    
    return changes;
  }
}