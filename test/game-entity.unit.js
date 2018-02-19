const expect = require('chai').expect;
const GameEntity = require('../lib/game-entity').default;
const Entity = require('../lib/entity').default;

describe('GameEntity', function() {
  describe('new GameEntity()', function() {
    before(function() {
      this.gameEntity = null;
      this.create = () => { this.gameEntity = new GameEntity(); };
    });
    it('should not throw an error', function() {
      expect(this.create).to.not.throw();
    });
    it('should be an instance of Entity', function() {
      expect(this.gameEntity).is.instanceof(Entity);
    });
  });
  describe('new GameEntity(null)', function() {
    before(function() {
      this.gameEntity = null;
      this.create = () => { this.gameEntity = new GameEntity(null); };
    });
    it('should not throw an error', function() {
      expect(this.create).to.not.throw();
    });
    it('should be an instance of Entity', function() {
      expect(this.gameEntity).is.instanceof(Entity);
    });
  });
  describe('new GameEntity({})', function() {
    before(function() {
      this.gameEntity = null;
      this.create = () => { this.gameEntity = new GameEntity({}); };
    });
    it('should not throw an error', function() {
      expect(this.create).to.not.throw();
    });
    it('should be an instance of Entity', function() {
      expect(this.gameEntity).is.instanceof(Entity);
    });
  });
  describe('new GameEntity({states: {test: "tested"}})', function() {
    before(function() {
      this.gameEntity = null;
      this.create = () => { this.gameEntity = new GameEntity({states: {test: 'tested'}}); };
    });
    it('should not throw an error', function() {
      expect(this.create).to.not.throw();
    });
    it('should be an instance of Entity', function() {
      expect(this.gameEntity).is.instanceof(Entity);
    });
    it('#getState("test") should equal "tested"', function() {
      expect(this.gameEntity.getState('test')).to.equal('tested');
    });
  });
});