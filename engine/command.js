/**
 * Caves Engine: Game Command
 * @copyright Bill Robitske, Jr. 2018
 * @author    Bill Robitske, Jr. <bill.robitske.jr@gmail.com>
 * @license   MIT
 */

/**
 * Prepositions recognized by the command parser
 * @type {string[]}
 * @private
 * @readonly
 */
const PREPOSITIONS = [
  'aboard', 'about', 'above', 'across', 'after', 'against', 'along',
  'alongside', 'amid', 'among', 'around', 'as', 'astride', 'at',
  'atop', 'ontop', 'before', 'behind', 'beneath', 'beside', 'besides',
  'between', 'beyond', 'but', 'by', 'circa', 'come', 'despite', 'down',
  'during', 'except', 'for', 'from', 'in', 'inside', 'into', 'less',
  'like', 'minus', 'near', 'of', 'on', 'onto', 'opposite', 'out',
  'outside', 'over', 'past', 'per', 'plus', 'save', 'short', 'since',
  'than', 'through', 'throughout', 'till', 'to', 'toward', 'towards',
  'under', 'underneath', 'unlike', 'until', 'unto', 'up', 'upon',
  'upside', 'versus', 'via', 'with', 'within', 'without', 'worth'
];

/**
 * Command class
 */
export default class Command {

  /**
   * @typedef {Object} Command.PrepositionalPhrase
   * @property {string} preposition - Preposition of this phrase
   * @property {string} nounPhrase - Noun phrase portion of this phrase
   */

  /**
   * Create a new command
   * @constructor
   * @param {string} verb 
   * @param {string} nounPhrase 
   * @param {Command.PrepositionalPhrase[]} prepositionalPhrases
   * @param {ObjectEntity} nounObject
   */
  constructor(verb = '', nounPhrase = '', prepositionalPhrases = [], nounObject = null) {
    this._verb = verb;
    this._nounPhrase = nounPhrase;
    this._prepositionalPhrases = prepositionalPhrases;
    this._nounObject = nounObject;
  }

  /**
   * @property {string} verb - This command's verb
   * @readonly
   */
  get verb() { return this._verb; }

  /**
   * @property {string} nounPhrase - This command's object noun phrase
   * @readonly
   */
  get nounPhrase() { return this._nounPhrase; }

  /**
   * @property {string} nounObject - Object entity referenced by this command's noun phrase
   * @readonly
   */
  get nounObject() { return this._nounObject; }

  /**
   * @property {Command.PrepositionalPhrase[]} prepositionalPhrases - This command's prepositional phrases
   * @readonly
   */
  get prepositionalPhrases() { return this._prepositionalPhrases; }

  /**
   * Create a command based on an input statement
   * @param {string} input - Input statement to parse
   * @param {GameEntity} game - Current game entity
   * @returns {?Command} - Parsed command
   */
  static parse(input = '', game = null) {
    const splitInput = input.toLowerCase().split(/\s+/g);
    if (splitInput.length === 0 || splitInput[0].trim() === '') return null;
    if (splitInput.length === 1) return new Command(splitInput[0].trim());
    let nounPhrase = [];
    let prepositionalPhrase = null;
    let prepositionalPhrases = [];
    splitInput.slice(1).forEach(word => {
      if (PREPOSITIONS.indexOf(word) !== -1) {
        if (prepositionalPhrase) {
          prepositionalPhrases.push({
            preposition: prepositionalPhrase.preposition,
            nounPhrase: prepositionalPhrase.nounPhrase.join(' '),
            nounObject: game.objects.findEntity(object => tagsExpression.test(prepositionalPhrase.nounPhrase.join(' ')))
          });
          prepositionalPhrase = null;
        }
        prepositionalPhrase = { preposition: word, nounPhrase: [] };
      } else if (prepositionalPhrase) {
        prepositionalPhrase.nounPhrase.push(word);
      } else {
        nounPhrase.push(word);
      }
    });
    if (prepositionalPhrase) prepositionalPhrases.push({
      preposition: prepositionalPhrase.preposition,
      nounPhrase: prepositionalPhrase.nounPhrase.join(' '),
      nounObject: game.objects.findEntity(object => tagsExpression.test(prepositionalPhrase.nounPhrase.join(' ')))
    });
    const nounObject = game.objects.findEntity(object => object.tagsExpression.test(nounPhrase.join(' ')));
    return new Command(splitInput[0].trim(), nounPhrase.join(' '), prepositionalPhrases, nounObject);
  }
}
