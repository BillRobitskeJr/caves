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
  const resetFlags = () => {
    mainDisplay.resetFlags();
    locationDisplay.resetFlags();
    playerDisplay.resetFlags();
  };

  describe('when initializing game engine', function() {
    const initGame = () => { game = new CavesEngine({
      main: mainDisplay,
      location: locationDisplay,
      player: playerDisplay
    }, gameConfig); };

    after(function() { resetFlags(); });
    it(`should throw no errors`, function() {
      expect(initGame).to.not.throw();
      expect(game).to.be.an('object').that.is.an.instanceof(CavesEngine).and.is.not.null;
    });
    it(`should display the title screen to the main display`, function() {
      expect(mainDisplay.didPrint).to.be.true;
      expect(mainDisplay.display).to.equal(gameConfig.game.titleScreen.join('\n'));
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

  describe(`when on the title screen`, function() {
    describe(`when no command is entered`, function() {
      const enterCommand = () => { game.handleInput(''); }
      after(function() { resetFlags(); });
      it(`should not throw an error`, function() {
        expect(enterCommand).to.not.throw();
      });
      it(`should display the title screen`, function() {
        expect(mainDisplay.didClear).to.be.true;
        expect(mainDisplay.didPrint).to.be.true;
        expect(mainDisplay.display).to.equal(gameConfig.game.titleScreen.join('\n'));
      });
    });
    describe(`when an invalid command is entered`, function() {
      const enterCommand = () => { game.handleInput('invalid'); }
      after(function() { resetFlags(); });
      it(`should not throw an error`, function() {
        expect(enterCommand).to.not.throw();
      });
      it(`should display the title screen`, function() {
        expect(mainDisplay.didClear).to.be.true;
        expect(mainDisplay.didPrint).to.be.true;
        expect(mainDisplay.display).to.equal(gameConfig.game.titleScreen.join('\n'));
      });
    });
    describe(`when "start" is entered`, function() {
      const enterCommand = () => { game.handleInput('start'); }
      after(function() { resetFlags(); });
      it(`should not throw an error`, function() {
        expect(enterCommand).to.not.throw();
      });
      it(`should clear the main display`, function() {
        expect(mainDisplay.didClear).to.be.true;
      });
      it(`should display the first page of the opening`, function() {
        expect(mainDisplay.didPrint).to.be.true;
        expect(mainDisplay.display.indexOf(gameConfig.game.openingScreens[0].join('\n'))).to.not.equal(-1);
      });
      it(`should prompt the player to press Return`, function() {
        const lines = mainDisplay.display.split(/\n/g);
        expect(lines[lines.length - 1]).to.equal('Press Return to continue...');
      });
    });
  });
});
