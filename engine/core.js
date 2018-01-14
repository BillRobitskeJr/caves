/**
 * Game engine core
 * @copyright   Bill Robitske, Jr. 2017-2018
 * @author      Bill Robitske, Jr. <bill.robitske.jr@gmail.com>
 * @license     MIT
 */

import Entity from './entity.js'
import LocationEntity from './location-entity.js'
import ObjectEntity from './object-entity.js'
import Collection from './collection.js'

// Symbols for semi-private members
const _mainOutput = Symbol('output.main');
const _locationOutput = Symbol('output.location');
const _playerOutput = Symbol('output.player');
const _game = Symbol('game');
const _player = Symbol('player');
const _locations = Symbol('locations');
const _objects = Symbol('objects');

/**
 * Game engine core class
 */
export default class EngineCore {

  /**
   * Create a new game engine core
   * @param     {Object}              outputs
   * @param     {EngineCore.Output}   outputs.main
   * @param     {EngineCore.Output}   [outputs.location]
   * @param     {engineCore.Output}   [outputs.player]
   * @param     {Object}              entityConfigs
   * @param     {Entity.Config}       entityConfigs.game
   * @param     {Entity.Config}       entityConfigs.player
   * @param     {Entity.Config[]}     entityConfigs.locations
   * @param     {Entity.Config[]}     entityConfigs.objects
   */
  constructor(outputs = {}, entityConfigs = {}) {
    this[_mainOutput] = outputs.main || { print: console.log.bind(console), clear: console.clear.bind(console) };
    this[_locationOutput] = outputs.location || { print: this[_mainOutput].print.bind(this[_mainOutput]), clear: () => {} };
    this[_playerOutput] = outputs.player || { print: this[_mainOutput].print.bind(this[_mainOutput]), clear: () => {} };

    this[_game] = new Entity(Object.assign({ type: 'game', id: 1 }, entityConfigs.game));
    this[_player] = new Entity(Object.assign({ type: 'player', id: 1 }, entityConfigs.player));
    this[_locations] = Collection.createFromConfigs(entityConfigs.locations || [], LocationEntity, 'location');
    this[_objects] = Collection.createFromConfigs(entityConfigs.objects || [], ObjectEntity, 'object');
  }

  /**
   * @typedef   EngineCore.Command
   * @property  {string}  verb        - Verb entered
   * @property  {string}  predicate   - Predicate phrase entered
   * @property  {Entity}  actor       - Actor of this command
   * @property  {Action}  action      - Action to be taken by actor
   * @property  {?Entity} object      - Object of action to be taken
   * @property  {Entity}  setting     - Location of the actor of this command
   */
  
  /**
   * @typedef   EngineCore.Output
   * @property  {EngineCore.Output.PrintHandler}  print - Function to print text to an output
   * @property  {EngineCore.Output.ClearHandler}  clear - Fuction to clear an output
   */

  /**
   * @callback  EngineCore.Output.PrintHandler
   * @param     {string}  message   - Message to be printed to the output
   * @param     {string}  [style]   - Optional style to apply to the message
   */

  /**
   * @callback  EngineCore.Output.ClearHandler
   */

  /**
   * Parse player input
   * @param     {string}  input       - Player-entered input
   * @returns   {EngineCore.Command}  - Parsed player command
   */
  parseInput(input) {
    console.log(`EngineCore#parseInput("${input}")`);
    const playerVerbs = this[_player].performableVerbs;
    const maxVerbLength = playerVerbs.reduce((maxLength, verb) => Math.max(maxLength, verb.length), 0);
    const action = this[_player].getAction(input.substr(0, maxVerbLength));
    const setting = this[_locations].getEntity(this[_player].getState('location'));
    
    // Return "null" command
    if (!action) {
      const split = input.split(/\s+/g);
      const verb = (split[0] || '').toLowerCase();
      const predicate = split.slice(1).join(' ').toLowerCase();
      return {
        verb,
        predicate,
        actor: this[_player].clone(),
        action: null,
        object: null,
        setting: setting ? setting.clone() : null
      };
    }

    // Return parsed command
    const verb = input.match(action.verbExpression)[1].toLowerCase();
    const predicate = input.substr(verb.length).trim().toLowerCase();
    const object = this[_objects].findEntity(entity => entity.tagExpression.test(predicate));
    return {
      verb,
      predicate,
      actor: this[_player].clone(),
      action,
      object,
      setting: setting ? setting.clone() : null
    };
  }

  /**
   * Respond to player input
   * @param     {string}  input       - Player-entered input
   */
  handleInput(input) {
    console.log(`EngineCore#handleInput("${input}")`);
    const command = this.parseInput(input);
    console.log(`EngineCore#handleInput~command:`, command);
    
    if (command.verb) this.performPlayerCommand(command);
    
    this.performGameCommand(this[_game].getAction('showPlayerLocation'), this[_locationOutput]);
    this.performGameCommand(this[_game].getAction('showPlayerInventory'), this[_playerOutput]);
  }

  /**
   * Perform a game action
   * @param     {Action}              action  - Action to perform
   * @param     {EngineCore.Output}   output  - Output to have action update
   */
  performGameCommand(action, output) {
    console.log(`EngineCore#performGameCommand(action, output):`, action, output);
    if (!action) return;

    // Perform action and capture state updates
    const updates = action.perform(null, output, {
      game: this[_game].clone(),
      player: this[_player].clone(),
      locations: this[_locations].clone(),
      objects: this[_objects].clone()
    });
    if (updates.abort) return;

    // Apply final state updates to game entities
    Object.keys(updates.game).forEach(key => { this[_game].updateState(key, updates.game[key], command.actor); });
    Object.keys(updates.player).forEach(key => { this[_player].updateState(key, updates.player[key], command.actor); });
    Object.keys(updates.locations).forEach(id => {
      const location = this[_locations].getEntity(id);
      if (location) Object.keys(updates.locations[id]).forEach(key => { location.updateState(key, updates.locations[id][key], command.actor); });
    });
    Object.keys(updates.objects).forEach(id => {
      const object = this[_objects].getEntity(id);
      if (object) Object.keys(updates.objects[id]).forEach(key => { object.updateState(key, updates.objects[id][key], command.actor); });
    });
  }

  /**
   * Perform a player action
   * @param     {EngineCore.Command}  command   - Player command to perform
   */
  performPlayerCommand(command) {
    console.log(`EngineCore#performPlayerCommand(command):`, command);
    if (command.action) {
      // Perform command and capture state updates
      const updates = command.action.perform(command, this[_mainOutput], {
        game: this[_game].clone(),
        player: this[_player].clone(),
        locations: this[_locations].clone(),
        objects: this[_objects].clone()
      });
      if (updates.abort) return;
      console.log(`EngineCore#performPlayerCommand~updates:`, updates);

      // Apply final state updates to game entities
      Object.keys(updates.game).forEach(key => { this[_game].updateState(key, updates.game[key], command.actor); });
      Object.keys(updates.player).forEach(key => { this[_player].updateState(key, updates.player[key], command.actor); });
      Object.keys(updates.locations).forEach(id => {
        const location = this[_locations].getEntity(id);
        if (location) Object.keys(updates.locations[id]).forEach(key => { location.updateState(key, updates.locations[id][key], command.actor); });
      });
      Object.keys(updates.objects).forEach(id => {
        const object = this[_objects].getEntity(id);
        if (object) Object.keys(updates.objects[id]).forEach(key => { object.updateState(key, updates.objects[id][key], command.actor); });
      });
    } else {
      this[_mainOutput].print(`You don't know how to do that!`, 'error');
    }
  }
}
