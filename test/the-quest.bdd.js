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
        expect(mainDisplay.display).to.include(gameConfig.game.openingScreens[0].join('\n'));
      });
      it(`should prompt the player to press Return`, function() {
        const lines = mainDisplay.display.split(/\n/g);
        expect(lines[lines.length - 1]).to.equal('Press Return to continue...');
      });
    });
  });

  describe(`when on the opening screens (to pages)`, function() {
    describe(`when "Return is pressed" (on first page)`, function() {
      const enterCommand = () => { game.handleInput(''); };
      after(function() { resetFlags(); });
      it(`should not throw an error`, function() {
        expect(enterCommand).to.not.throw();
      });
      it(`should clear the main display`, function() {
        expect(mainDisplay.didClear).to.be.true;
      });
      it(`should display the second page of the opening`, function() {
        expect(mainDisplay.display).to.include(gameConfig.game.openingScreens[1].join('\n'));
      });
      it(`should prompt the player to press Return`, function() {
        const lines = mainDisplay.display.split(/\n/g);
        expect(lines[lines.length - 1]).to.equal('Press Return to continue...');
      });
    });
    describe(`when "Return is pressed" again (on last page)`, function() {
      const enterCommand = () => { game.handleInput(''); }
      after(function() { resetFlags(); });
      it(`should not throw an error`, function() {
        expect(enterCommand).to.not.throw();
      });
      it(`should clear the main display`, function() {
        expect(mainDisplay.didClear).to.be.true;
      });
      it(`should display that the user is in the first room`, function() {
        expect(mainDisplay.display).to.include('You are in your living room.');
      });
      it(`should display the room details in the location status display`, function() {
        expect(locationDisplay.display).to.equal(([
          `You are in your living room.`,
          `You can go: north, south, east`,
          `You can see:`,
          `   an old diary`,
          `   a small box`
        ]).join('\n'));
      });
      it(`should display the player's invnentory in the player status display`, function() {
        expect(playerDisplay.display).to.equal(([
          `You are carrying:`,
          `   nothing`,
          `You can carry 5 more.`
        ]).join('\n'));
      });
    });
  });

  describe(`when playing the game`, function() {
    describe(`when no command is entered`, function() {
      const enterCommand = () => { game.handleInput(''); };
      after(function() {
        resetFlags();
      });
      it(`should not throw an error`, function() {
        expect(enterCommand).to.not.throw();
      });
      it(`should not clear the display`, function() {
        expect(mainDisplay.didClear).to.be.false;
      });
      it(`should not print anything`, function() {
        expect(mainDisplay.didPrint).to.be.false;
      });
      it(`should update the location status display`, function() {
        expect(locationDisplay.didClear).to.be.true;
        expect(locationDisplay.display).to.equal(([
          `You are in your living room.`,
          `You can go: north, south, east`,
          `You can see:`,
          `   an old diary`,
          `   a small box`
        ]).join('\n'));
      });
      it(`should update the player status display`, function() {
        expect(playerDisplay.didClear).to.be.true;
        expect(playerDisplay.display).to.equal(([
          `You are carrying:`,
          `   nothing`,
          `You can carry 5 more.`
        ]).join('\n'));
      });
    });
    describe(`when an invalid command is entered`, function() {
      const enterCommand = () => { game.handleInput('invalid'); };
      after(function() {
        resetFlags();
      });
      it(`should not throw an error`, function() {
        expect(enterCommand).to.not.throw();
      });
      it(`should not clear the display`, function() {
        expect(mainDisplay.didClear).to.be.false;
      });
      it(`should display "You don't know how to do that."`, function() {
        const lines = mainDisplay.display.split(/\n/g);
        expect(lines[lines.length - 1]).to.equal(`You don't know how to do that.`);
      });
      it(`should update the location status display`, function() {
        expect(locationDisplay.didClear).to.be.true;
        expect(locationDisplay.display).to.equal(([
          `You are in your living room.`,
          `You can go: north, south, east`,
          `You can see:`,
          `   an old diary`,
          `   a small box`
        ]).join('\n'));
      });
      it(`should update the player status display`, function() {
        expect(playerDisplay.didClear).to.be.true;
        expect(playerDisplay.display).to.equal(([
          `You are carrying:`,
          `   nothing`,
          `You can carry 5 more.`
        ]).join('\n'));
      });
    });
    describe(`when "quit" is entered`, function() {
      const enterCommand = () => { game.handleInput('quit'); };
      after(function() {
        resetFlags();
      });
      it(`should not throw an error`, function() {
        expect(enterCommand).to.not.throw();
      });
      it(`should not clear the display`, function() {
        expect(mainDisplay.didClear).to.be.false;
      });
      it(`should prompt the user "Do you want to quit? (Yes/no)"`, function() {
        const lines = mainDisplay.display.split(/\n/g);
        expect(lines[lines.length - 1]).to.equal(`Do you want to quit? (Yes/no)`);
      });
      it(`should not change the location status display`, function() {
        expect(locationDisplay.didClear).to.be.false;
        expect(locationDisplay.didPrint).to.be.false;
      });
      it(`should not change the player status display`, function() {
        expect(playerDisplay.didClear).to.be.false;
        expect(playerDisplay.didPrint).to.be.false;
      });
    });
    describe(`when "no" is entered after "quit"`, function() {
      const enterCommand = () => { game.handleInput('no'); };
      after(function() {
        resetFlags();
      });
      it(`should not throw an error`, function() {
        expect(enterCommand).to.not.throw();
      });
      it(`should not clear the display`, function() {
        expect(mainDisplay.didClear).to.be.false;
      });
      it(`should display the room the player is in`, function() {
        const lines = mainDisplay.display.split(/\n/g);
        expect(lines[lines.length - 1]).to.equal(`You are in your living room.`);
      });
      it(`should update the location status display`, function() {
        expect(locationDisplay.didClear).to.be.true;
        expect(locationDisplay.display).to.equal(([
          `You are in your living room.`,
          `You can go: north, south, east`,
          `You can see:`,
          `   an old diary`,
          `   a small box`
        ]).join('\n'));
      });
      it(`should update the player status display`, function() {
        expect(playerDisplay.didClear).to.be.true;
        expect(playerDisplay.display).to.equal(([
          `You are carrying:`,
          `   nothing`,
          `You can carry 5 more.`
        ]).join('\n'));
      });
    });
    describe(`when neither "yes" nor "no" is entered after "quit"`, function() {
      const enterCommand = () => { game.handleInput('maybe?'); };
      before(function() {
        game.handleInput('quit');
      });
      after(function() {
        resetFlags();
      });
      it(`should not throw an error`, function() {
        expect(enterCommand).to.not.throw();
      });
      it(`should not clear the display`, function() {
        expect(mainDisplay.didClear).to.be.false;
      });
      it(`should reprompt the user`, function() {
        const lines = mainDisplay.display.split(/\n/g);
        expect(lines[lines.length - 1]).to.equal(`Do you want to quit? (Yes/no)`);
        expect(lines[lines.length - 2]).to.equal(`Do you want to quit? (Yes/no)`);
      });
      it(`should not change the location status display`, function() {
        expect(locationDisplay.didClear).to.be.false;
        expect(locationDisplay.didPrint).to.be.false;
      });
      it(`should not change the player status display`, function() {
        expect(playerDisplay.didClear).to.be.false;
        expect(playerDisplay.didPrint).to.be.false;
      });
    });
    describe(`when "yes" is entered after "quit"`, function() {
      const enterCommand = () => { game.handleInput('yes'); };
      after(function() {
        resetFlags();
      });
      it(`should not throw an error`, function() {
        expect(enterCommand).to.not.throw();
      });
      it(`should clear the display`, function() {
        expect(mainDisplay.didClear).to.be.true;
      });
      it(`should display the title screen`, function() {
        expect(mainDisplay.display).to.equal(gameConfig.game.titleScreen.join('\n'));
      });
      it(`should clear the location status display`, function() {
        expect(locationDisplay.didClear).to.be.true;
        expect(locationDisplay.didPrint).to.be.false;
      });
      it(`should clear the player status display`, function() {
        expect(playerDisplay.didClear).to.be.true;
        expect(playerDisplay.didPrint).to.be.false;
      });
    });
  });

  describe(`when playing through the game`, function() {
    before(function() {
      game.handleInput('start');
      game.handleInput('');
      game.handleInput('');
    });
    describe(`when "go south" is entered`, function() {
      const enterCommand = () => { game.handleInput('go south'); };
      after(function() {
        resetFlags();
      });
      it(`should not throw any errors`, function() {
        expect(enterCommand).to.not.throw();
      });
      it(`should display "You are in the library." in the main display`, function() {
        const lines = mainDisplay.display.split(/\n/g);
        expect(lines[lines.length - 1]).to.equal('You are in the library.');
      });
      it(`should update the location status display`, function() {
        expect(locationDisplay.didClear).to.be.true;
        expect(locationDisplay.display).to.equal(([
          `You are in the library.`,
          `You can go: north`,
          `You can see:`,
          `   a dictionary`
        ]).join('\n'));
      });
      it(`should update the player status display`, function() {
        expect(playerDisplay.didClear).to.be.true;
        expect(playerDisplay.display).to.equal(([
          `You are carrying:`,
          `   nothing`,
          `You can carry 5 more.`
        ]).join('\n'));
      });
    });
    describe(`when "get dictionary" is entered`, function() {
      const enterCommand = () => { game.handleInput('get dictionary'); };
      after(function() { resetFlags(); });
      it(`should not throw any errors`, function() {
        expect(enterCommand).to.not.throw();
      });
      it(`should display "You pick up a dictionary." in the main display`, function() {
        const lines = mainDisplay.display.split(/\n/g);
        expect(lines[lines.length - 1]).to.equal('You pick up a dictionary.');
      });
      it(`should update the location status display`, function() {
        expect(locationDisplay.didClear).to.be.true;
        expect(locationDisplay.display).to.equal(([
          `You are in the library.`,
          `You can go: north`,
          `You can see:`,
          `   nothing of interest`
        ]).join('\n'));
      });
      it(`should update the player status display`, function() {
        expect(playerDisplay.didClear).to.be.true;
        expect(playerDisplay.display).to.equal(([
          `You are carrying:`,
          `   a dictionary`,
          `You can carry 4 more.`
        ]).join('\n'));
      });
    });
    describe(`when "go north" is entered`, function() {
      const enterCommand = () => { game.handleInput('go north'); };
      after(function() {
        resetFlags();
      });
      it(`should not throw any errors`, function() {
        expect(enterCommand).to.not.throw();
      });
      it(`should display "You are in your living room." in the main display`, function() {
        const lines = mainDisplay.display.split(/\n/g);
        expect(lines[lines.length - 1]).to.equal('You are in your living room.');
      });
      it(`should update the location status display`, function() {
        expect(locationDisplay.didClear).to.be.true;
        expect(locationDisplay.display).to.equal(([
          `You are in your living room.`,
          `You can go: north, south, east`,
          `You can see:`,
          `   an old diary`,
          `   a small box`
        ]).join('\n'));
      });
      it(`should update the player status display`, function() {
        expect(playerDisplay.didClear).to.be.true;
        expect(playerDisplay.display).to.equal(([
          `You are carrying:`,
          `   a dictionary`,
          `You can carry 4 more.`
        ]).join('\n'));
      });
    });
    describe(`when "go east" is entered`, function() {
      const enterCommand = () => { game.handleInput('go east'); };
      after(function() {
        resetFlags();
      });
      it(`should not throw any errors`, function() {
        expect(enterCommand).to.not.throw();
      });
      it(`should display "You are in the kitchen." in the main display`, function() {
        const lines = mainDisplay.display.split(/\n/g);
        expect(lines[lines.length - 1]).to.equal('You are in the kitchen.');
      });
      it(`should update the location status display`, function() {
        expect(locationDisplay.didClear).to.be.true;
        expect(locationDisplay.display).to.equal(([
          `You are in the kitchen.`,
          `You can go: west`,
          `You can see:`,
          `   cabinet`
        ]).join('\n'));
      });
      it(`should update the player status display`, function() {
        expect(playerDisplay.didClear).to.be.true;
        expect(playerDisplay.display).to.equal(([
          `You are carrying:`,
          `   a dictionary`,
          `You can carry 4 more.`
        ]).join('\n'));
      });
    });
    describe(`when "go west" is entered`, function() {
      const enterCommand = () => { game.handleInput('go west'); };
      after(function() {
        resetFlags();
      });
      it(`should not throw any errors`, function() {
        expect(enterCommand).to.not.throw();
      });
      it(`should display "You are in your living room." in the main display`, function() {
        const lines = mainDisplay.display.split(/\n/g);
        expect(lines[lines.length - 1]).to.equal('You are in your living room.');
      });
      it(`should update the location status display`, function() {
        expect(locationDisplay.didClear).to.be.true;
        expect(locationDisplay.display).to.equal(([
          `You are in your living room.`,
          `You can go: north, south, east`,
          `You can see:`,
          `   an old diary`,
          `   a small box`
        ]).join('\n'));
      });
      it(`should update the player status display`, function() {
        expect(playerDisplay.didClear).to.be.true;
        expect(playerDisplay.display).to.equal(([
          `You are carrying:`,
          `   a dictionary`,
          `You can carry 4 more.`
        ]).join('\n'));
      });
    });
    describe(`when "go north" is entered`, function() {
      const enterCommand = () => { game.handleInput('go north'); };
      after(function() {
        resetFlags();
      });
      it(`should not throw any errors`, function() {
        expect(enterCommand).to.not.throw();
      });
      it(`should display "You are in the front yard." in the main display`, function() {
        const lines = mainDisplay.display.split(/\n/g);
        expect(lines[lines.length - 1]).to.equal('You are in the front yard.');
      });
      it(`should update the location status display`, function() {
        expect(locationDisplay.didClear).to.be.true;
        expect(locationDisplay.display).to.equal(([
          `You are in the front yard.`,
          `You can go: south, west`,
          `You can see:`,
          `   wooden barrel`
        ]).join('\n'));
      });
      it(`should update the player status display`, function() {
        expect(playerDisplay.didClear).to.be.true;
        expect(playerDisplay.display).to.equal(([
          `You are carrying:`,
          `   a dictionary`,
          `You can carry 4 more.`
        ]).join('\n'));
      });
    });
    describe(`when "go west" is entered`, function() {
      const enterCommand = () => { game.handleInput('go west'); };
      after(function() {
        resetFlags();
      });
      it(`should not throw any errors`, function() {
        expect(enterCommand).to.not.throw();
      });
      it(`should display "You are in the garage." in the main display`, function() {
        const lines = mainDisplay.display.split(/\n/g);
        expect(lines[lines.length - 1]).to.equal('You are in the garage.');
      });
      it(`should update the location status display`, function() {
        expect(locationDisplay.didClear).to.be.true;
        expect(locationDisplay.display).to.equal(([
          `You are in the garage.`,
          `You can go: east`,
          `You can see:`,
          `   a ladder`,
          `   a shovel`
        ]).join('\n'));
      });
      it(`should update the player status display`, function() {
        expect(playerDisplay.didClear).to.be.true;
        expect(playerDisplay.display).to.equal(([
          `You are carrying:`,
          `   a dictionary`,
          `You can carry 4 more.`
        ]).join('\n'));
      });
    });
    describe(`when "take ladder" is entered`, function() {
      const enterCommand = () => { game.handleInput('take ladder'); };
      after(function() { resetFlags(); });
      it(`should not throw any errors`, function() {
        expect(enterCommand).to.not.throw();
      });
      it(`should display "You pick up a ladder." in the main display`, function() {
        const lines = mainDisplay.display.split(/\n/g);
        expect(lines[lines.length - 1]).to.equal('You pick up a ladder.');
      });
      it(`should update the location status display`, function() {
        expect(locationDisplay.didClear).to.be.true;
        expect(locationDisplay.display).to.equal(([
          `You are in the garage.`,
          `You can go: east`,
          `You can see:`,
          `   a shovel`
        ]).join('\n'));
      });
      it(`should update the player status display`, function() {
        expect(playerDisplay.didClear).to.be.true;
        expect(playerDisplay.display).to.equal(([
          `You are carrying:`,
          `   a dictionary`,
          `   a ladder`,
          `You can carry 3 more.`
        ]).join('\n'));
      });
    });
    describe(`when "get shovel" is entered`, function() {
      const enterCommand = () => { game.handleInput('get shovel'); };
      after(function() { resetFlags(); });
      it(`should not throw any errors`, function() {
        expect(enterCommand).to.not.throw();
      });
      it(`should display "You pick up a shovel." in the main display`, function() {
        const lines = mainDisplay.display.split(/\n/g);
        expect(lines[lines.length - 1]).to.equal('You pick up a shovel.');
      });
      it(`should update the location status display`, function() {
        expect(locationDisplay.didClear).to.be.true;
        expect(locationDisplay.display).to.equal(([
          `You are in the garage.`,
          `You can go: east`,
          `You can see:`,
          `   nothing of interest`
        ]).join('\n'));
      });
      it(`should update the player status display`, function() {
        expect(playerDisplay.didClear).to.be.true;
        expect(playerDisplay.display).to.equal(([
          `You are carrying:`,
          `   a dictionary`,
          `   a ladder`,
          `   a shovel`,
          `You can carry 2 more.`
        ]).join('\n'));
      });
    });
    describe(`when "go east" is entered`, function() {
      const enterCommand = () => { game.handleInput('go east'); };
      after(function() {
        resetFlags();
      });
      it(`should not throw any errors`, function() {
        expect(enterCommand).to.not.throw();
      });
      it(`should display "You are in the front yard." in the main display`, function() {
        const lines = mainDisplay.display.split(/\n/g);
        expect(lines[lines.length - 1]).to.equal('You are in the front yard.');
      });
      it(`should update the location status display`, function() {
        expect(locationDisplay.didClear).to.be.true;
        expect(locationDisplay.display).to.equal(([
          `You are in the front yard.`,
          `You can go: south, west`,
          `You can see:`,
          `   wooden barrel`
        ]).join('\n'));
      });
      it(`should update the player status display`, function() {
        expect(playerDisplay.didClear).to.be.true;
        expect(playerDisplay.display).to.equal(([
          `You are carrying:`,
          `   a dictionary`,
          `   a ladder`,
          `   a shovel`,
          `You can carry 2 more.`
        ]).join('\n'));
      });
    });
  });
});
