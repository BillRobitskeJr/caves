const expect = require('chai').expect;
const CavesEngine = require('../lib/caves-engine').default;
const gameConfig = require('../lib/the-quest/config').default;

class TestingDisplay {
  constructor() {
    this.displayLines = [];
    this.resetFlags();
  }
  get display() { return this.displayLines.join('\n'); }
  resetFlags() {
    this.didPrint = false;
    this.didClear = false;
  }
  print(message) {
    this.displayLines.push(message);
    this.didPrint = true;
  }
  clear() {
    this.displayLines = [];
    this.didClear = true;
  }
}

describe(`"The Quest" Example Game (BDD)`, function() {
  let game = null;
  const mainDisplay = new TestingDisplay();
  const locationDisplay = new TestingDisplay();
  const playerDisplay = new TestingDisplay();

  describe('when initializing game engine', function() {
    const initGame = () => { game = new CavesEngine({
      main: mainDisplay,
      location: locationDisplay,
      player: playerDisplay
    }, gameConfig); };

    after(function() {
      mainDisplay.resetFlags();
      locationDisplay.resetFlags();
      playerDisplay.resetFlags();
    });

    it(`should throw no errors`, function() {
      expect(initGame).to.not.throw();
      expect(game).to.be.an('object').that.is.an.instanceof(CavesEngine).and.is.not.null;
    });
    it(`should display the title screen to the main display`, function() {
      expect(mainDisplay.didPrint).to.be.true;
      expect(mainDisplay.display).to.equal(config.game.titleScreen.join('\n'));
    });
    it(`should clear the location status display`, function() {
      expect(locationDisplay.didClear).to.be.true;
    });
    it(`should clear the player status display`, function() {
      expect(playerDisplay.didClear).to.be.true;
    });
    it(`should expose a #handleInput method`, function() {
      expect(game).to.have.property('handleInput').that.is.a('function');
    });
  });
});
