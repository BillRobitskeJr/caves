

export default class Collection {

  constructor(entities = []) {
    this._entities = entities;
  }

  getByID(id) {
    return this._entities.find(entity => entity.id === id) || null;
  }

  findEntities(filter = () => false) {
    return this._entities.filter(filter) || [];
  }

  findEntity(filter = () => false) {
    return this._entities.find(filter) || null;
  }

  serialize() {
    return this._entities.reduce((states, entity) => {
      states[entity.id] = entity.serialize();
      return states;
    }, {});
  }

  deserialize(states) {
    Object.keys(states).forEach(id => {
      const entity = this.getByID(id);
      if (entity) entity.deserialize(states[id]);
    });
  }
}
