
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

export default class Command {

  constructor(verb = '', nounPhrase = '', prepositionalPhrases = []) {
    this._verb = verb;
    this._nounPhrase = nounPhrase;
    this._prepositionalPhrases = prepositionalPhrases;
  }

  get verb() { return this._verb; }

  get nounPhrase() { return this._nounPhrase; }

  get prepositionalPhrases() { return this._prepositionalPhrases; }

  static parse(input = '') {
    const splitInput = input.split(/\s+/g);
    if (splitInput.length === 0 || splitInput[0].trim() === '') return null;
    if (splitInput.length === 1) return new Command(splitInput[0].trim());
    let nounPhrase = [];
    let prepositionalPhrase = [];
    let prepositionalPhrases = [];
    splitInput.slice(1).forEach(word => {
      if (PREPOSITIONS.indexOf(word) !== -1) {
        if (prepositionalPhrase.length > 0) {
          prepositionalPhrases.push(prepositionalPhrase.join(' '));
          prepositionalPhrase = [];
        }
        prepositionalPhrase.push(word);
      } else if (prepositionalPhrase.length > 0) {
        prepositionalPhrase.push(word);
      } else {
        nounPhrase.push(word);
      }
    });
    if (prepositionalPhrase.length > 0) prepositionalPhrases.push(prepositionalPhrase.join(' '));
    return new Command(splitInput[0].trim(), nounPhrase.join(' '), prepositionalPhrases);
  }
}
