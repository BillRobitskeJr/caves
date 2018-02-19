interface StatesDict {
  [key: string]: any;
}

interface EntityConfig {
  states?: StatesDict;
}

export default class Entity {
  private states: StatesDict;

  constructor(config: EntityConfig = {}) {
    config = config || {};
    this.states = config.states || {};
  }

  getState(key: string): any {
    if (this.states.hasOwnProperty(key)) {
      if (typeof this.states[key] === 'function') {
        return this.states[key]();
      } else {
        return this.states[key];
      }
    }
    return null;
  }

  setState(key: string, value: any): void {
    this.states[key] = value;
  }

  serialize(): StatesDict {
    const states: StatesDict = {};
    Object.keys(this.states).forEach(key => { if (typeof this.states[key] !== 'function') states[key] = this.states[key]; });
    return states;
  }

  deserialize(states: StatesDict): void {
    Object.keys(states).forEach(key => { this.setState(key, states[key]); });
  }
}