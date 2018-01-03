/**
 * Game entity collection abstraction
 * @copyright   Bill Robitske, Jr. 2018
 * @author      Bill Robitske, Jr. <bill.robitske.jr@gmail.com>
 * @license     MIT
 */

import Entity from './entity.js'

export default class Collection {
  constructor(items = [], type = Entity) {
    this._items = items.map(item => new type(item));
  }

  getItem(id) {
    return this._items.find(item => item.id === id) || null;
  }

  getItemByTag(tag) {
    return this._items.find(item => item.tag === tag) || null;
  }

  getItemsByTagExpresson(expression) {
    return this._items.filter(item => item.tag.match(expression) !== null);
  }

  getItemsByState(state) {
    const keys = Object.keys(state);
    return this._items.filter(item => keys.reduce((testValue, key) => testValue && item.state[key] === state[key], true));
  }
}
