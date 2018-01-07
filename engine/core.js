/**
 * Caves engine core module
 * @copyright Bill Robitske, Jr.  2017-2018
 * @author    Bill Robitske, Jr. <bill.robitske.jr@gmail.com>
 * @license   MIT
 */

import Action from './action.js'
import Entity from './entity.js'
import Collection from './collection.js'

import defaultActions from './actions.js'

/**
 * Game engine core class
 */
export default class EngineCore {

  /**
   * @typedef   EngineCore~output
   * @property  {EngineCore~printCallback}  print - Function to print text to output
   * @property  {function}                  clear - Function to clear the output
   */

  /**
   * @callback  EngineCore~printCallback
   * @param     {string}  message - Message to be printed
   * @param     {string}  [style] - Optional style to print the message in
   */

  /**
   * Create a new engine core instance
   * @param     {object}            [config]
   * @param     {EngineCore~output} [config.output]           - Main output for the game
   * @param     {EngineCore~output} [config.roomOutput]       - Output for running room display
   * @param     {EngineCore~output} [config.inventoryOutput]  - Output for running inventory display
   */
  constructor(config = {}) {
    this._output = config.output || {
      print: (msg, style) => { console.log(msg); },
      clear: () => { console.clear(); }
    }
    this._roomOutput = config.roomOutput || {
      print: (msg, style) => { this.output(msg, style); },
      clear: () => {}
    };
    this._inventoryOutput = config.inventoryOutput || {
      print: (msg, style) => { this.output(msg, style); },
      clear: () => {}
    };

    const actions = defaultActions;
    this._actions = new Collection(actions, Action);
    
    this._engineState = 0; // 0 = Entry state, 1 = Main loop, 2 = Ending state
    this._gameEntity = new Entity(config.game);
    this._playerEntity = new Entity(config.player);
    this._locationEntities = new Collection(config.locations, Entity);
    this._objectEntities = new Collection(config.objects, Entity);
  }

  /**
   * Start the game
   */
  startGame() {
    console.log(`EngineCore#startGame()`);
    this._output.clear();
    this._roomOutput.clear();
    this._inventoryOutput.clear();

    this._engineState = 0;
    this._gameEntity.updateState({ openingPage: 0 });
    this._displayOpening();
  }

  /**
   * Perform the player's turn based on their input
   * @param   {string}  input - Player-entered command
   */
  handleInput(input) {
    console.log(`EngineCore#handleInput("${input}")`);
    switch (this._engineState) {
      case 0:
        if (this._gameEntity.state.openingPage < this._gameEntity.identity.openingPages.length) {
          this._displayOpening();
        } else {
          this._output.clear();
          this._gameEntity.updateState({ turnCount: 0 });
          this._engineState++;
          this._displayRoom();
          this._displayInventory();
        }
        break;
      case 1:
        const command = this._parseCommand(input);
        console.log(`EngineCore#handleInput~command:`, command);
        if (command.action) {
          const changes = this._performCommand(command) || {};
          console.log(`EngineCore#handleInput~changes:`, changes);
          this._gameEntity.updateState(changes.game);
          this._playerEntity.updateState(changes.player);
          this._locationEntities.updateStates(changes.locations);
          this._objectEntities.updateStates(changes.objects);
        }
        this._gameEntity.updateState({ turnCount: this._gameEntity.state.turnCount + 1 });
        this._displayRoom();
        this._displayInventory();
    } 
  }

  /**
   * Display a page of the game's opening
   */
  _displayOpening() {
    console.log(`EngineCore#_displayOpening()`);
    let page = this._gameEntity.state.openingPage;
    this._output.print(this._gameEntity.identity.openingPages[page], 'story');
    this._output.print(`Press [Return] to continue...`);
    this._gameEntity.updateState({ openingPage: ++page });
  }

  /**
   * Display the current room in the room display
   */
  _displayRoom() {
    console.log(`EngineCore#_displayRoom()`);
    const room = this._locationEntities.getItem(this._playerEntity.state.room) || new Entity();
    const exits = (room.state.exits || []).map(exit => exit.direction).join(', ');
    const objects = this._objectEntities.getItemsByState({ room: room.id }).map(object => `   ${object.name}`).join('\n');
    this._roomOutput.clear();
    this._roomOutput.print(`You are ${room.name || 'nowhere'}.`);
    this._roomOutput.print(`You can go: ${exits || 'nowhere'}`);
    this._roomOutput.print(`You can see:`);
    this._roomOutput.print(`${objects || '   nothing of interest'}`);
  }

  /**
   * Display the player's inventory in the inventory display
   */
  _displayInventory() {
    console.log(`EngineCore#_displayInventory()`);
    const maxCarry = this._playerEntity.identity.maxCarry || 0;
    const inventory = this._playerEntity.state.inventory || [];
    const objects = inventory.map(id => this._objectEntities.getItem(id)).filter(object => object !== null).map(object => `   ${object.name}`).join('\n');
    const remainingCarry = maxCarry - inventory.length;
    this._inventoryOutput.clear();
    this._inventoryOutput.print(`You are carrying:`);
    this._inventoryOutput.print(`${objects || '   nothing'}`);
    this._inventoryOutput.print(`You can carry ${remainingCarry || 0} more.`);
  }

  /**
   * Split the player's command into it's action/object pair
   * @param   {string}  input - Player-entered command
   * @returns {{action: string, object: string}}  - Parsed command
   */
  _parseCommand(input) {
    console.log(`EngineCore#_parseCommand("${input}")`);
    const action = input.split(/\s/)[0].trim().toLowerCase();
    const object = input.substr(action.length).trim().toLowerCase();
    return { action, object };
  }

  /**
   * Perform the player's command
   * @param {{action: string, object: string}}  command - Parsed command
   */
  _performCommand(command) {
    console.log(`EngineCore#_performCommand(command):`, command);
    const action = this._actions.getItemByTag(command.action);
    if (!action) return this._output.print(`You don't know how to do that!`, 'error');
    const location = this._locationEntities.getItem(this._playerEntity.state.room);
    const object = command.object ? this._objectEntities.getItemByTag(command.object) : null;
    const isObjectValid = object && (object.state.room === location.id || this._playerEntity.state.inventory.indexOf(object.id) !== -1);
    return action.perform(this._output, command, location, isObjectValid ? object : null, this._gameEntity, this._playerEntity, this._locationEntities, this._objectEntities);
  }
}
