
import Entity from './entity.js';

export default class PlayerEntity extends Entity {

  constructor(config, game) {
    super(config);
    this._game = game;
    this._inventory = [];
    this._maxCarry = config.maxCarry || 0;
    this._location = config.location || 1;
  }

  get inventory() { return this._inventory; }

  get maxCarry() { return this._maxCarry; }

  get location() { return this._game.locations.getByID(this._location); }
}
