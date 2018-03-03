import GameEntity from './game-entity';

export interface CommandConfig {
  verbPhrase: string;
  nounPhrase: string;
}

export default class Command {
  public readonly verbPhrase: string;
  public readonly nounPhrase: string;

  constructor(config: CommandConfig) {
    this.verbPhrase = config.verbPhrase;
    this.nounPhrase = config.nounPhrase;
  }

  public static parse(input: string, gameEntity: GameEntity): Command {
    const words = input.split(/\s+/g);
    let verbPhrase = [words[0]];
    let nounPhrase = words.slice(1);
    return new Command({
      verbPhrase: verbPhrase.join(' '),
      nounPhrase: nounPhrase.join(' ')
    });
  }
}
