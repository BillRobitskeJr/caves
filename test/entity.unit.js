const expect = require('chai').expect;
const Entity = require('../lib/entity').default;

describe('Entity', function() {
  describe('new Entity', function() {
    describe('new Entity({states:{numState:1,strState:"test",boolState:true,funcState:()=>"test",objState:{test:"tested"}}})', function() {
      before(function() {
        this.entity = new Entity({states: {
          numState: 1,
          strState: 'test',
          boolState: true,
          funcState: () => 'test',
          objState: {test: 'tested'}
        }});
      });
      it('should be an instance of Entity', function() {
        expect(this.entity).to.be.an('object').that.is.an.instanceof(Entity);
      });
      it('#getState("numState") = 1', function() {
        expect(this.entity.getState('numState')).to.be.a('number').that.equals(1);
      });
      it('#getState("strState") = "test"', function() {
        expect(this.entity.getState('strState')).to.be.a('string').that.equals('test');
      });
      it('#getState("boolState") = true', function() {
        expect(this.entity.getState('boolState')).to.be.a('boolean').that.is.true;
      });
      it('#getState("funcState") = "test"', function() {
        expect(this.entity.getState('funcState')).to.be.a('string').that.equals('test');
      });
      it('#getState("objState") = {test: "tested"}', function() {
        expect(this.entity.getState('objState')).to.be.an('object').with.property('test').that.is.a('string').that.equals('tested');
      });
    });
  });
  describe('#getState & #setState', function() {
    describe('#getState("test") = "not tested" before #setState("test", "tested")', function() {
      before(function() {
        this.entity = new Entity({states: {
          test: 'not tested'
        }});
        this.setState = () => { this.entity.setState('test', 'tested'); };
      });
      it('#getState("test") = "not tested" before #setState call', function() {
        expect(this.entity.getState('test')).to.equal('not tested');
      });
      it('#setState("test", "tested") throws no errors', function() {
        expect(this.setState).to.not.throw();
      });
      it('#getState("test") = "tested") after #setState call', function() {
        expect(this.entity.getState('test')).to.equal('tested');
      });
    });
  });
  describe('#serialize & #deserialize', function() {
    describe('when entity1 = new Entity({states:{test:"tested"}}) and entity2 = new Entity()', function (){
      before(function() {
        this.entity1 = new Entity({states: {
          test: 'tested'
        }});
        this.entity2 = new Entity();
        this.savedState = null;
        this.serialize = () => { this.savedState = this.entity1.serialize(); };
        this.deserialize = () => { this.entity2.deserialize(this.savedState); };
      });
      it('entity1#getState("test") = "tested" before #serialize call', function() {
        expect(this.entity1.getState('test')).to.equal('tested');
      });
      it('entity2#getState("test") = null before #deserialize call', function() {
        expect(this.entity2.getState('test')).to.be.null;
      });
      it('savedState = entity1#serialize() throws no errors', function() {
        expect(this.serialize).to.not.throw();
      });
      it('savedState is an non-Entity object', function() {
        expect(this.savedState).to.be.an('object').that.is.not.an.instanceof(Entity);
      });
      it('entity1#getState("test") = "tested" after #serialize call', function() {
        expect(this.entity1.getState('test')).to.equal('tested');
      });
      it('entity2#deserialize(savedState) throws no errors', function() {
        expect(this.deserialize).to.not.throw();
      });
      it('entity2#getState("test") = "tested" after #deserialize call', function() {
        expect(this.entity2.getState('test')).to.equal('tested');
      });
      it('entity2#setState("test", "retested") does not change entity1#getState("test")', function() {
        this.entity2.setState('test', 'retested');
        expect(this.entity1.getState('test')).to.equal('tested');
      });
    });
  });
});