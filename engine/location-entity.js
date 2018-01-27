
import Entity from './entity.js';

export default class LocationEntity extends Entity {

  constructor(config = {}) {
    super(config);
    this._id = config.id || 0;
    this._name = config.name || 'nowhere';
    this._exits = config.exits || [];
    this._contents = config.contents || [];
  }

  get id() { return this._id; }

  get name() { return this._name; }

  get exits() { return this._exits; }

  get contents() { return this._contents; }
}
