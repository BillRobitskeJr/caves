/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Entity = /** @class */ (function () {
    function Entity(config) {
        var _this = this;
        this.states = {};
        var states = config.states || {};
        Object.keys(states).forEach(function (key) { _this.states[key] = states[key]; });
    }
    Entity.prototype.getState = function (key) {
        if (!this.states.hasOwnProperty(key))
            return null;
        return typeof this.states[key] === 'function' ? this.states[key]() : this.states[key];
    };
    Entity.prototype.setState = function (key, value) {
        this.states[key] = value;
    };
    return Entity;
}());
exports.default = Entity;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var caves_engine_1 = __webpack_require__(2);
window.DM = window.DM || {};
window.DM.CavesEngine = caves_engine_1.default;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var game_entity_1 = __webpack_require__(3);
var player_entity_1 = __webpack_require__(4);
var location_entity_1 = __webpack_require__(5);
var object_entity_1 = __webpack_require__(6);
var collection_1 = __webpack_require__(7);
var command_1 = __webpack_require__(8);
var GameState;
(function (GameState) {
    GameState[GameState["title"] = 0] = "title";
    GameState[GameState["opening"] = 1] = "opening";
    GameState[GameState["playing"] = 2] = "playing";
    GameState[GameState["ending"] = 3] = "ending";
    GameState[GameState["loading"] = 4] = "loading";
    GameState[GameState["saving"] = 5] = "saving";
})(GameState = exports.GameState || (exports.GameState = {}));
var CavesEngine = /** @class */ (function () {
    function CavesEngine(outputs, config) {
        this.outputs = outputs;
        this.config = config;
        this.gameState = GameState.title;
        this.gameEntity = new game_entity_1.default(config.game || {});
        this.displayTitleScreen();
    }
    CavesEngine.prototype.handleInput = function (input) {
        switch (this.gameState) {
            case GameState.title:
                this.handleTitleInput(input.trim());
                break;
            case GameState.opening:
                this.handleOpeningInput(input.trim());
                break;
            case GameState.playing:
                this.handlePlayingInput(input.trim());
                break;
        }
    };
    CavesEngine.prototype.handleTitleInput = function (input) {
        if (input.match(/^start$/i)) {
            this.startOpening();
        }
        else {
            this.displayTitleScreen();
        }
    };
    CavesEngine.prototype.handleOpeningInput = function (input) {
        this.gameEntity.setState('openingPage', this.gameEntity.getState('openingPage') + 1);
        if (this.gameEntity.openingScreen) {
            this.displayOpeningScreen();
        }
        else {
            this.startPlaying();
        }
    };
    CavesEngine.prototype.handlePlayingInput = function (input) {
        var _this = this;
        if (this.gameEntity.getState('isQuitting')) {
            if (input.match(/^y(es)?$/i)) {
                this.gameEntity.setState('isQuitting', false);
                this.gameState = GameState.title;
                this.displayTitleScreen();
            }
            else if (input.match(/^n(o)?$/i)) {
                this.gameEntity.setState('isQuitting', false);
                var location_1 = this.gameEntity.player.location;
                var locationName = location_1 ? location_1.name : 'nowhere';
                this.outputs.main.print("You are " + locationName + ".");
            }
            else {
                this.displayPlayingQuitPrompt();
            }
        }
        else if (input.match(/^quit$/i)) {
            this.gameEntity.setState('isQuitting', true);
            this.displayPlayingQuitPrompt();
        }
        else if (input) {
            var command = command_1.default.parse(input, this.gameEntity);
            var behavior = this.gameEntity.player.getBehaviorForCommand(command);
            if (behavior) {
                var output = behavior();
                output.forEach(function (line) { _this.outputs.main.print(line); });
            }
            else {
                this.outputs.main.print("You don't know how to do that.");
            }
        }
        if (this.gameState === GameState.playing && !this.gameEntity.getState('isQuitting'))
            this.displayPlayingTurnStart();
    };
    CavesEngine.prototype.startOpening = function () {
        this.gameState = GameState.opening;
        this.gameEntity.setState('openingPage', 0);
        this.displayOpeningScreen();
    };
    CavesEngine.prototype.startPlaying = function () {
        var _this = this;
        this.gameState = GameState.playing;
        this.gameEntity.player = new player_entity_1.default(this.config.player || {}, this.gameEntity);
        this.gameEntity.locations = new collection_1.default((this.config.locations || []).map(function (config) { return new location_entity_1.default(config, _this.gameEntity); }));
        this.gameEntity.objects = new collection_1.default((this.config.objects || []).map(function (config) { return new object_entity_1.default(config, _this.gameEntity); }));
        this.outputs.main.clear();
        var location = (this.gameEntity.player.location || { name: 'nowhere' });
        this.outputs.main.print("You are " + location.name + ".");
        this.displayPlayingTurnStart();
    };
    CavesEngine.prototype.displayTitleScreen = function () {
        var _this = this;
        this.outputs.main.clear();
        this.gameEntity.titleScreen.forEach(function (line) { _this.outputs.main.print(line); });
        this.outputs.location.clear();
        this.outputs.player.clear();
    };
    CavesEngine.prototype.displayOpeningScreen = function () {
        var _this = this;
        this.outputs.main.clear();
        this.gameEntity.openingScreen.forEach(function (line) { _this.outputs.main.print(line); });
        this.outputs.main.print("Press Return to continue...");
        this.outputs.location.clear();
        this.outputs.player.clear();
    };
    CavesEngine.prototype.displayPlayingTurnStart = function () {
        var _this = this;
        this.outputs.location.clear();
        this.gameEntity.locationStatusScreen.forEach(function (line) { _this.outputs.location.print(line); });
        this.outputs.player.clear();
        this.gameEntity.playerStatusScreen.forEach(function (line) { _this.outputs.player.print(line); });
    };
    CavesEngine.prototype.displayPlayingQuitPrompt = function () {
        this.outputs.main.print("Do you want to quit? (Yes/no)");
    };
    return CavesEngine;
}());
exports.default = CavesEngine;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var entity_1 = __webpack_require__(0);
var GameEntity = /** @class */ (function (_super) {
    __extends(GameEntity, _super);
    function GameEntity(config) {
        var _this = _super.call(this, config) || this;
        _this.setState('titleScreen', config.titleScreen || ['']);
        _this.setState('openingScreens', config.openingScreens || [['']]);
        _this.setState('openingPage', 0);
        return _this;
    }
    Object.defineProperty(GameEntity.prototype, "player", {
        get: function () { return this.playerEntity; },
        set: function (playerEntity) { this.playerEntity = playerEntity; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameEntity.prototype, "locations", {
        get: function () { return this.locationEntities; },
        set: function (locationEntities) { this.locationEntities = locationEntities; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameEntity.prototype, "objects", {
        get: function () { return this.objectEntities; },
        set: function (objectEntities) { this.objectEntities = objectEntities; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameEntity.prototype, "titleScreen", {
        get: function () { return this.getState('titleScreen'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameEntity.prototype, "openingScreen", {
        get: function () { return this.getState('openingScreens')[this.getState('openingPage')]; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameEntity.prototype, "locationStatusScreen", {
        get: function () {
            var location = this.player.location;
            var exits = location ? location.exits : [];
            var exitDirections = exits.length > 0 ? exits.map(function (exit) { return exit.direction; }).join(', ') : 'nowhere';
            var contents = location ? location.contents : [];
            var contentNames = contents.length > 0 ? contents.map(function (object) { return "   " + object.name; }) : '   nothing of interest';
            // const contents = ['   nothing of interest'];
            return ([
                "You are " + (location ? location.name : 'nowhere') + ".",
                "You can go: " + exitDirections,
                "You can see:"
            ]).concat(contentNames);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameEntity.prototype, "playerStatusScreen", {
        get: function () {
            var inventory = this.player.inventory;
            var carryNames = inventory.length > 0 ? inventory.map(function (object) { return "   " + object.name; }) : ['   nothing'];
            var remainingCarry = this.player.getState('maxCarry') - inventory.length;
            return ([
                "You are carrying:"
            ]).concat(carryNames).concat([
                "You can carry " + remainingCarry + " more."
            ]);
        },
        enumerable: true,
        configurable: true
    });
    return GameEntity;
}(entity_1.default));
exports.default = GameEntity;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var entity_1 = __webpack_require__(0);
var PlayerEntity = /** @class */ (function (_super) {
    __extends(PlayerEntity, _super);
    function PlayerEntity(config, gameEntity) {
        var _this = _super.call(this, config) || this;
        _this.gameEntity = gameEntity;
        _this.setState('maxCarry', config.maxCarry || 0);
        _this.setState('location', config.location || 1);
        return _this;
    }
    Object.defineProperty(PlayerEntity.prototype, "inventory", {
        get: function () { return []; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlayerEntity.prototype, "location", {
        get: function () {
            var _this = this;
            return this.gameEntity.locations.findOne(function (location) { return location.id === _this.getState('location'); });
        },
        enumerable: true,
        configurable: true
    });
    PlayerEntity.prototype.getBehaviorForCommand = function (command) {
        var _this = this;
        var mapping = PlayerEntity.defaultBehaviorMappings.filter(function (mapping) { return mapping.verbExpression.test(command.verbPhrase); })[0];
        if (!mapping)
            return null;
        var behavior = PlayerEntity.defaultBehaviors[mapping.behaviorKey];
        if (!behavior)
            return null;
        return function () { return behavior.apply(_this, mapping.behaviorPropertyMapper(command, _this)); };
    };
    Object.defineProperty(PlayerEntity, "defaultBehaviorMappings", {
        get: function () {
            return [
                { verbExpression: /^go$/i, behaviorKey: 'move', behaviorPropertyMapper: function (command, self) { return [command.nounPhrase, self]; } }
            ];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlayerEntity, "defaultBehaviors", {
        get: function () {
            return {
                move: function (direction, self) {
                    if (!self.location)
                        return ["You can't move!"];
                    var exit = self.location.exits.filter(function (exit) { return exit.direction === direction; })[0];
                    if (!exit)
                        return ["You can't go there."];
                    self.setState('location', exit.destination);
                    var location = self.location || { name: 'nowhere' };
                    return [
                        "You head " + direction + ".",
                        "You are " + location.name + "."
                    ];
                }
            };
        },
        enumerable: true,
        configurable: true
    });
    return PlayerEntity;
}(entity_1.default));
exports.default = PlayerEntity;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var entity_1 = __webpack_require__(0);
var LocationEntity = /** @class */ (function (_super) {
    __extends(LocationEntity, _super);
    function LocationEntity(config, gameEntity) {
        var _this = _super.call(this, config) || this;
        _this.gameEntity = gameEntity;
        _this.setState('id', config.id);
        _this.setState('name', config.name);
        _this.setState('exits', config.exits || []);
        return _this;
    }
    Object.defineProperty(LocationEntity.prototype, "id", {
        get: function () { return this.getState('id'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LocationEntity.prototype, "name", {
        get: function () { return this.getState('name'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LocationEntity.prototype, "exits", {
        get: function () { return this.getState('exits'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LocationEntity.prototype, "contents", {
        get: function () {
            var _this = this;
            return this.gameEntity.objects.findAll(function (object) { return object.getState('location') === _this.id; });
        },
        enumerable: true,
        configurable: true
    });
    return LocationEntity;
}(entity_1.default));
exports.default = LocationEntity;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var entity_1 = __webpack_require__(0);
var ObjectEntity = /** @class */ (function (_super) {
    __extends(ObjectEntity, _super);
    function ObjectEntity(config, gameEntity) {
        var _this = _super.call(this, config) || this;
        _this.gameEntity = gameEntity;
        _this.setState('id', config.id);
        _this.setState('name', config.name);
        _this.setState('tags', config.tags);
        _this.setState('location', config.location || null);
        return _this;
    }
    Object.defineProperty(ObjectEntity.prototype, "id", {
        get: function () { return this.getState('id'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ObjectEntity.prototype, "name", {
        get: function () { return this.getState('name'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ObjectEntity.prototype, "location", {
        get: function () {
            return null;
        },
        enumerable: true,
        configurable: true
    });
    return ObjectEntity;
}(entity_1.default));
exports.default = ObjectEntity;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Collection = /** @class */ (function () {
    function Collection(items) {
        this.items = items.map(function (item) { return item; });
    }
    Collection.prototype.findOne = function (findFunc) {
        return this.items.filter(findFunc)[0] || null;
    };
    Collection.prototype.findAll = function (findFunc) {
        return this.items.filter(findFunc);
    };
    return Collection;
}());
exports.default = Collection;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Command = /** @class */ (function () {
    function Command(config) {
        this.verbPhrase = config.verbPhrase;
        this.nounPhrase = config.nounPhrase;
    }
    Command.parse = function (input, gameEntity) {
        var words = input.split(/\s+/g);
        var verbPhrase = [words[0]];
        var nounPhrase = words.slice(1);
        return new Command({
            verbPhrase: verbPhrase.join(' '),
            nounPhrase: nounPhrase.join(' ')
        });
    };
    return Command;
}());
exports.default = Command;


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgOGUwMTQ3ZTA1MDFhMjI5ODllYTAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2VudGl0eS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NhdmVzLWVuZ2luZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZ2FtZS1lbnRpdHkudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BsYXllci1lbnRpdHkudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2xvY2F0aW9uLWVudGl0eS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvb2JqZWN0LWVudGl0eS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29sbGVjdGlvbi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tbWFuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7QUNyREE7SUFHRSxnQkFBWSxNQUFvQjtRQUFoQyxpQkFLQztRQUpDLElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO1FBRWpCLElBQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLElBQUksRUFBRSxDQUFDO1FBQ25DLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLGFBQUcsSUFB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bnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgOGUwMTQ3ZTA1MDFhMjI5ODllYTAiLCJleHBvcnQgaW50ZXJmYWNlIFN0YXRlc0RpY3Qge1xuICBba2V5OiBzdHJpbmddOiBhbnk7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRW50aXR5Q29uZmlnIHtcbiAgc3RhdGVzPzogU3RhdGVzRGljdDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRW50aXR5IHtcbiAgcHJpdmF0ZSBzdGF0ZXM6IFN0YXRlc0RpY3Q7XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBFbnRpdHlDb25maWcpIHtcbiAgICB0aGlzLnN0YXRlcyA9IHt9O1xuICAgIFxuICAgIGNvbnN0IHN0YXRlcyA9IGNvbmZpZy5zdGF0ZXMgfHwge307XG4gICAgT2JqZWN0LmtleXMoc3RhdGVzKS5mb3JFYWNoKGtleSA9PiB7IHRoaXMuc3RhdGVzW2tleV0gPSBzdGF0ZXNba2V5XTsgfSk7XG4gIH1cblxuICBwdWJsaWMgZ2V0U3RhdGUoa2V5OiBzdHJpbmcpOiBhbnkge1xuICAgIGlmICghdGhpcy5zdGF0ZXMuaGFzT3duUHJvcGVydHkoa2V5KSkgcmV0dXJuIG51bGw7XG4gICAgcmV0dXJuIHR5cGVvZiB0aGlzLnN0YXRlc1trZXldID09PSAnZnVuY3Rpb24nID8gdGhpcy5zdGF0ZXNba2V5XSgpIDogdGhpcy5zdGF0ZXNba2V5XTtcbiAgfVxuXG4gIHB1YmxpYyBzZXRTdGF0ZShrZXk6IHN0cmluZywgdmFsdWU6IGFueSk6IHZvaWQge1xuICAgIHRoaXMuc3RhdGVzW2tleV0gPSB2YWx1ZTtcbiAgfVxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9lbnRpdHkudHMiLCJpbXBvcnQgQ2F2ZXNFbmdpbmUgZnJvbSAnLi9jYXZlcy1lbmdpbmUnO1xuXG4oPGFueT53aW5kb3cpLkRNID0gKDxhbnk+d2luZG93KS5ETSB8fCB7fTtcbig8YW55PndpbmRvdykuRE0uQ2F2ZXNFbmdpbmUgPSBDYXZlc0VuZ2luZTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9pbmRleC50cyIsImltcG9ydCBHYW1lRW50aXR5IGZyb20gJy4vZ2FtZS1lbnRpdHknO1xuaW1wb3J0IHsgR2FtZUVudGl0eUNvbmZpZyB9IGZyb20gJy4vZ2FtZS1lbnRpdHknO1xuaW1wb3J0IFBsYXllckVudGl0eSBmcm9tICcuL3BsYXllci1lbnRpdHknO1xuaW1wb3J0IHsgUGxheWVyRW50aXR5Q29uZmlnIH0gZnJvbSAnLi9wbGF5ZXItZW50aXR5JztcbmltcG9ydCBMb2NhdGlvbkVudGl0eSBmcm9tICcuL2xvY2F0aW9uLWVudGl0eSc7XG5pbXBvcnQgeyBMb2NhdGlvbkVudGl0eUNvbmZpZyB9IGZyb20gJy4vbG9jYXRpb24tZW50aXR5JztcbmltcG9ydCBPYmplY3RFbnRpdHkgZnJvbSAnLi9vYmplY3QtZW50aXR5JztcbmltcG9ydCB7IE9iamVjdEVudGl0eUNvbmZpZyB9IGZyb20gJy4vb2JqZWN0LWVudGl0eSc7XG5pbXBvcnQgQ29sbGVjdGlvbiBmcm9tICcuL2NvbGxlY3Rpb24nO1xuaW1wb3J0IENvbW1hbmQgZnJvbSAnLi9jb21tYW5kJztcblxuZXhwb3J0IGludGVyZmFjZSBPdXRwdXRQcmludEZ1bmMge1xuICAobWVzc2FnZTogc3RyaW5nKTogdm9pZDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBPdXRwdXRDbGVhckZ1bmMge1xuICAoKTogdm9pZDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBPdXRwdXQge1xuICBwcmludDogT3V0cHV0UHJpbnRGdW5jO1xuICBjbGVhcjogT3V0cHV0Q2xlYXJGdW5jO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE91dHB1dHNEaWN0IHtcbiAgbWFpbjogT3V0cHV0O1xuICBsb2NhdGlvbjogT3V0cHV0O1xuICBwbGF5ZXI6IE91dHB1dDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBHYW1lQ29uZmlnIHtcbiAgZ2FtZT86IEdhbWVFbnRpdHlDb25maWc7XG4gIHBsYXllcj86IFBsYXllckVudGl0eUNvbmZpZztcbiAgbG9jYXRpb25zPzogTG9jYXRpb25FbnRpdHlDb25maWdbXTtcbiAgb2JqZWN0cz86IE9iamVjdEVudGl0eUNvbmZpZ1tdO1xufVxuXG5leHBvcnQgZW51bSBHYW1lU3RhdGUge1xuICB0aXRsZSxcbiAgb3BlbmluZyxcbiAgcGxheWluZyxcbiAgZW5kaW5nLFxuICBsb2FkaW5nLFxuICBzYXZpbmdcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2F2ZXNFbmdpbmUge1xuICBwcml2YXRlIG91dHB1dHM6IE91dHB1dHNEaWN0O1xuICBwcml2YXRlIGNvbmZpZzogR2FtZUNvbmZpZztcbiAgcHJpdmF0ZSBnYW1lU3RhdGU6IEdhbWVTdGF0ZTtcbiAgcHJpdmF0ZSBnYW1lRW50aXR5OiBHYW1lRW50aXR5O1xuXG4gIGNvbnN0cnVjdG9yKG91dHB1dHM6IE91dHB1dHNEaWN0LCBjb25maWc6IEdhbWVDb25maWcpIHtcbiAgICB0aGlzLm91dHB1dHMgPSBvdXRwdXRzO1xuICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuICAgIHRoaXMuZ2FtZVN0YXRlID0gR2FtZVN0YXRlLnRpdGxlO1xuICAgIFxuICAgIHRoaXMuZ2FtZUVudGl0eSA9IG5ldyBHYW1lRW50aXR5KGNvbmZpZy5nYW1lIHx8IHt9KTtcbiAgICB0aGlzLmRpc3BsYXlUaXRsZVNjcmVlbigpO1xuICB9XG5cbiAgcHVibGljIGhhbmRsZUlucHV0KGlucHV0OiBzdHJpbmcpOiB2b2lkIHtcbiAgICBzd2l0Y2godGhpcy5nYW1lU3RhdGUpIHtcbiAgICAgIGNhc2UgR2FtZVN0YXRlLnRpdGxlOlxuICAgICAgICB0aGlzLmhhbmRsZVRpdGxlSW5wdXQoaW5wdXQudHJpbSgpKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIEdhbWVTdGF0ZS5vcGVuaW5nOlxuICAgICAgICB0aGlzLmhhbmRsZU9wZW5pbmdJbnB1dChpbnB1dC50cmltKCkpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgR2FtZVN0YXRlLnBsYXlpbmc6XG4gICAgICAgIHRoaXMuaGFuZGxlUGxheWluZ0lucHV0KGlucHV0LnRyaW0oKSk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgaGFuZGxlVGl0bGVJbnB1dChpbnB1dDogc3RyaW5nKTogdm9pZCB7XG4gICAgaWYgKGlucHV0Lm1hdGNoKC9ec3RhcnQkL2kpKSB7XG4gICAgICB0aGlzLnN0YXJ0T3BlbmluZygpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmRpc3BsYXlUaXRsZVNjcmVlbigpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgaGFuZGxlT3BlbmluZ0lucHV0KGlucHV0OiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLmdhbWVFbnRpdHkuc2V0U3RhdGUoJ29wZW5pbmdQYWdlJywgdGhpcy5nYW1lRW50aXR5LmdldFN0YXRlKCdvcGVuaW5nUGFnZScpICsgMSk7XG4gICAgaWYgKHRoaXMuZ2FtZUVudGl0eS5vcGVuaW5nU2NyZWVuKSB7XG4gICAgICB0aGlzLmRpc3BsYXlPcGVuaW5nU2NyZWVuKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc3RhcnRQbGF5aW5nKCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBoYW5kbGVQbGF5aW5nSW5wdXQoaW5wdXQ6IHN0cmluZyk6IHZvaWQge1xuICAgIGlmICh0aGlzLmdhbWVFbnRpdHkuZ2V0U3RhdGUoJ2lzUXVpdHRpbmcnKSkge1xuICAgICAgaWYgKGlucHV0Lm1hdGNoKC9eeShlcyk/JC9pKSkge1xuICAgICAgICB0aGlzLmdhbWVFbnRpdHkuc2V0U3RhdGUoJ2lzUXVpdHRpbmcnLCBmYWxzZSk7XG4gICAgICAgIHRoaXMuZ2FtZVN0YXRlID0gR2FtZVN0YXRlLnRpdGxlO1xuICAgICAgICB0aGlzLmRpc3BsYXlUaXRsZVNjcmVlbigpO1xuICAgICAgfSBlbHNlIGlmIChpbnB1dC5tYXRjaCgvXm4obyk/JC9pKSkge1xuICAgICAgICB0aGlzLmdhbWVFbnRpdHkuc2V0U3RhdGUoJ2lzUXVpdHRpbmcnLCBmYWxzZSk7XG4gICAgICAgIGNvbnN0IGxvY2F0aW9uID0gdGhpcy5nYW1lRW50aXR5LnBsYXllci5sb2NhdGlvbjtcbiAgICAgICAgY29uc3QgbG9jYXRpb25OYW1lID0gbG9jYXRpb24gPyBsb2NhdGlvbi5uYW1lIDogJ25vd2hlcmUnO1xuICAgICAgICB0aGlzLm91dHB1dHMubWFpbi5wcmludChgWW91IGFyZSAke2xvY2F0aW9uTmFtZX0uYCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmRpc3BsYXlQbGF5aW5nUXVpdFByb21wdCgpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoaW5wdXQubWF0Y2goL15xdWl0JC9pKSkge1xuICAgICAgdGhpcy5nYW1lRW50aXR5LnNldFN0YXRlKCdpc1F1aXR0aW5nJywgdHJ1ZSk7XG4gICAgICB0aGlzLmRpc3BsYXlQbGF5aW5nUXVpdFByb21wdCgpO1xuICAgIH0gZWxzZSBpZiAoaW5wdXQpIHtcbiAgICAgIGNvbnN0IGNvbW1hbmQgPSBDb21tYW5kLnBhcnNlKGlucHV0LCB0aGlzLmdhbWVFbnRpdHkpO1xuICAgICAgY29uc3QgYmVoYXZpb3IgPSB0aGlzLmdhbWVFbnRpdHkucGxheWVyLmdldEJlaGF2aW9yRm9yQ29tbWFuZChjb21tYW5kKTtcbiAgICAgIGlmIChiZWhhdmlvcikge1xuICAgICAgICBjb25zdCBvdXRwdXQgPSBiZWhhdmlvcigpO1xuICAgICAgICBvdXRwdXQuZm9yRWFjaChsaW5lID0+IHsgdGhpcy5vdXRwdXRzLm1haW4ucHJpbnQobGluZSk7IH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5vdXRwdXRzLm1haW4ucHJpbnQoYFlvdSBkb24ndCBrbm93IGhvdyB0byBkbyB0aGF0LmApO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGhpcy5nYW1lU3RhdGUgPT09IEdhbWVTdGF0ZS5wbGF5aW5nICYmICF0aGlzLmdhbWVFbnRpdHkuZ2V0U3RhdGUoJ2lzUXVpdHRpbmcnKSkgdGhpcy5kaXNwbGF5UGxheWluZ1R1cm5TdGFydCgpO1xuICB9XG5cbiAgcHJpdmF0ZSBzdGFydE9wZW5pbmcoKTogdm9pZCB7XG4gICAgdGhpcy5nYW1lU3RhdGUgPSBHYW1lU3RhdGUub3BlbmluZztcbiAgICB0aGlzLmdhbWVFbnRpdHkuc2V0U3RhdGUoJ29wZW5pbmdQYWdlJywgMCk7XG4gICAgdGhpcy5kaXNwbGF5T3BlbmluZ1NjcmVlbigpO1xuICB9XG4gIFxuICBwcml2YXRlIHN0YXJ0UGxheWluZygpOiB2b2lkIHtcbiAgICB0aGlzLmdhbWVTdGF0ZSA9IEdhbWVTdGF0ZS5wbGF5aW5nO1xuICAgIHRoaXMuZ2FtZUVudGl0eS5wbGF5ZXIgPSBuZXcgUGxheWVyRW50aXR5KHRoaXMuY29uZmlnLnBsYXllciB8fCB7fSwgdGhpcy5nYW1lRW50aXR5KTtcbiAgICB0aGlzLmdhbWVFbnRpdHkubG9jYXRpb25zID0gbmV3IENvbGxlY3Rpb248TG9jYXRpb25FbnRpdHk+KCh0aGlzLmNvbmZpZy5sb2NhdGlvbnMgfHwgW10pLm1hcChjb25maWcgPT4gbmV3IExvY2F0aW9uRW50aXR5KGNvbmZpZywgdGhpcy5nYW1lRW50aXR5KSkpO1xuICAgIHRoaXMuZ2FtZUVudGl0eS5vYmplY3RzID0gbmV3IENvbGxlY3Rpb248T2JqZWN0RW50aXR5PigodGhpcy5jb25maWcub2JqZWN0cyB8fCBbXSkubWFwKGNvbmZpZyA9PiBuZXcgT2JqZWN0RW50aXR5KGNvbmZpZywgdGhpcy5nYW1lRW50aXR5KSkpO1xuICAgIHRoaXMub3V0cHV0cy5tYWluLmNsZWFyKCk7XG4gICAgY29uc3QgbG9jYXRpb24gPSAodGhpcy5nYW1lRW50aXR5LnBsYXllci5sb2NhdGlvbiB8fCB7bmFtZTogJ25vd2hlcmUnfSk7XG4gICAgdGhpcy5vdXRwdXRzLm1haW4ucHJpbnQoYFlvdSBhcmUgJHtsb2NhdGlvbi5uYW1lfS5gKTtcbiAgICB0aGlzLmRpc3BsYXlQbGF5aW5nVHVyblN0YXJ0KCk7XG4gIH1cblxuICBwcml2YXRlIGRpc3BsYXlUaXRsZVNjcmVlbigpOiB2b2lkIHtcbiAgICB0aGlzLm91dHB1dHMubWFpbi5jbGVhcigpO1xuICAgIHRoaXMuZ2FtZUVudGl0eS50aXRsZVNjcmVlbi5mb3JFYWNoKGxpbmUgPT4geyB0aGlzLm91dHB1dHMubWFpbi5wcmludChsaW5lKTsgfSk7XG4gICAgdGhpcy5vdXRwdXRzLmxvY2F0aW9uLmNsZWFyKCk7XG4gICAgdGhpcy5vdXRwdXRzLnBsYXllci5jbGVhcigpO1xuICB9XG5cbiAgcHJpdmF0ZSBkaXNwbGF5T3BlbmluZ1NjcmVlbigpOiB2b2lkIHtcbiAgICB0aGlzLm91dHB1dHMubWFpbi5jbGVhcigpO1xuICAgIHRoaXMuZ2FtZUVudGl0eS5vcGVuaW5nU2NyZWVuLmZvckVhY2gobGluZSA9PiB7IHRoaXMub3V0cHV0cy5tYWluLnByaW50KGxpbmUpOyB9KTtcbiAgICB0aGlzLm91dHB1dHMubWFpbi5wcmludChgUHJlc3MgUmV0dXJuIHRvIGNvbnRpbnVlLi4uYCk7XG4gICAgdGhpcy5vdXRwdXRzLmxvY2F0aW9uLmNsZWFyKCk7XG4gICAgdGhpcy5vdXRwdXRzLnBsYXllci5jbGVhcigpO1xuICB9XG5cbiAgcHJpdmF0ZSBkaXNwbGF5UGxheWluZ1R1cm5TdGFydCgpOiB2b2lkIHtcbiAgICB0aGlzLm91dHB1dHMubG9jYXRpb24uY2xlYXIoKTtcbiAgICB0aGlzLmdhbWVFbnRpdHkubG9jYXRpb25TdGF0dXNTY3JlZW4uZm9yRWFjaChsaW5lID0+IHsgdGhpcy5vdXRwdXRzLmxvY2F0aW9uLnByaW50KGxpbmUpOyB9KTtcbiAgICB0aGlzLm91dHB1dHMucGxheWVyLmNsZWFyKCk7XG4gICAgdGhpcy5nYW1lRW50aXR5LnBsYXllclN0YXR1c1NjcmVlbi5mb3JFYWNoKGxpbmUgPT4geyB0aGlzLm91dHB1dHMucGxheWVyLnByaW50KGxpbmUpOyB9KTtcbiAgfVxuXG4gIHByaXZhdGUgZGlzcGxheVBsYXlpbmdRdWl0UHJvbXB0KCk6IHZvaWQge1xuICAgIHRoaXMub3V0cHV0cy5tYWluLnByaW50KGBEbyB5b3Ugd2FudCB0byBxdWl0PyAoWWVzL25vKWApO1xuICB9XG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2NhdmVzLWVuZ2luZS50cyIsImltcG9ydCBFbnRpdHkgZnJvbSAnLi9lbnRpdHknO1xuaW1wb3J0IHsgRW50aXR5Q29uZmlnIH0gZnJvbSAnLi9lbnRpdHknO1xuaW1wb3J0IFBsYXllckVudGl0eSBmcm9tICcuL3BsYXllci1lbnRpdHknO1xuaW1wb3J0IExvY2F0aW9uRW50aXR5IGZyb20gJy4vbG9jYXRpb24tZW50aXR5JztcbmltcG9ydCBPYmplY3RFbnRpdHkgZnJvbSAnLi9vYmplY3QtZW50aXR5JztcbmltcG9ydCBDb2xsZWN0aW9uIGZyb20gJy4vY29sbGVjdGlvbic7XG5cbmV4cG9ydCBpbnRlcmZhY2UgR2FtZUVudGl0eUNvbmZpZyBleHRlbmRzIEVudGl0eUNvbmZpZyB7XG4gIHRpdGxlU2NyZWVuPzogc3RyaW5nW107XG4gIG9wZW5pbmdTY3JlZW5zPzogc3RyaW5nW11bXTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZUVudGl0eSBleHRlbmRzIEVudGl0eSB7XG4gIHByaXZhdGUgcGxheWVyRW50aXR5OiBQbGF5ZXJFbnRpdHk7XG4gIHByaXZhdGUgbG9jYXRpb25FbnRpdGllczogQ29sbGVjdGlvbjxMb2NhdGlvbkVudGl0eT47XG4gIHByaXZhdGUgb2JqZWN0RW50aXRpZXM6IENvbGxlY3Rpb248T2JqZWN0RW50aXR5PjtcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IEdhbWVFbnRpdHlDb25maWcpIHtcbiAgICBzdXBlcihjb25maWcpO1xuICAgIHRoaXMuc2V0U3RhdGUoJ3RpdGxlU2NyZWVuJywgY29uZmlnLnRpdGxlU2NyZWVuIHx8IFsnJ10pO1xuICAgIHRoaXMuc2V0U3RhdGUoJ29wZW5pbmdTY3JlZW5zJywgY29uZmlnLm9wZW5pbmdTY3JlZW5zIHx8IFtbJyddXSk7XG5cbiAgICB0aGlzLnNldFN0YXRlKCdvcGVuaW5nUGFnZScsIDApO1xuICB9XG5cbiAgcHVibGljIGdldCBwbGF5ZXIoKTogUGxheWVyRW50aXR5IHsgcmV0dXJuIHRoaXMucGxheWVyRW50aXR5OyB9XG4gIHB1YmxpYyBzZXQgcGxheWVyKHBsYXllckVudGl0eTogUGxheWVyRW50aXR5KSB7IHRoaXMucGxheWVyRW50aXR5ID0gcGxheWVyRW50aXR5OyB9XG5cbiAgcHVibGljIGdldCBsb2NhdGlvbnMoKTogQ29sbGVjdGlvbjxMb2NhdGlvbkVudGl0eT4geyByZXR1cm4gdGhpcy5sb2NhdGlvbkVudGl0aWVzOyB9XG4gIHB1YmxpYyBzZXQgbG9jYXRpb25zKGxvY2F0aW9uRW50aXRpZXM6IENvbGxlY3Rpb248TG9jYXRpb25FbnRpdHk+KSB7IHRoaXMubG9jYXRpb25FbnRpdGllcyA9IGxvY2F0aW9uRW50aXRpZXM7IH1cblxuICBwdWJsaWMgZ2V0IG9iamVjdHMoKTogQ29sbGVjdGlvbjxPYmplY3RFbnRpdHk+IHsgcmV0dXJuIHRoaXMub2JqZWN0RW50aXRpZXM7IH1cbiAgcHVibGljIHNldCBvYmplY3RzKG9iamVjdEVudGl0aWVzOiBDb2xsZWN0aW9uPE9iamVjdEVudGl0eT4pIHsgdGhpcy5vYmplY3RFbnRpdGllcyA9IG9iamVjdEVudGl0aWVzOyB9XG5cbiAgcHVibGljIGdldCB0aXRsZVNjcmVlbigpOiBzdHJpbmdbXSB7IHJldHVybiB0aGlzLmdldFN0YXRlKCd0aXRsZVNjcmVlbicpOyB9XG5cbiAgcHVibGljIGdldCBvcGVuaW5nU2NyZWVuKCk6IHN0cmluZ1tdIHsgcmV0dXJuIHRoaXMuZ2V0U3RhdGUoJ29wZW5pbmdTY3JlZW5zJylbdGhpcy5nZXRTdGF0ZSgnb3BlbmluZ1BhZ2UnKV07IH1cblxuICBwdWJsaWMgZ2V0IGxvY2F0aW9uU3RhdHVzU2NyZWVuKCk6IHN0cmluZ1tdIHtcbiAgICBjb25zdCBsb2NhdGlvbiA9IHRoaXMucGxheWVyLmxvY2F0aW9uO1xuICAgIGNvbnN0IGV4aXRzID0gbG9jYXRpb24gPyBsb2NhdGlvbi5leGl0cyA6IFtdO1xuICAgIGNvbnN0IGV4aXREaXJlY3Rpb25zID0gZXhpdHMubGVuZ3RoID4gMCA/IGV4aXRzLm1hcChleGl0ID0+IGV4aXQuZGlyZWN0aW9uKS5qb2luKCcsICcpIDogJ25vd2hlcmUnO1xuICAgIGNvbnN0IGNvbnRlbnRzID0gbG9jYXRpb24gPyBsb2NhdGlvbi5jb250ZW50cyA6IFtdO1xuICAgIGNvbnN0IGNvbnRlbnROYW1lcyA9IGNvbnRlbnRzLmxlbmd0aCA+IDAgPyBjb250ZW50cy5tYXAob2JqZWN0ID0+IGAgICAke29iamVjdC5uYW1lfWApIDogJyAgIG5vdGhpbmcgb2YgaW50ZXJlc3QnO1xuICAgIC8vIGNvbnN0IGNvbnRlbnRzID0gWycgICBub3RoaW5nIG9mIGludGVyZXN0J107XG4gICAgcmV0dXJuIChbXG4gICAgICBgWW91IGFyZSAke2xvY2F0aW9uID8gbG9jYXRpb24ubmFtZSA6ICdub3doZXJlJ30uYCxcbiAgICAgIGBZb3UgY2FuIGdvOiAke2V4aXREaXJlY3Rpb25zfWAsXG4gICAgICBgWW91IGNhbiBzZWU6YFxuICAgIF0pLmNvbmNhdChjb250ZW50TmFtZXMpO1xuICB9XG5cbiAgcHVibGljIGdldCBwbGF5ZXJTdGF0dXNTY3JlZW4oKTogc3RyaW5nW10ge1xuICAgIGNvbnN0IGludmVudG9yeSA9IHRoaXMucGxheWVyLmludmVudG9yeTtcbiAgICBjb25zdCBjYXJyeU5hbWVzID0gaW52ZW50b3J5Lmxlbmd0aCA+IDAgPyBpbnZlbnRvcnkubWFwKG9iamVjdCA9PiBgICAgJHtvYmplY3QubmFtZX1gKSA6IFsnICAgbm90aGluZyddO1xuICAgIGNvbnN0IHJlbWFpbmluZ0NhcnJ5ID0gdGhpcy5wbGF5ZXIuZ2V0U3RhdGUoJ21heENhcnJ5JykgLSBpbnZlbnRvcnkubGVuZ3RoO1xuICAgIHJldHVybiAoW1xuICAgICAgYFlvdSBhcmUgY2Fycnlpbmc6YFxuICAgIF0pLmNvbmNhdChjYXJyeU5hbWVzKS5jb25jYXQoW1xuICAgICAgYFlvdSBjYW4gY2FycnkgJHtyZW1haW5pbmdDYXJyeX0gbW9yZS5gXG4gICAgXSk7XG4gIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9nYW1lLWVudGl0eS50cyIsImltcG9ydCBFbnRpdHkgZnJvbSAnLi9lbnRpdHknO1xuaW1wb3J0IHsgRW50aXR5Q29uZmlnIH0gZnJvbSAnLi9lbnRpdHknO1xuaW1wb3J0IEdhbWVFbnRpdHkgZnJvbSAnLi9nYW1lLWVudGl0eSc7XG5pbXBvcnQgT2JqZWN0RW50aXR5IGZyb20gJy4vb2JqZWN0LWVudGl0eSc7XG5pbXBvcnQgTG9jYXRpb25FbnRpdHkgZnJvbSAnLi9sb2NhdGlvbi1lbnRpdHknO1xuaW1wb3J0IENvbW1hbmQgZnJvbSAnLi9jb21tYW5kJztcblxuZXhwb3J0IGludGVyZmFjZSBQbGF5ZXJFbnRpdHlDb25maWcgZXh0ZW5kcyBFbnRpdHlDb25maWcge1xuICBtYXhDYXJyeT86IG51bWJlcjtcbiAgbG9jYXRpb24/OiBudW1iZXI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQmVoYXZpb3JGdW5jIHtcbiAgKCk6IHN0cmluZ1tdXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQmVoYXZpb3JNYXBwaW5nIHtcbiAgdmVyYkV4cHJlc3Npb246IFJlZ0V4cDtcbiAgbW91bkV4cHJlc3Npb24/OiBSZWdFeHA7XG4gIGJlaGF2aW9yS2V5OiBzdHJpbmc7XG4gIGJlaGF2aW9yUHJvcGVydHlNYXBwZXI6IEJlaGF2aW9yUHJvcGVydHlNYXBwZXI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQmVoYXZpb3JQcm9wZXJ0eU1hcHBlciB7XG4gIChjb21tYW5kOiBDb21tYW5kLCBzZWxmOiBQbGF5ZXJFbnRpdHkpOiBhbnlbXTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBCZWhhdmlvcnNEaWN0IHtcbiAgW2tleTogc3RyaW5nXTogKC4uLnBhcmFtczogYW55W10pID0+IHN0cmluZ1tdO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQbGF5ZXJFbnRpdHkgZXh0ZW5kcyBFbnRpdHkge1xuICBwcml2YXRlIHJlYWRvbmx5IGdhbWVFbnRpdHk6IEdhbWVFbnRpdHk7XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBQbGF5ZXJFbnRpdHlDb25maWcsIGdhbWVFbnRpdHk6IEdhbWVFbnRpdHkpIHtcbiAgICBzdXBlcihjb25maWcpO1xuICAgIHRoaXMuZ2FtZUVudGl0eSA9IGdhbWVFbnRpdHk7XG5cbiAgICB0aGlzLnNldFN0YXRlKCdtYXhDYXJyeScsIGNvbmZpZy5tYXhDYXJyeSB8fCAwKTtcbiAgICB0aGlzLnNldFN0YXRlKCdsb2NhdGlvbicsIGNvbmZpZy5sb2NhdGlvbiB8fCAxKTtcbiAgfVxuXG4gIHB1YmxpYyBnZXQgaW52ZW50b3J5KCk6IE9iamVjdEVudGl0eVtdIHsgcmV0dXJuIFtdOyB9XG5cbiAgcHVibGljIGdldCBsb2NhdGlvbigpOiBMb2NhdGlvbkVudGl0eXxudWxsIHtcbiAgICByZXR1cm4gdGhpcy5nYW1lRW50aXR5LmxvY2F0aW9ucy5maW5kT25lKGxvY2F0aW9uID0+IGxvY2F0aW9uLmlkID09PSB0aGlzLmdldFN0YXRlKCdsb2NhdGlvbicpKTtcbiAgfVxuXG4gIHB1YmxpYyBnZXRCZWhhdmlvckZvckNvbW1hbmQoY29tbWFuZDogQ29tbWFuZCk6IEJlaGF2aW9yRnVuY3xudWxsIHtcbiAgICBjb25zdCBtYXBwaW5nID0gUGxheWVyRW50aXR5LmRlZmF1bHRCZWhhdmlvck1hcHBpbmdzLmZpbHRlcihtYXBwaW5nID0+IG1hcHBpbmcudmVyYkV4cHJlc3Npb24udGVzdChjb21tYW5kLnZlcmJQaHJhc2UpKVswXTtcbiAgICBpZiAoIW1hcHBpbmcpIHJldHVybiBudWxsO1xuICAgIGNvbnN0IGJlaGF2aW9yID0gUGxheWVyRW50aXR5LmRlZmF1bHRCZWhhdmlvcnNbbWFwcGluZy5iZWhhdmlvcktleV07XG4gICAgaWYgKCFiZWhhdmlvcikgcmV0dXJuIG51bGw7XG4gICAgcmV0dXJuICgpID0+IGJlaGF2aW9yLmFwcGx5KHRoaXMsIG1hcHBpbmcuYmVoYXZpb3JQcm9wZXJ0eU1hcHBlcihjb21tYW5kLCB0aGlzKSk7XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIGdldCBkZWZhdWx0QmVoYXZpb3JNYXBwaW5ncygpOiBCZWhhdmlvck1hcHBpbmdbXSB7XG4gICAgcmV0dXJuIFtcbiAgICAgIHsgdmVyYkV4cHJlc3Npb246IC9eZ28kL2ksIGJlaGF2aW9yS2V5OiAnbW92ZScsIGJlaGF2aW9yUHJvcGVydHlNYXBwZXI6IChjb21tYW5kLCBzZWxmKSA9PiBbY29tbWFuZC5ub3VuUGhyYXNlLCBzZWxmXSB9XG4gICAgXTtcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgZ2V0IGRlZmF1bHRCZWhhdmlvcnMoKTogQmVoYXZpb3JzRGljdCB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG1vdmU6IChkaXJlY3Rpb246IHN0cmluZywgc2VsZjogUGxheWVyRW50aXR5KTogc3RyaW5nW10gPT4ge1xuICAgICAgICBpZiAoIXNlbGYubG9jYXRpb24pIHJldHVybiBbYFlvdSBjYW4ndCBtb3ZlIWBdO1xuICAgICAgICBjb25zdCBleGl0ID0gc2VsZi5sb2NhdGlvbi5leGl0cy5maWx0ZXIoZXhpdCA9PiBleGl0LmRpcmVjdGlvbiA9PT0gZGlyZWN0aW9uKVswXTtcbiAgICAgICAgaWYgKCFleGl0KSByZXR1cm4gW2BZb3UgY2FuJ3QgZ28gdGhlcmUuYF07XG4gICAgICAgIHNlbGYuc2V0U3RhdGUoJ2xvY2F0aW9uJywgZXhpdC5kZXN0aW5hdGlvbik7XG4gICAgICAgIGNvbnN0IGxvY2F0aW9uID0gc2VsZi5sb2NhdGlvbiB8fCB7IG5hbWU6ICdub3doZXJlJyB9O1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgIGBZb3UgaGVhZCAke2RpcmVjdGlvbn0uYCxcbiAgICAgICAgICBgWW91IGFyZSAke2xvY2F0aW9uLm5hbWV9LmBcbiAgICAgICAgXTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvcGxheWVyLWVudGl0eS50cyIsImltcG9ydCBFbnRpdHkgZnJvbSAnLi9lbnRpdHknO1xuaW1wb3J0IHsgRW50aXR5Q29uZmlnIH0gZnJvbSAnLi9lbnRpdHknO1xuaW1wb3J0IEdhbWVFbnRpdHkgZnJvbSAnLi9nYW1lLWVudGl0eSc7XG5pbXBvcnQgT2JqZWN0RW50aXR5IGZyb20gJy4vb2JqZWN0LWVudGl0eSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgTG9jYXRpb25FeGl0IHtcbiAgZGlyZWN0aW9uOiBzdHJpbmc7XG4gIGRlc3RpbmF0aW9uOiBudW1iZXI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTG9jYXRpb25FbnRpdHlDb25maWcgZXh0ZW5kcyBFbnRpdHlDb25maWcge1xuICBpZDogbnVtYmVyO1xuICBuYW1lOiBzdHJpbmc7XG4gIGV4aXRzPzogTG9jYXRpb25FeGl0W107XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExvY2F0aW9uRW50aXR5IGV4dGVuZHMgRW50aXR5IHtcbiAgcHJpdmF0ZSByZWFkb25seSBnYW1lRW50aXR5OiBHYW1lRW50aXR5O1xuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogTG9jYXRpb25FbnRpdHlDb25maWcsIGdhbWVFbnRpdHk6IEdhbWVFbnRpdHkpIHtcbiAgICBzdXBlcihjb25maWcpO1xuICAgIHRoaXMuZ2FtZUVudGl0eSA9IGdhbWVFbnRpdHk7XG5cbiAgICB0aGlzLnNldFN0YXRlKCdpZCcsIGNvbmZpZy5pZCk7XG4gICAgdGhpcy5zZXRTdGF0ZSgnbmFtZScsIGNvbmZpZy5uYW1lKTtcbiAgICB0aGlzLnNldFN0YXRlKCdleGl0cycsIGNvbmZpZy5leGl0cyB8fCBbXSk7XG4gIH1cblxuICBwdWJsaWMgZ2V0IGlkKCk6IG51bWJlciB7IHJldHVybiB0aGlzLmdldFN0YXRlKCdpZCcpOyB9XG5cbiAgcHVibGljIGdldCBuYW1lKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLmdldFN0YXRlKCduYW1lJyk7IH1cblxuICBwdWJsaWMgZ2V0IGV4aXRzKCk6IExvY2F0aW9uRXhpdFtdIHsgcmV0dXJuIHRoaXMuZ2V0U3RhdGUoJ2V4aXRzJyk7IH1cblxuICBwdWJsaWMgZ2V0IGNvbnRlbnRzKCk6IE9iamVjdEVudGl0eVtdIHsgcmV0dXJuIHRoaXMuZ2FtZUVudGl0eS5vYmplY3RzLmZpbmRBbGwob2JqZWN0ID0+IG9iamVjdC5nZXRTdGF0ZSgnbG9jYXRpb24nKSA9PT0gdGhpcy5pZCk7IH1cbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvbG9jYXRpb24tZW50aXR5LnRzIiwiaW1wb3J0IEVudGl0eSBmcm9tICcuL2VudGl0eSc7XG5pbXBvcnQgeyBFbnRpdHlDb25maWcgfSBmcm9tICcuL2VudGl0eSc7XG5pbXBvcnQgR2FtZUVudGl0eSBmcm9tICcuL2dhbWUtZW50aXR5JztcbmltcG9ydCBMb2NhdGlvbkVudGl0eSBmcm9tICcuL2xvY2F0aW9uLWVudGl0eSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgT2JqZWN0RW50aXR5Q29uZmlnIGV4dGVuZHMgRW50aXR5Q29uZmlnIHtcbiAgaWQ6IG51bWJlcjtcbiAgbmFtZTogc3RyaW5nO1xuICB0YWdzOiBzdHJpbmdbXTtcbiAgbG9jYXRpb24/OiBudW1iZXI7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE9iamVjdEVudGl0eSBleHRlbmRzIEVudGl0eSB7XG4gIHByaXZhdGUgcmVhZG9ubHkgZ2FtZUVudGl0eTogR2FtZUVudGl0eTtcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IE9iamVjdEVudGl0eUNvbmZpZywgZ2FtZUVudGl0eTogR2FtZUVudGl0eSkge1xuICAgIHN1cGVyKGNvbmZpZyk7XG4gICAgdGhpcy5nYW1lRW50aXR5ID0gZ2FtZUVudGl0eTtcblxuICAgIHRoaXMuc2V0U3RhdGUoJ2lkJywgY29uZmlnLmlkKTtcbiAgICB0aGlzLnNldFN0YXRlKCduYW1lJywgY29uZmlnLm5hbWUpO1xuICAgIHRoaXMuc2V0U3RhdGUoJ3RhZ3MnLCBjb25maWcudGFncyk7XG4gICAgdGhpcy5zZXRTdGF0ZSgnbG9jYXRpb24nLCBjb25maWcubG9jYXRpb24gfHwgbnVsbCk7XG4gIH1cblxuICBwdWJsaWMgZ2V0IGlkKCk6IG51bWJlciB7IHJldHVybiB0aGlzLmdldFN0YXRlKCdpZCcpOyB9XG5cbiAgcHVibGljIGdldCBuYW1lKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLmdldFN0YXRlKCduYW1lJyk7IH1cblxuICBwdWJsaWMgZ2V0IGxvY2F0aW9uKCk6IExvY2F0aW9uRW50aXR5fG51bGwge1xuICAgIHJldHVybiBudWxsO1xuICB9XG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL29iamVjdC1lbnRpdHkudHMiLCJleHBvcnQgaW50ZXJmYWNlIEZpbHRlckZ1bmM8VD4ge1xuICAoaXRlbTogVCk6IGJvb2xlYW47XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbGxlY3Rpb248VD4ge1xuICBwcml2YXRlIHJlYWRvbmx5IGl0ZW1zOiBUW107XG5cbiAgY29uc3RydWN0b3IoaXRlbXM6IFRbXSkge1xuICAgIHRoaXMuaXRlbXMgPSBpdGVtcy5tYXAoaXRlbSA9PiBpdGVtKTtcbiAgfVxuXG4gIHB1YmxpYyBmaW5kT25lKGZpbmRGdW5jOiBGaWx0ZXJGdW5jPFQ+KTogVHxudWxsIHtcbiAgICByZXR1cm4gdGhpcy5pdGVtcy5maWx0ZXIoZmluZEZ1bmMpWzBdIHx8IG51bGw7XG4gIH1cblxuICBwdWJsaWMgZmluZEFsbChmaW5kRnVuYzogRmlsdGVyRnVuYzxUPik6IFRbXSB7XG4gICAgcmV0dXJuIHRoaXMuaXRlbXMuZmlsdGVyKGZpbmRGdW5jKTtcbiAgfVxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9jb2xsZWN0aW9uLnRzIiwiaW1wb3J0IEdhbWVFbnRpdHkgZnJvbSAnLi9nYW1lLWVudGl0eSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ29tbWFuZENvbmZpZyB7XG4gIHZlcmJQaHJhc2U6IHN0cmluZztcbiAgbm91blBocmFzZTogc3RyaW5nO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb21tYW5kIHtcbiAgcHVibGljIHJlYWRvbmx5IHZlcmJQaHJhc2U6IHN0cmluZztcbiAgcHVibGljIHJlYWRvbmx5IG5vdW5QaHJhc2U6IHN0cmluZztcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IENvbW1hbmRDb25maWcpIHtcbiAgICB0aGlzLnZlcmJQaHJhc2UgPSBjb25maWcudmVyYlBocmFzZTtcbiAgICB0aGlzLm5vdW5QaHJhc2UgPSBjb25maWcubm91blBocmFzZTtcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgcGFyc2UoaW5wdXQ6IHN0cmluZywgZ2FtZUVudGl0eTogR2FtZUVudGl0eSk6IENvbW1hbmQge1xuICAgIGNvbnN0IHdvcmRzID0gaW5wdXQuc3BsaXQoL1xccysvZyk7XG4gICAgbGV0IHZlcmJQaHJhc2UgPSBbd29yZHNbMF1dO1xuICAgIGxldCBub3VuUGhyYXNlID0gd29yZHMuc2xpY2UoMSk7XG4gICAgcmV0dXJuIG5ldyBDb21tYW5kKHtcbiAgICAgIHZlcmJQaHJhc2U6IHZlcmJQaHJhc2Uuam9pbignICcpLFxuICAgICAgbm91blBocmFzZTogbm91blBocmFzZS5qb2luKCcgJylcbiAgICB9KTtcbiAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2NvbW1hbmQudHMiXSwic291cmNlUm9vdCI6IiJ9