export interface EntityStatesDict {
  [key: string]: any;
}

export interface EntityConfig {
  states?: EntityStatesDict;
}

export interface EntitySerlization {
  states?: EntityStatesDict;
}

export default abstract class Entity {
  private states: EntityStatesDict;

  constructor(config: EntityConfig = {}) {
    this.states = {};

    const states = config.states || {};
    Object.keys(states).forEach(key => { this.states[key] = states[key]; });
  }

  public getState(key: string): any {
    if (!this.states.hasOwnProperty(key)) return null;
    return typeof this.states[key] === 'function' ? this.states[key].call(this) : this.states[key];
  }

  public setState(key: string, value: any): void {
    this.states[key] = value;
  }

  public serialize(): EntitySerlization {
    const serialization: EntitySerlization = {};
    const keys = Object.keys(this.states);
    if (keys.length > 0) {
      const states: EntityStatesDict = {};
      keys.forEach(key => { if (typeof this.states[key] !== 'function') states[key] = this.states[key]; });
      serialization.states = states;
    }
    return serialization;
  }

  public deserialize(serialization: EntitySerlization): void {
    const states: EntityStatesDict = serialization.states || {};
    Object.keys(states).forEach(key => { this.states[key] = states[key]; });
  }
}