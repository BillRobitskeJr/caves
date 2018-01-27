
export default class Action {

  constructor(config = {}) {
    this._verbs = config.verbs || [];
    this._start = config.start || null;
    this._complete = config.complete || null;
  }

  get verbTest() { return new RegExp(`(${this._verbs.join('|')})`, 'i'); }

  start(actor, command, game) {
    if (typeof this._start !== 'function') return { stop: false, output: [] };
    const { stop, output } = this._start(actor, command, game);
    return { stop: !!stop, output: output || [] };
  }

  complete(actor, command, game) {
    if (typeof this._complete !== 'function') return [];
    return this._complete(actor, command, game) || [];
  }
}
