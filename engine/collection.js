

export default class Collection {

  constructor(entities = []) {
    this._entities = entities;
  }

  getByID(id) {
    return this._entities.find(entity => entity.id === id) || null;
  }
}
