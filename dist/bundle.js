(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./src/game.js":[function(require,module,exports){
"use strict";

var ratio = window.innerHeight / window.innerWidth;
window.game = new Phaser.Game(800, 450, Phaser.AUTO, "game-container");

game.state.add("boot", require("./states/boot.js"));
game.state.add("load", require("./states/load.js"));
game.state.add("play", require("./states/play.js"));
game.state.start("boot");

},{"./states/boot.js":"/Users/danielwhiffing/Dropbox/js/phaser/minebot/src/states/boot.js","./states/load.js":"/Users/danielwhiffing/Dropbox/js/phaser/minebot/src/states/load.js","./states/play.js":"/Users/danielwhiffing/Dropbox/js/phaser/minebot/src/states/play.js"}],"/Users/danielwhiffing/Dropbox/js/phaser/minebot/src/entities/BlastGroup.js":[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var BlastGroup = (function (_Phaser$Group) {
  function BlastGroup() {
    _classCallCheck(this, BlastGroup);

    _get(Object.getPrototypeOf(BlastGroup.prototype), "constructor", this).call(this, game);
  }

  _inherits(BlastGroup, _Phaser$Group);

  _createClass(BlastGroup, {
    create: {
      value: function create() {
        var blast = game.add.sprite(0, 0, "explosion");
        blast.anchor.setTo(0.5, 0.5);
        this.add(blast);

        var animation = blast.animations.add("boom", [0, 1, 2, 3], 60, false);
        animation.killOnComplete = true;

        return blast;
      }
    },
    get: {
      value: function get(x, y) {
        var scale = arguments[2] === undefined ? 0.3 : arguments[2];

        var blast = this.getFirstDead() || this.create();
        blast.reset(x, y);
        blast.scale.setTo(scale, scale);

        blast.angle = game.rnd.integerInRange(0, 360);
        blast.animations.play("boom");

        return blast;
      }
    }
  });

  return BlastGroup;
})(Phaser.Group);

module.exports = BlastGroup;

},{}],"/Users/danielwhiffing/Dropbox/js/phaser/minebot/src/entities/Bot.js":[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Mine = _interopRequire(require("./Mine.js"));

var Shot = _interopRequire(require("./Shot.js"));

var Bot = (function (_Phaser$Sprite) {
  function Bot(x, y) {
    _classCallCheck(this, Bot);

    _get(Object.getPrototypeOf(Bot.prototype), "constructor", this).call(this, game, x, y, "bot");
    game.add.existing(this);
    this.dragPoint = {};
    this.dragOffset = {};
    this.dragStart = {};
    this.anchor.setTo(0.5, 0.5);
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.is_mobile = game.device.touch;
    this.pointer = this.is_mobile ? game.input.pointer1 : game.input.activePointer;
    this.target = this.is_mobile ? { x: x, y: y } : this.pointer;
    this.history = [];
    this.health = 100;
    this.lives = 5;
    this.score = 0;
    this.damage(0);

    if (this.is_mobile) {
      game.input.onDown.add(this.move, this);
      game.input.onUp.add(this.stopMoving, this);
    } else {
      game.input.onDown.add(this.chargeShot, this);
      game.input.onUp.add(this.releaseShot, this);
    }
  }

  _inherits(Bot, _Phaser$Sprite);

  _createClass(Bot, {
    chargeShot: {
      value: function chargeShot(pointer) {
        var _this = this;

        if (!this.alive) {
          return;
        }game.time.events.add(200, function () {
          if (!pointer.isDown) {
            game.mines.get(_this.x, _this.y);
          } else {
            _this.currentShot = new Shot(_this.x, _this.y);
            _this.currentShot.x = _this.x;
            _this.currentShot.y = _this.y;
          }
        });
      }
    },
    getLastPosition: {
      value: function getLastPosition() {
        return this.history[0] || null;
      }
    },
    getCurrentAngle: {
      value: function getCurrentAngle() {
        var last = this.getLastPosition();
        var angle = game.math.angleBetween(last.x, last.y, this.x, this.y);
        var angle_norm = Phaser.Math.normalizeAngle(angle);
        return Phaser.Math.radToDeg(angle_norm);
      }
    },
    getCurrentSpeed: {
      value: function getCurrentSpeed() {
        var last = this.getLastPosition();
        var dx = last.x - this.x;
        var dy = last.y - this.y;
        return Math.sqrt(dx * dx + dy * dy) * 4;
      }
    },
    releaseShot: {
      value: function releaseShot() {
        if (!this.currentShot) {
          return;
        }this.currentShot.release(this.getCurrentAngle(), this.getCurrentSpeed());
        this.currentShot = null;
      }
    },
    move: {
      value: function move(pointer) {
        if (pointer.x < game.width / 2.5) {
          if (!this.moving) {
            this.movementPointer = pointer.id;
            this.dragPoint.x = this.pointer.x;
            this.dragPoint.y = this.pointer.y;
            this.dragStart.x = this.x;
            this.dragStart.y = this.y;
            this.moving = true;
          }
        } else {
          this.chargeShot(pointer);
        }
      }
    },
    stopMoving: {
      value: function stopMoving(pointer) {
        if (this.movementPointer == pointer.id) {
          this.moving = false;
        } else {
          this.releaseShot();
        }
      }
    },
    damage: {
      value: function damage(dam) {
        var _this = this;

        if (!this.alive || this.invincible) {
          return;
        }this.health -= dam;
        var color_string = "rgba(" + Math.floor(200 - (20 - this.health / 2)) + "," + (200 - (200 - this.health * 2)) + "," + (200 - (200 - this.health * 2)) + ")";
        this.scale.setTo(1, 1);

        if (this.health <= 0) {
          var blast = game.blasts.get(this.x, this.y);
          if (this.lives < 1) {
            this.lives = 5;
            game.wave_num = 1;
            game.wave_text.text = "wave 1";
            game.left_text.text = "enemies 0";
            game.wave_timer = 3;
            game.wave_in_progress = true;
            game.bot.score = 0;
            game.score_text.text = "score 0";
            game.rockets.callAll("kill");
          }
          this.lives--;
          game.lives_text.text = "lives " + this.lives;
          blast.scale.setTo(1, 1);
          this.kill();
          game.time.events.add(300, function () {
            _this.reset(game.width / 2, game.height / 2, 100);
          });
        }
      }
    },
    reset: {
      value: function reset(x, y, health) {
        var _this = this;

        _get(Object.getPrototypeOf(Bot.prototype), "reset", this).call(this, x, y, health);
        this.damage(0);
        this.alpha = 0.5;
        this.invincible = true;
        game.time.events.add(2500, function () {
          _this.alpha = 1;
          _this.invincible = false;
          _this.damage(0);
        });
      }
    },
    update: {
      value: function update() {
        if (!this.alive) {
          return;
        }this.body.angularVelocity *= 0.97;
        if (this.currentShot) {
          var shot_dist = this.getCurrentSpeed() > 100 ? 24 : 0;
          var angle = game.physics.arcade.velocityFromAngle(this.getCurrentAngle(), shot_dist);
          this.currentShot.x = this.x + angle.x;
          this.currentShot.y = this.y + angle.y;
        }
        if (this.moving) {
          this.dragOffset.x = this.dragPoint.x - this.pointer.x;
          this.dragOffset.y = this.dragPoint.y - this.pointer.y;
          this.target.x = this.dragStart.x - this.dragOffset.x * 2;
          this.target.y = this.dragStart.y - this.dragOffset.y * 2;
        }
        this.history.push({ x: this.x, y: this.y });
        if (this.history.length > 10) {
          this.history.shift();
        }
        this.body.angularVelocity += this.getCurrentSpeed() / 20;
        if (this.body.angularVelocity > 1200) this.body.angularVelocity = 1200;
        this.x = this.target.x;
        this.y = this.target.y;
      }
    }
  });

  return Bot;
})(Phaser.Sprite);

module.exports = Bot;

},{"./Mine.js":"/Users/danielwhiffing/Dropbox/js/phaser/minebot/src/entities/Mine.js","./Shot.js":"/Users/danielwhiffing/Dropbox/js/phaser/minebot/src/entities/Shot.js"}],"/Users/danielwhiffing/Dropbox/js/phaser/minebot/src/entities/Mine.js":[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Mine = (function (_Phaser$Sprite) {
  function Mine(x, y) {
    _classCallCheck(this, Mine);

    _get(Object.getPrototypeOf(Mine.prototype), "constructor", this).call(this, game, x, y, "mine");
    this.anchor.setTo(0.5, 0.5);
    this.damage = 100;
    this.triggered = false;
    this.blast_delay = 350;
  }

  _inherits(Mine, _Phaser$Sprite);

  _createClass(Mine, {
    update: {
      value: function update() {
        var _this = this;

        if (!this.alive || this.triggered) {
          return;
        }if (this.getInRange().length > 0) {
          this.triggered = true;
          game.time.events.add(this.blast_delay, function () {
            return _this.kill();
          });
        }
      }
    },
    getInRange: {
      value: function getInRange() {
        var _this = this;

        return game.rockets.children.filter(function (r) {
          return _this.getDist(r) < 60;
        });
      }
    },
    getDist: {
      value: function getDist(thing) {
        return game.math.distance(this.x, this.y, thing.x, thing.y);
      }
    },
    kill: {
      value: function kill() {
        var _this = this;

        this.triggered = false;
        game.blasts.get(this.x, this.y, 0.7);
        this.getInRange().forEach(function (r) {
          return r.damage(_this.damage);
        });
        _get(Object.getPrototypeOf(Mine.prototype), "kill", this).call(this);
      }
    }
  });

  return Mine;
})(Phaser.Sprite);

module.exports = Mine;

},{}],"/Users/danielwhiffing/Dropbox/js/phaser/minebot/src/entities/MineGroup.js":[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Mine = _interopRequire(require("./Mine.js"));

var MineGroup = (function (_Phaser$Group) {
  function MineGroup() {
    _classCallCheck(this, MineGroup);

    _get(Object.getPrototypeOf(MineGroup.prototype), "constructor", this).call(this, game);
  }

  _inherits(MineGroup, _Phaser$Group);

  _createClass(MineGroup, {
    create: {
      value: function create() {
        var mine = new Mine(0, 0);
        this.add(mine);
        return mine;
      }
    },
    get: {
      value: function get(x, y) {
        var mine = this.getFirstDead() || this.create();
        mine.reset(x, y);
        return mine;
      }
    }
  });

  return MineGroup;
})(Phaser.Group);

module.exports = MineGroup;

},{"./Mine.js":"/Users/danielwhiffing/Dropbox/js/phaser/minebot/src/entities/Mine.js"}],"/Users/danielwhiffing/Dropbox/js/phaser/minebot/src/entities/Rocket.js":[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var SmokeEmitter = _interopRequire(require("./SmokeEmitter"));

var Rocket = (function (_Phaser$Sprite) {
  function Rocket(game, x, y) {
    _classCallCheck(this, Rocket);

    _get(Object.getPrototypeOf(Rocket.prototype), "constructor", this).call(this, game, x, y, "rocket");

    this.anchor.setTo(0.5, 0.5);
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.target = game.bot;
    this.math = game.math;
    this.didhit = false;
    this.maxSpeed = 250;
    this.turnRate = 5;
    this.scale.setTo(1.5, 1.5);
    this.sleepTimer = 100;
    this.sleeping = false;

    this.wobble = 1;
    this.currentSpeed = this.maxSpeed;

    this.sleepFreq = game.rnd.integerInRange(3000, 8000);
    this.sleepTime = game.rnd.integerInRange(500, 2000);
    this.timer = game.time.create(false);
    this.timer.start();
    this.sleep();

    game.add.tween(this).to({ wobble: -this.wobble }, 250, Phaser.Easing.Sinusoidal.InOut, true, 0, Number.POSITIVE_INFINITY, true);

    this.smokeEmitter = new SmokeEmitter(game);
  }

  _inherits(Rocket, _Phaser$Sprite);

  _createClass(Rocket, {
    updateEmitter: {
      value: function updateEmitter() {
        this.smokeEmitter.on = this.alive && !this.sleeping;
        this.smokeEmitter.x = this.x;
        this.smokeEmitter.y = this.y;
      }
    },
    getFlockAngle: {
      value: function getFlockAngle(distance) {
        var avoidAngle = 0;
        this.parent.forEachAlive(function (rocket) {
          if (this == rocket || avoidAngle !== 0) return;

          var distance = game.math.distance(this.x, this.y, rocket.x, rocket.y);
          if (distance < 30) {
            avoidAngle = Math.PI / 2;
            if (game.math.chanceRoll(50)) avoidAngle *= -1;
          }
        }, this);

        if (distance < 100) avoidAngle /= 2;
        return avoidAngle;
      }
    },
    getWobble: {
      value: function getWobble() {
        return game.math.degToRad(this.wobble);
      }
    },
    rotationThrottle: {
      value: function rotationThrottle(angle) {
        if (this.rotation === angle) {
          return;
        } // Gradually aim the Rocket towards the target angle
        var delta = angle - this.rotation;

        // Keep it in range from -180 to 180 to make the most efficient turns.
        if (delta > Math.PI) delta -= Math.PI * 2;
        if (delta < -Math.PI) delta += Math.PI * 2;

        if (delta > 0) {
          this.angle += this.turnRate;
        } else {
          this.angle -= this.turnRate;
        }
        // Just set angle to target angle if they are close
        if (Math.abs(delta) < game.math.degToRad(this.turnRate)) {
          this.rotation = angle;
        }
      }
    },
    kill: {
      value: function kill() {
        if (!this.didhit) {
          game.bot.score += 100;
          game.score_text.text = "score " + game.bot.score;
        }
        this.didhit = false;
        game.blasts.get(this.x, this.y);
        _get(Object.getPrototypeOf(Rocket.prototype), "kill", this).call(this);
        game.left_text.text = "enemies " + (game.wave_timer + game.rockets.countLiving());
      }
    },
    hit: {
      value: function hit() {
        game.bot.damage(15);
        this.didhit = true;
        this.kill();
      }
    },
    sleep: {
      value: function sleep() {
        var _this = this;

        this.sleeping = true;
        this.timer.add(this.sleepTime, function () {
          _this.sleeping = false;
          _this.timer.add(_this.sleepFreq, function () {
            return _this.sleep();
          });
        });
      }
    },
    update: {
      value: function update() {
        this.updateEmitter();
        if (!this.alive) {
          return;
        }var targetAngle = game.math.angleBetween(this.x, this.y, this.target.x, this.target.y);
        var distance = game.math.distance(this.x, this.y, this.target.x, this.target.y);

        if (distance < 125) {
          this.timer.pause();
          this.currentSpeed = this.maxSpeed * (distance / 100) - 15;
        } else {
          this.timer.resume();
          targetAngle += this.getWobble();
          this.currentSpeed = this.maxSpeed;
        }

        targetAngle += this.getFlockAngle(distance);
        this.rotationThrottle(targetAngle);

        if (this.sleeping) {
          this.turnRate *= 0.96;
          this.body.velocity.x *= 0.96;
          this.body.velocity.y *= 0.96;
          this.timer.resume();
        } else {
          this.turnRate = 5;
          if (this.currentSpeed < 2) this.currentSpeed = 2;
          this.body.velocity.x = Math.cos(this.rotation) * this.currentSpeed;
          this.body.velocity.y = Math.sin(this.rotation) * this.currentSpeed;
        }

        if (distance < 30 && game.bot.alive) this.hit();
      }
    }
  });

  return Rocket;
})(Phaser.Sprite);

module.exports = Rocket;

},{"./SmokeEmitter":"/Users/danielwhiffing/Dropbox/js/phaser/minebot/src/entities/SmokeEmitter.js"}],"/Users/danielwhiffing/Dropbox/js/phaser/minebot/src/entities/RocketGroup.js":[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Rocket = _interopRequire(require("./Rocket.js"));

var RocketGroup = (function (_Phaser$Group) {
  function RocketGroup() {
    _classCallCheck(this, RocketGroup);

    this.max = 10;
    _get(Object.getPrototypeOf(RocketGroup.prototype), "constructor", this).call(this, game);
  }

  _inherits(RocketGroup, _Phaser$Group);

  _createClass(RocketGroup, {
    create: {
      value: function create() {
        var rocket = new Rocket(game, 0, 0);
        this.add(rocket);
        return rocket;
      }
    },
    get: {
      value: function get(x, y) {
        var rocket = this.getFirstDead() || this.create();
        rocket.reset(x, y, 50);
        return rocket;
      }
    },
    updateForWave: {
      value: function updateForWave(wave) {
        this.max = Math.floor(10 + wave / 2);
      }
    },
    launch: {
      value: function launch() {
        if (this.countLiving() < this.max) {
          game.wave_timer--;
          game.left_text.text = "enemies " + (game.wave_timer + this.countLiving());

          var x = game.math.chanceRoll(50) ? -20 : game.width + 20;
          var y = game.math.chanceRoll(50) ? -20 : game.height + 20;

          this.get(x, y);
        }
      }
    }
  });

  return RocketGroup;
})(Phaser.Group);

module.exports = RocketGroup;

},{"./Rocket.js":"/Users/danielwhiffing/Dropbox/js/phaser/minebot/src/entities/Rocket.js"}],"/Users/danielwhiffing/Dropbox/js/phaser/minebot/src/entities/Shot.js":[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Shot = (function (_Phaser$Sprite) {
  function Shot(x, y) {
    _classCallCheck(this, Shot);

    _get(Object.getPrototypeOf(Shot.prototype), "constructor", this).call(this, game, x, y, "shot");
    this.charging = true;
    this.damage = 5;
    this.minDamage = 20;
    this.maxDamage = 40;
    this.speed = { min: 300, max: 600 };
    this.chargingRate = 0.4;
    game.shotGroup.add(this);
    this.anchor.setTo(0.5, 0.5);
    game.physics.enable(this, Phaser.Physics.ARCADE);
  }

  _inherits(Shot, _Phaser$Sprite);

  _createClass(Shot, {
    release: {
      value: function release(angle, speed) {
        if (this.damage < this.minDamage) this.kill();

        if (speed < 100) {
          var scale = 1 + this.damage / 30;
          game.add.tween(this.scale).to({ x: scale, y: scale }, 500, Phaser.Easing.Linear.None, true).onComplete.addOnce(this.kill, this);
        } else {
          game.math.clamp(speed, this.speed.min, this.speed.max);
          speed = game.physics.arcade.velocityFromAngle(angle, speed);
          this.body.velocity.setTo(speed.x, speed.y);
          this.charging = false;
        }
      }
    },
    bounceX: {
      value: function bounceX() {
        this.body.velocity.x = -this.body.velocity.x;
      }
    },
    bounceY: {
      value: function bounceY() {
        this.body.velocity.y = -this.body.velocity.y;
      }
    },
    hit: {
      value: function hit() {
        this.damage -= 1;
      }
    },
    update: {
      value: function update() {
        if (this.charging && this.damage < this.maxDamage) {
          this.damage += this.chargingRate;
        } else {
          this.damage -= 0.1;
          if (this.damage <= 8) this.kill();

          if (this.x < 10 || this.x > game.width - 20) {
            this.x = this.x < 10 ? this.x + 25 : this.x - 25;
            this.bounceX();
          }
          if (this.y < 10 || this.y > game.height - 20) {
            this.y = this.y < 10 ? this.y + 25 : this.y - 25;
            this.bounceY();
          }
        }
        this.alpha = this.damage < 20 ? this.damage / 20 : 1;

        this.scale.setTo(this.damage / 80);
      }
    }
  });

  return Shot;
})(Phaser.Sprite);

module.exports = Shot;

},{}],"/Users/danielwhiffing/Dropbox/js/phaser/minebot/src/entities/SmokeEmitter.js":[function(require,module,exports){
"use strict";

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var SmokeEmitter = (function (_Phaser$Particles$Arcade$Emitter) {
  function SmokeEmitter() {
    var x = arguments[0] === undefined ? 0 : arguments[0];
    var y = arguments[1] === undefined ? 0 : arguments[1];
    var amount = arguments[2] === undefined ? 15 : arguments[2];
    var lifetime = arguments[3] === undefined ? 1000 : arguments[3];

    _classCallCheck(this, SmokeEmitter);

    _get(Object.getPrototypeOf(SmokeEmitter.prototype), "constructor", this).call(this, game, x, y, amount);
    this.gravity = 0;
    this.setXSpeed(0, 0);
    this.setYSpeed(0, 0);
    this.setAlpha(0.8, 0, lifetime, Phaser.Easing.Linear.InOut);
    this.setScale(1, 0.7, 1, 0.7, lifetime, Phaser.Easing.Linear.InOut);
    this.makeParticles("smoke");
    this.start(false, lifetime, 40);
    return this;
  }

  _inherits(SmokeEmitter, _Phaser$Particles$Arcade$Emitter);

  return SmokeEmitter;
})(Phaser.Particles.Arcade.Emitter);

module.exports = SmokeEmitter;

},{}],"/Users/danielwhiffing/Dropbox/js/phaser/minebot/src/states/boot.js":[function(require,module,exports){
"use strict";

module.exports = {
  preload: function preload() {
    this.load.baseURL = "assets/";
  },

  create: function create() {
    this.input.maxPointers = 2;

    this.stage.disableVisibilityChange = true;

    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    game.scale.setScreenSize(true);

    game.state.start("load", true, false);
  } };

},{}],"/Users/danielwhiffing/Dropbox/js/phaser/minebot/src/states/load.js":[function(require,module,exports){
"use strict";

module.exports = {
  constructor: function constructor() {},

  preload: function preload() {
    game.load.image("mine", "images/mine.png");
    game.load.image("rocket", "images/rocket.png");
    game.load.image("smoke", "images/smoke.png");
    game.load.image("bot", "images/bot.png");
    game.load.image("shot", "images/shot.png");
    game.load.spritesheet("explosion", "images/explosion.png", 128, 128);

    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
  },

  onLoadComplete: function onLoadComplete() {
    game.state.start("play", true, false);
  }
};

},{}],"/Users/danielwhiffing/Dropbox/js/phaser/minebot/src/states/play.js":[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var RocketGroup = _interopRequire(require("../entities/RocketGroup.js"));

var BlastGroup = _interopRequire(require("../entities/BlastGroup.js"));

var MineGroup = _interopRequire(require("../entities/MineGroup.js"));

var Bot = _interopRequire(require("../entities/Bot.js"));

module.exports = {
  create: function create() {
    game.stage.backgroundColor = 0;

    game.lives_text = game.add.text(10, game.height - 35, "lives 5", { font: "13pt Arial", fill: "#ee2c63" });
    game.lives_text.anchor.setTo(0, 0.5);
    game.score_text = game.add.text(10, game.height - 10, "score 0", { font: "13pt Arial", fill: "#ee2c63" });
    game.score_text.anchor.setTo(0, 0.5);
    game.wave_text = game.add.text(game.width - 20, game.height - 35, "wave 1", { font: "13pt Arial", fill: "#ee2c63", align: "right" });
    game.wave_text.anchor.setTo(1, 0.5);
    game.left_text = game.add.text(game.width - 20, game.height - 10, "enemies 0", { font: "13pt Arial", fill: "#ee2c63", align: "right" });
    game.left_text.anchor.setTo(1, 0.5);

    game.shotGroup = game.add.group();
    game.mines = new MineGroup(game);
    game.bot = new Bot(game.width / 2, game.height / 2);
    game.rockets = new RocketGroup(game);
    game.blasts = new BlastGroup(game);

    game.wave_num = 1;
    game.wave_timer = 10;
    game.wave_in_progress = true;
    this.something = true;
  },

  update: function update() {
    if (game.wave_in_progress) {
      game.rockets.launch();
    }
    if (game.wave_timer <= 0) {
      game.wave_in_progress = false;
      this.something = false;
      if (game.rockets.countLiving() === 0 && this.something === false) {
        this.nextWave();
      }
    }
    game.physics.arcade.overlap(game.rockets, game.shotGroup, this.test, null, this);
  },

  test: function test(rocket, shot) {
    rocket.damage(shot.damage);
    shot.hit(rocket);
  },

  nextWave: function nextWave() {
    game.wave_timer = 10 + game.wave_num * 2;
    this.something = true;
    game.time.events.add(2000, function () {
      game.wave_num++;
      game.wave_text.text = "wave " + game.wave_num;
      game.wave_in_progress = true;
      game.rockets.updateForWave(game.wave_num);
    });
  },

  render: function render() {} };

},{"../entities/BlastGroup.js":"/Users/danielwhiffing/Dropbox/js/phaser/minebot/src/entities/BlastGroup.js","../entities/Bot.js":"/Users/danielwhiffing/Dropbox/js/phaser/minebot/src/entities/Bot.js","../entities/MineGroup.js":"/Users/danielwhiffing/Dropbox/js/phaser/minebot/src/entities/MineGroup.js","../entities/RocketGroup.js":"/Users/danielwhiffing/Dropbox/js/phaser/minebot/src/entities/RocketGroup.js"}]},{},["./src/game.js"]);
