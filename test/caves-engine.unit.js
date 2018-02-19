const expect = require('chai').expect;
const CavesEngine = require('../lib/caves-engine').default;

describe('CavesEngine', function() {
  describe('new CavesEngine()', function() {
    before(function() {
      this.engine = null;
      this.create = () => { this.engine = new CavesEngine(); };
    });
    it('should not throw an error', function() {
      expect(this.create).to.not.throw();
    });
  });
  describe('#handleInput()', function() {
    before(function() {
      this.engine = new CavesEngine();
    });
    it('should not thrown an error', function() {
      expect(this.engine.handleInput).to.not.throw();
    });
  });
});