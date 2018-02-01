

import Entity from './entity.js';
import Collection from './collection.js';
import PlayerEntity from './player-entity.js';

export default class GameEntity extends Entity {

  constructor(config) {
    super(config);
    this._playerEntity = null;
    this._locationsCollection = null;
    this._menuScreen = config.menuScreen || [];
    this._openingScreens = config.openingScreens || [];
    this._currentOpeningPage = 0;
  }

  get player() { return this._playerEntity; }

  set player(value) {
    if (!(value instanceof PlayerEntity)) throw new TypeError(`Value is not an instance of PlayerEntity.`);
    this._playerEntity = value;
  }

  get locations() { return this._locationsCollection; }

  set locations(value) {
    if (!(value instanceof Collection)) throw new TypeError(`Value is not an instance of Collection.`);
    this._locationsCollection = value;
  }

  get menuScreen() { return this._menuScreen; }

  get openingScreen() { return this._openingScreens[this._currentOpeningPage] || []; }

  get locationScreen() {
    const location = this._playerEntity.location || { name: 'nowhere', exits: [], contents: [] };
    const exits = location.exits.map(exit => exit.direction).join(', ');
    const contents = location.contents.map(object => `   ${object.name}`).join('\n');
    const lines = [
      `You are ${location.name}.`,
      `You can go: ${exits || 'nowhere'}`,
      `You can see:`,
      `${contents || '   nothing of interest'}`
    ];
    return lines.join('\n');
  }

  get playerScreen() {
    const player = this._playerEntity || { inventory: [], maxCarry: 0 };
    const inventory = player.inventory.map(object => `   ${object.name}`).join('\n');
    const lines = [
      `You are carrying:`,
      `${inventory || '   nothing'}`,
      `You can carry ${player.maxCarry - player.inventory.length} more.`
    ];
    return lines.join('\n');
  }

  resetOpening() {
    this._currentOpeningPage = 0;
  }

  advanceOpening() {
    this._currentOpeningPage++;
    return this._currentOpeningPage >= this._openingScreens.length;
  }

  serialize() {
    const states = {
      game: super.serialize(),
      player: this._playerEntity.serialize(),
      locations: this._locationsCollection.serialize()
    };
    return states;
  }

  deserialize(states) {
    super.deserialize(states.game);
    this._playerEntity.deserialize(states.player);
    this._locationsCollection.deserialize(states.locations);
  }
}
