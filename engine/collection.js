/**
 * Game entity collection abstraction
 * @copyright   Bill Robitske, Jr. 2018
 * @author      Bill Robitske, Jr. <bill.robitske.jr@gmail.com>
 * @license     MIT
 */

import Entity from './entity.js'

export default class Collection {
  constructor(items = [], type = Entity) {
    this._type = type;
    this._items = items.map(item => item instanceof type && typeof item.clone === 'function' ? item.clone() : new type(item));
  }

  getItem(id) {
    return this._items.find(item => item.id === id) || null;
  }

  getItemByTag(tag) {
    return this._items.find(item => item.tag instanceof RegExp ? tag.match(item.tag) !== null : item.tag === tag) || null;
  }

  getItemsByTagExpresson(expression) {
    return this._items.filter(item => item.tag.match(expression) !== null);
  }

  getItemsByState(state = {}) {
    const keys = Object.keys(state);
    return this._items.filter(item => keys.reduce((testValue, key) => testValue && item.state[key] === state[key], true));
  }

  updateStates(changes = {}) {
    Object.keys(changes).forEach(id => {
      this.getItem(parseInt(id)).updateState(changes[id]);
    });
  }

  clone() {
    return new Collection(this._items, this._type);
  }
}
