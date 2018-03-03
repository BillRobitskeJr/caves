const expect = require('chai').expect;
const Command = require('../lib/command').default;
const GameEntity = require('../lib/game-entity').default;

describe(`Command parser behavior`, function() {
  const gameEntity = new GameEntity({});
  const tests = [
    { input: '', output: { verbPhrase: '', nounPhrase: '' }},
    { input: 'go north', output: { verbPhrase: 'go', nounPhrase: 'north' }},
    { input: 'go south', output: { verbPhrase: 'go', nounPhrase: 'south' }},
    { input: 'go east', output: { verbPhrase: 'go', nounPhrase: 'east' }},
    { input: 'go west', output: { verbPhrase: 'go', nounPhrase: 'west' }},
    { input: 'go up', output: { verbPhrase: 'go', nounPhrase: 'up' }},
    { input: 'go down', output: { verbPhrase: 'go', nounPhrase: 'down' }}
  ];
  tests.forEach(test => {
    describe(`Command.parse("${test.input}")`, function() {
      before(function() {
        this.command = null;
        this.parse = () => { this.command = Command.parse(test.input); };
      });
      it(`should not throw any errors`, function() {
        expect(this.parse).to.not.throw();
      });
      it(`command#verbPhrase should be "${test.output.verbPhrase}"`, function() {
        expect(this.command).to.have.property('verbPhrase').that.equals(test.output.verbPhrase);
      });
      it(`command#nounPhrase should be "${test.output.nounPhrase}"`, function() {
        expect(this.command).to.have.property('nounPhrase').that.equals(test.output.nounPhrase);
      });
    });
  });
});