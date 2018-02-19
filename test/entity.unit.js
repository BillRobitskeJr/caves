const expect = require('chai').expect;
const Entity = require('../lib/entity').default;

describe('Entity', function() {
  describe('new Entity()', function() {
    before(function() {
      this.entity = null;
      this.create = () => { this.entity = new Entity(); };
    });
    it('should not throw an error', function() {
      expect(this.create).to.not.throw();
    });
  });
  describe('new Entity(null)', function() {
    before(function() {
      this.entity = null;
      this.create = () => { this.entity = new Entity(null); };
    });
    it('should not throw an error', function() {
      expect(this.create).to.not.throw();
    });
  });
  describe('new Entity({})', function() {
    before(function() {
      this.entity = null;
      this.create = () => { this.entity = new Entity({}); };
    });
    it('should not throw an error', function() {
      expect(this.create).to.not.throw();
    });
  });
  describe('new Entity({ states: { test: "tested" } })', function() {
    before(function() {
      this.entity = null;
      this.create = () => { this.entity = new Entity({ states: { test: 'tested' }}); };
    });
    it('should not throw an error', function() {
      expect(this.create).to.not.throw();
    });
    it('#getState("test") should return "tested"', function() {
      expect(this.entity.getState('test')).to.equal('tested');
    });
  });

  describe('#getState("test") & #setState("test", "tested")', function() {
    before(function() {
      this.entity = new Entity();
      this.set = () => { this.entity.setState('test', 'tested'); };
    });
    it('#getState("test") should return null before setting', function() {
      expect(this.entity.getState('test')).to.be.null;
    });
    it('#setState("test", "tested") should not throw an error', function() {
      expect(this.set).to.not.throw();
    });
    it('#getState("test") should return "tested" after setting', function() {
      expect(this.entity.getState('test')).to.equal('tested');
    });
  });
  describe('#getState("test") & #setState("test", () => "tested")', function() {
    before(function() {
      this.entity = new Entity();
      this.set = () => { this.entity.setState('test', () => 'tested'); };
    });
    it('#getState("test") should return null before setting', function() {
      expect(this.entity.getState('test')).to.be.null;
    });
    it('#setState("test", "tested") should not throw an error', function() {
      expect(this.set).to.not.throw();
    });
    it('#getState("test") should return "tested" after setting', function() {
      expect(this.entity.getState('test')).to.equal('tested');
    });
  });
  describe('#serialize() after Entity#setState("test", "tested")', function() {
    before(function() {
      this.entity = new Entity();
      this.entity.setState('test', 'tested');
      this.stringify = () => { JSON.stringify(this.entity.serialize()); };
    });
    it('should return {test:"tested"}', function() {
      expect(this.entity.serialize()).to.be.an('object').with.property('test').that.equals('tested');
    });
    it('should work in JSON.stringify() without error', function() {
      expect(this.stringify).to.not.throw();
    });
  });
  describe('#serialize() after Entity#setState("test", () => "tested")', function() {
    before(function() {
      this.entity = new Entity();
      this.entity.setState('test', () => 'tested');
      this.stringify = () => { JSON.stringify(this.entity.serialize()); };
    });
    it('should return {}', function() {
      expect(this.entity.serialize()).to.be.an('object').that.does.not.have.property('test');
    });
    it('should work in JSON.stringify() without error', function() {
      expect(this.stringify).to.not.throw();
    });
  });
  describe('#deserialize({test:"tested"})', function() {
    before(function() {
      this.entity = new Entity();
      this.deserialize = () => { this.entity.deserialize({test: 'tested'}); };
    });
    it('should not throw an error', function() {
      expect(this.deserialize).to.not.throw();
    });
    it('#getState("test") should return "tested" after calling', function() {
      expect(this.entity.getState('test')).to.equal('tested');
    });
  });
});