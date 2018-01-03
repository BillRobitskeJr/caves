/**
 * Caves engine core module
 * @copyright Bill Robitske, Jr.  2017-2018
 * @author    Bill Robitske, Jr. <bill.robitske.jr@gmail.com>
 * @license   MIT
 */

import Entity from './entity.js'
import Collection from './collection.js'

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
    
    this._engineState = 0; // 0 = Entry state, 1 = Main loop, 2 = Ending state
    this._gameEntity = new Entity(config.game);
    this._playerEntity = new Entity(config.player);
    this._locationEntities = new Collection(config.locations, Entity);
    this._objectEntities = new Collection(config.objects, Entity);
  }

  startGame() {
    this._output.clear();
    this._roomOutput.clear();
    this._inventoryOutput.clear();

    this._engineState = 0;
    this._gameEntity.updateState({ openingPage: 0 });
    this._displayOpening();
  }

  handleInput(input) {
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
        this._gameEntity.updateState({ turnCount: this._gameEntity.state.turnCount + 1 });
        this._displayRoom();
        this._displayInventory();
    } 
  }

  static get defaultOutput() {
    return {
      output: console.log.bind(console),
      clear: console.clear.bind(console)
    };
  }

  _displayOpening() {
    let page = this._gameEntity.state.openingPage;
    this._output.print(this._gameEntity.identity.openingPages[page], 'story');
    this._output.print(`Press [Return] to continue...`);
    this._gameEntity.updateState({ openingPage: ++page });
  }

  _displayRoom() {
    console.log(`EngineCore#_displayRoom`, this._locationEntities, this._playerEntity);
    const room = this._locationEntities.getItem(this._playerEntity.state.room) || new Entity();
    const objects = this._objectEntities.getItemsByState({ room: room.id }).map(object => `   ${object.name}`).join('\n');
    console.log(`EngineCore#_displayRoom~objects`, objects);
    this._roomOutput.clear();
    this._roomOutput.print(`You are ${room.name || 'nowhere'}.`);
    this._roomOutput.print(`You can go: ${null || 'nowhere'}`);
    this._roomOutput.print(`You can see:`);
    this._roomOutput.print(`${objects || '   nothing of interest'}`);
  }

  _displayInventory() {
    const maxCarry = this._playerEntity.identity.maxCarry || 0;
    const inventory = this._playerEntity.state.inventory || [];
    const objects = inventory.map(id => this._objectEntities.getItem(id)).filter(object => object !== null).map(object => `   ${object.name}`).join('\n');
    const remainingCarry = maxCarry - inventory.length;
    this._inventoryOutput.clear();
    this._inventoryOutput.print(`You are carrying:`);
    this._inventoryOutput.print(`${objects || '   nothing'}`);
    this._inventoryOutput.print(`You can carry ${remainingCarry || 0} more.`);
  }
}
