/**
 * Caves Engine
 * @copyright   Bill Robitske, Jr. 2018
 * @author      Bill Robitske, Jr. <bill.robitske.jr@gmail.com>
 * @license     MIT
 */

import GameEntity from './game-entity.js';
import Collection from './collection.js';
import Command from './command.js';
import PlayerEntity from './player-entity.js';
import LocationEntity from './location-entity.js';
import ObjectEntity from './object-entity.js';

const DEBUG = true;

const STATE_MENU = 0;
const STATE_OPENING = 1;
const STATE_GAME = 2;
const STATE_ENDING = 3;
const STATE_LOADING = 4;
const STATE_SAVING = 5;

/**
 * Caves Engine core class
 */
export default class CavesEngine {

  /**
   * Create a new game instance
   * @param {*} outputs - Available output screens
   * @param {*} config - Game entity configurations
   */
  constructor(outputs, config) {
    this._outputs = outputs;
    this._config = {
      game: config.game || {},
      player: config.player || {},
      locations: config.locations || [],
      objects: config.objects || []
    };
    this._state = STATE_MENU;
    this._gameEntity = new GameEntity(this._config.game);
    this._inputHandlers = [
      this.handleMenuInput,
      this.handleOpeningInput,
      this.handleGameInput,
      this.handleEndingInput,
      this.handleLoadingInput,
      this.handleSavingInput
    ];

    this.displayMenu();
  }

  /**
   * @property {function} handleInput - Current input handler
   */
  get handleInput() { return this._inputHandlers[this._state].bind(this); }

  /**
   * Start the game's opening sequence
   */
  startOpening() {
    this._state = STATE_OPENING;
    this._gameEntity.resetOpening();
    this.displayOpening();
  }

  /**
   * Start the game's main loop
   * @param {Object} [states] - Game entity's serialized states
   */
  startGame(states) {
    this._state = STATE_GAME;
    this._gameEntity.player = new PlayerEntity(this._config.player, this._gameEntity);
    this._gameEntity.locations = new Collection(this._config.locations.map(config => new LocationEntity(config, this._gameEntity)));
    this._gameEntity.objects = new Collection(this._config.objects.map(config => new ObjectEntity(config, this._gameEntity)));
    if (states) this._gameEntity.deserialize(states);
    this._outputs.main.clear();
    this.displayGameTurnStart();
  }

  /**
   * Handle player inputs while on the title menu screen
   * @param {string} input - Player input
   */
  handleMenuInput(input = "") {
    if (DEBUG) console.log(`CavesEngine#handleMenuInput("${input}")`);
    if (input.trim().match(/^start$/i)) {
      this.startOpening();
    } else if (input.trim().match(/^load$/i)) {
      this._state = STATE_LOADING;
      this.displayLoadingScreen();
    } else {
      this.displayMenu();
    }
  }

  /**
   * Handle player inputs while in the opening sequence
   * @param {string} input - Player input
   */
  handleOpeningInput(input) {
    if (DEBUG) console.log(`CavesEngine#handleOpeningInput("${input}")`);
    const openingComplete = this._gameEntity.advanceOpening();
    if (openingComplete) {
      this.startGame();
    } else {
      this.displayOpening();
    }
  }

  /**
   * Handle player input during the game's main loop
   * @param {string} input - Player input
   */
  handleGameInput(input) {
    if (DEBUG) console.log(`CavesEngine#handleGameInput("${input}")`);
    if (input.trim().match(/^save$/i)) {
      this._state = STATE_SAVING;
      this.displaySavingScreen();
    } else if (input.trim().match(/^quit$/i)) {
      this._state = STATE_MENU;
      this.displayMenu();
    } else {
      const command = Command.parse(input);
      if (DEBUG) console.log(`CavesEngine#handleGameInput~command:`, command);
      if (!command) return;
      const output = this._gameEntity.player.perform(command);
      (output || []).forEach(line => {
        this._outputs.main.print(line);
      });
      this.displayGameTurnStart();
    }
  }

  /**
   * Handle player input while in the ending sequence
   * @param {string} input - Player input
   */
  handleEndingInput(input) {
    if (DEBUG) console.log(`CavesEngine#handleEndingInput("${input}")`);
  }

  /**
   * Handle player input while on the loading screen
   * @param {string} input - Player input
   */
  handleLoadingInput(input) {
    if (DEBUG) console.log(`CavesEngine#handleLoadingInput("${input}")`);
    const loadCommand = input.trim().match(/^load\s+(\d)$/i);
    if (input.trim().match(/^return$/i)) {
      this._state = STATE_MENU;
      this.displayMenu();
    } else if (!loadCommand) {
      this.displayLoadingScreen();
    } else {
      const saves = JSON.parse(localStorage.getItem('saves') || '[]');
      const id = parseInt(loadCommand[1]) - 1;
      this.startGame(saves[id].states);
    }
  }

  /**
   * Handle player input while on the saving screen
   * @param {string} input - Player input
   */
  handleSavingInput(input) {
    if (DEBUG) console.log(`CavesEngine#handleSavingInput("${input}")`);
    const saveCommand = input.trim().match(/^save\s+(\d)$/i);
    if (input.trim().match(/^return$/i)) {
      this._state = STATE_GAME;
      this.displayGameTurnStart();
    } else if (!saveCommand) {
      this.displaySavingScreen();
    } else {
      const saves = JSON.parse(localStorage.getItem('saves') || '[]');
      const id = parseInt(saveCommand[1]) - 1;
      const states = this._gameEntity.serialize();
      console.log(`CavesEngine#handleSavingInput~states:`, states);
      saves[id] = { date: new Date(), states };
      localStorage.setItem('saves', JSON.stringify(saves));
      this._state = STATE_GAME;
      this._outputs.main.clear();
      this.displayGameTurnStart();
    }
  }

  /**
   * Display the game's title menu
   */
  displayMenu() {
    this._outputs.location.clear();
    this._outputs.player.clear();
    const menu = this._gameEntity.menuScreen;
    this._outputs.main.clear();
    menu.forEach(line => {
      this._outputs.main.print(line);
    });
  }

  /**
   * Display the current page of the game's opening sequence
   */
  displayOpening() {
    const opening = this._gameEntity.openingScreen;
    this._outputs.main.clear();
    opening.forEach(line => {
      this._outputs.main.print(line);
    });
    this._outputs.main.print(`Press Return to continue...`);
  }

  /**
   * Update display of player/location information at the start of each
   * game turn
   */
  displayGameTurnStart() {
    this._outputs.location.clear();
    this._outputs.location.print(this._gameEntity.locationScreen);
    this._outputs.player.clear();
    this._outputs.player.print(this._gameEntity.playerScreen);
  }

  /**
   * Display the loading screen
   */
  displayLoadingScreen() {
    const saves = JSON.parse(localStorage.getItem('saves') || '[]');
    this._outputs.main.clear();
    this._outputs.main.print(`&#xE097;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0AB;`);
    this._outputs.main.print(`&#xE095;&#xE095;                                                            &#xE0AA;&#xE0AA;`);
    this._outputs.main.print(`&#xE095;&#xE095;                         SAVED GAMES                        &#xE0AA;&#xE0AA;`);
    this._outputs.main.print(`&#xE095;&#xE095;                                                            &#xE0AA;&#xE0AA;`);
    for (let i = 0; i < 8; ++i) {
      const save = saves[i];
      const date = save ? new Date(save.date) : null;
      const saveMessage = save ? `${date.toLocaleString()}` : 'Empty';
      this._outputs.main.print(`&#xE095;&#xE095; [load ${i+1}] ${saveMessage.padEnd(49)} &#xE0AA;&#xE0AA;`);
    }
    this._outputs.main.print(`&#xE095;&#xE095; [return] Return to Title                                   &#xE0AA;&#xE0AA;`);
    this._outputs.main.print(`&#xE095;&#xE095;                                                            &#xE0AA;&#xE0AA;`);
    this._outputs.main.print(`&#xE0B5;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0BA;`);
  }

  /**
   * Display the saving screen
   */
  displaySavingScreen() {
    const saves = JSON.parse(localStorage.getItem('saves') || '[]');
    this._outputs.main.clear();
    this._outputs.main.print(`&#xE097;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0AB;`);
    this._outputs.main.print(`&#xE095;&#xE095;                                                            &#xE0AA;&#xE0AA;`);
    this._outputs.main.print(`&#xE095;&#xE095;                         SAVED GAMES                        &#xE0AA;&#xE0AA;`);
    this._outputs.main.print(`&#xE095;&#xE095;                                                            &#xE0AA;&#xE0AA;`);
    for (let i = 0; i < 8; ++i) {
      const save = saves[i];
      const date = save ? new Date(save.date) : null;
      const saveMessage = save ? `${date.toLocaleString()}` : 'Empty';
      this._outputs.main.print(`&#xE095;&#xE095; [save ${i+1}] ${saveMessage.padEnd(49)} &#xE0AA;&#xE0AA;`);
    }
    this._outputs.main.print(`&#xE095;&#xE095; [return] Return to game                                    &#xE0AA;&#xE0AA;`);
    this._outputs.main.print(`&#xE095;&#xE095;                                                            &#xE0AA;&#xE0AA;`);
    this._outputs.main.print(`&#xE0B5;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0B3;&#xE0BA;`);
  }
}
