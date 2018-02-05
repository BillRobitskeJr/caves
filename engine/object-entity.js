
import Entity from './entity.js';
import LocationEntity from './location-entity.js';

export default class ObjectEntity extends Entity {

  constructor(config = {}, game) {
    super(config);
    this._game = game;
    this.setState('id', config.id || 0);
    this.setState('name', config.name || 'nothing');
    this.setState('tags', config.tags || []);
    this.setState('location', config.location || null);
  }

  get id() { return this.getState('id'); }

  get name() { return this.getState('name'); }

  get location() { return this._game.locations.getByID(this.getState('location')); }

  set location(value) {
    if (!(value instanceof LocationEntity)) throw new TypeError(`Value is not an instance of LocationEntity.`);
    this.setState('location', value.id);
  }
}
