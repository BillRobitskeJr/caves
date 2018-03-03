export interface StatesDict {
  [key: string]: any;
}

export interface EntityConfig {
  states?: StatesDict;
}

export default class Entity {
  private states: StatesDict;

  constructor(config: EntityConfig) {
    this.states = {};
    
    const states = config.states || {};
    Object.keys(states).forEach(key => { this.states[key] = states[key]; });
  }

  public getState(key: string): any {
    if (!this.states.hasOwnProperty(key)) return null;
    return typeof this.states[key] === 'function' ? this.states[key]() : this.states[key];
  }

  public setState(key: string, value: any): void {
    this.states[key] = value;
  }
}