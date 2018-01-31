
import Entity from './entity.js';

export default class LocationEntity extends Entity {

  constructor(config = {}) {
    super(config);
    this.setState('id', config.id || 0);
    this.setState('name', config.name || 'nowhere');
    this.setState('exits', config.exits || []);
    this.setState('contents', config.contents || []);
  }

  get id() { return this.getState('id'); }

  get name() { return this.getState('name'); }

  get exits() { return this.getState('exits'); }

  get contents() { return this.getState('contents'); }
}
