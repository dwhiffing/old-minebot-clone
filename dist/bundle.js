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

    this.anchor.setTo(0.5, 0.5);
    game.physics.enable(this, Phaser.Physics.ARCADE);

    this.num_frames = 21;
    this.animations.add("life");
    this.animations.play("life", 0);

    this.history = [];
    this.drag = {
      point: Phaser.Point(),
      offset: Phaser.Point(),
      start: Phaser.Point()
    };

    this.is_mobile = game.device.touch;
    this.pointer = this.is_mobile ? game.input.pointer1 : game.input.activePointer;
    this.target = this.is_mobile ? { x: x, y: y } : this.pointer;

    this.max_health = 100;
    this.lives = 5;
    this.score = 0;

    game.input.onDown.add(this.move, this);
    game.input.onUp.add(this.stopMoving, this);

    game.add.existing(this);
    this.reset(x, y, this.max_health, false);
  }

  _inherits(Bot, _Phaser$Sprite);

  _createClass(Bot, {
    update: {
      value: function update() {
        if (!this.alive) {
          return;
        }if (this.currentShot) {
          var shot_dist = this.getCurrentSpeed() > 100 ? 24 : 0;
          var angle = game.physics.arcade.velocityFromAngle(this.getCurrentAngle(), shot_dist);
          this.currentShot.position.set(this.x + angle.x, this.y + angle.y);
        }

        if (this.moving) {
          Phaser.Point.subtract(this.drag.point, this.pointer, this.drag.offset);
          Phaser.Point.subtract(this.drag.start, this.drag.offset, this.target);
        }

        this.history.push({ x: this.x, y: this.y });
        if (this.history.length > 10) this.history.shift();

        this.body.angularVelocity *= 0.97;
        this.body.angularVelocity += this.getCurrentSpeed() / 20;
        if (this.body.angularVelocity > 1200) this.body.angularVelocity = 1200;

        this.position.set(this.target.x, this.target.y);
      }
    },
    move: {
      value: function move(pointer) {
        if (this.is_mobile && pointer.x < game.width / 2.5) {
          if (!this.moving) {
            this.moving = true;
            this.movementPointer = pointer.id;
            this.drag.point.set(this.pointer);
            this.drag.start.set(this.position);
          }
        } else {
          this.chargeShot(pointer);
        }
      }
    },
    stopMoving: {
      value: function stopMoving(pointer) {
        if (this.is_mobile && this.movementPointer == pointer.id) {
          this.moving = false;
        } else {
          this.releaseShot();
        }
      }
    },
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
            _this.currentShot.position.set(_this.x, _this.y);
          }
        });
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
    damage: {
      value: function damage(val) {
        if (!this.alive || this.invincible) {
          return;
        }_get(Object.getPrototypeOf(Bot.prototype), "damage", this).call(this, val);
        this.animations.frame = this.num_frames - Math.ceil(this.health / (this.max_health / this.num_frames));
      }
    },
    kill: {
      value: function kill() {
        var _this = this;

        if (this.lives < 1) game.ui.resetWaves();
        game.blasts.get(this.x, this.y, 1);
        game.lives_text.text = "lives " + --this.lives;
        game.time.events.add(1000, function () {
          _this.reset(game.width / 2, game.height / 2, _this.max_health);
        });
        _get(Object.getPrototypeOf(Bot.prototype), "kill", this).call(this);
      }
    },
    reset: {
      value: function reset(x, y) {
        var _this = this;

        var health = arguments[2] === undefined ? this.max_health : arguments[2];
        var invuln = arguments[3] === undefined ? true : arguments[3];

        _get(Object.getPrototypeOf(Bot.prototype), "reset", this).call(this, x, y, health);
        if (!invuln) {
          return;
        }this.alpha = 0.5;
        this.invincible = true;
        game.time.events.add(2500, function () {
          _this.alpha = 1;
          _this.invincible = false;
          _this.damage(0);
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
    }
  });

  return Bot;
})(Phaser.Sprite);

module.exports = Bot;

},{"./Mine.js":"/Users/danielwhiffing/Dropbox/js/phaser/minebot/src/entities/Mine.js","./Shot.js":"/Users/danielwhiffing/Dropbox/js/phaser/minebot/src/entities/Shot.js"}],"/Users/danielwhiffing/Dropbox/js/phaser/minebot/src/entities/Interface.js":[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Interface = (function () {
  function Interface() {
    _classCallCheck(this, Interface);

    game.bg = game.add.sprite(0, 0, "bg");

    game.lives_text = game.add.text(10, game.height - 35, "lives 5", { font: "13pt Arial", fill: "#ee2c63" });
    game.lives_text.anchor.setTo(0, 0.5);
    game.score_text = game.add.text(10, game.height - 10, "score 0", { font: "13pt Arial", fill: "#ee2c63" });
    game.score_text.anchor.setTo(0, 0.5);
    game.wave_text = game.add.text(game.width - 20, game.height - 35, "wave 1", { font: "13pt Arial", fill: "#ee2c63", align: "right" });
    game.wave_text.anchor.setTo(1, 0.5);
    game.left_text = game.add.text(game.width - 20, game.height - 10, "enemies 0", { font: "13pt Arial", fill: "#ee2c63", align: "right" });
    game.left_text.anchor.setTo(1, 0.5);

    game.wave_num = 1;
    game.wave_timer = 10;
    game.wave_in_progress = true;
    this.something = true;
  }

  _createClass(Interface, {
    nextWave: {
      value: function nextWave() {
        game.wave_timer = 10 + game.wave_num * 2;
        this.something = true;
        game.time.events.add(2000, function () {
          game.wave_num++;
          game.wave_text.text = "wave " + game.wave_num;
          game.wave_in_progress = true;
          game.rockets.updateForWave(game.wave_num);
        });
      }
    },
    resetWaves: {
      value: function resetWaves() {
        game.bot.lives = 5;
        game.wave_num = 1;
        game.wave_text.text = "wave 1";
        game.left_text.text = "enemies 0";
        game.wave_timer = 3;
        game.wave_in_progress = true;
        game.bot.score = 0;
        game.score_text.text = "score 0";
        game.rockets.callAll("kill");
      }
    }
  });

  return Interface;
})();

module.exports = Interface;

},{}],"/Users/danielwhiffing/Dropbox/js/phaser/minebot/src/entities/Mine.js":[function(require,module,exports){
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
    this.scale.setTo(1.5, 1.5);

    this.maxSpeed = 250;
    this.minSpeed = 2;
    this.turnRate = 5;
    this.wobble = 1;

    game.physics.enable(this, Phaser.Physics.ARCADE);

    game.add.tween(this).to({ wobble: -this.wobble }, 250, Phaser.Easing.Sinusoidal.InOut, true, 0, Number.POSITIVE_INFINITY, true);

    this.smoke_emitter = new SmokeEmitter(game);
  }

  _inherits(Rocket, _Phaser$Sprite);

  _createClass(Rocket, {
    updateEmitter: {
      value: function updateEmitter() {
        this.smoke_emitter.on = this.alive && !this.sleeping;
        this.smoke_emitter.x = this.x;
        this.smoke_emitter.y = this.y;
      }
    },
    getFlockAngle: {
      value: function getFlockAngle(distance) {
        var avoid_angle = 0;
        this.parent.forEachAlive(function (rocket) {
          if (this == rocket || avoid_angle !== 0) return;

          var distance = game.math.distance(this.x, this.y, rocket.x, rocket.y);
          if (distance < 30) {
            avoid_angle = Math.PI / 2;
            if (game.math.chanceRoll(50)) avoid_angle *= -1;
          }
        }, this);

        if (distance < 100) avoid_angle /= 2;
        return avoid_angle;
      }
    },
    getWobble: {
      value: function getWobble() {
        return game.math.degToRad(this.wobble);
      }
    },
    turnTowardsAngle: {
      value: function turnTowardsAngle(angle) {
        if (this.rotation === angle) {
          return;
        } // Gradually aim the Rocket towards the target angle
        var delta = angle - this.rotation;

        // Keep it in range from -180 to 180 to make the most efficient turns.
        if (delta > Math.PI) delta -= Math.PI * 2;
        if (delta < -Math.PI) delta += Math.PI * 2;

        this.angle += delta > 0 ? this.turnRate : -this.turnRate;

        // Just set angle to target angle if they are close
        if (Math.abs(delta) < game.math.degToRad(this.turnRate)) this.rotation = angle;
      }
    },
    update: {
      value: function update() {
        this.updateEmitter();
        if (!this.alive) {
          return;
        }var target_angle = game.math.angleBetween(this.x, this.y, this.target.x, this.target.y);
        var target_dist = game.math.distance(this.x, this.y, this.target.x, this.target.y);

        if (target_dist < 125) {
          this.sleep_timer.pause();
          this.current_speed = this.maxSpeed * (target_dist / 100) - 15;
        } else {
          this.sleep_timer.resume();
          target_angle += this.getWobble();
          this.current_speed = this.maxSpeed;
        }

        target_angle += this.getFlockAngle(target_dist);
        this.turnTowardsAngle(target_angle);

        if (this.sleeping) {
          this.turnRate *= 0.96;
          this.body.velocity.multiply(0.96, 0.96);
          this.sleep_timer.resume();
        } else {
          this.turnRate = 5;
          if (this.current_speed < this.minSpeed) this.current_speed = this.minSpeed;
          this.body.velocity.x = Math.cos(this.rotation) * this.current_speed;
          this.body.velocity.y = Math.sin(this.rotation) * this.current_speed;
        }

        if (target_dist < 30 && this.target.alive) this.hitTarget();
      }
    },
    hitTarget: {
      value: function hitTarget() {
        game.bot.damage(15);
        this.hit_target = true;
        this.kill();
      }
    },
    kill: {
      value: function kill() {
        if (!this.hit_target) {
          game.bot.score += 100;
          game.score_text.text = "score " + game.bot.score;
        }
        this.hit_target = false;
        game.blasts.get(this.x, this.y);
        game.left_text.text = "enemies " + (game.wave_timer + game.rockets.countLiving());
        _get(Object.getPrototypeOf(Rocket.prototype), "kill", this).call(this);
      }
    },
    reset: {
      value: function reset(x, y) {
        this.target = game.bot;
        this.hit_target = false;

        this.sleeping = false;
        this.sleep_frequency = game.rnd.integerInRange(3000, 8000);
        this.sleep_duration = game.rnd.integerInRange(500, 2000);
        this.sleep_timer = game.time.create(false);
        this.sleep_timer.start();
        _get(Object.getPrototypeOf(Rocket.prototype), "reset", this).call(this, x, y, 10);
      }
    },
    sleep: {
      value: function sleep() {
        var _this = this;

        this.sleeping = true;
        this.sleep_timer.add(this.sleep_duration, function () {
          _this.sleeping = false;
          _this.sleep_timer.add(_this.sleep_frequency, function () {
            return _this.sleep();
          });
        });
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
        rocket.reset(x, y);
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
    this.health = 5;
    this.scale.setTo(0);
    this.minHealth = 20;
    this.maxHealth = 40;
    this.speed = { min: 300, max: 600 };
    this.chargingRate = 0.4;
    game.shotGroup.add(this);
    this.anchor.setTo(0.5);
    game.physics.enable(this, Phaser.Physics.ARCADE);

    this.body.bounce.setTo(0.8, 0.8);
  }

  _inherits(Shot, _Phaser$Sprite);

  _createClass(Shot, {
    release: {
      value: function release(angle, speed) {
        if (speed < 100) {
          this.blast();
        } else {
          game.math.clamp(speed, this.speed.min, this.speed.max);
          this.shoot(game.physics.arcade.velocityFromAngle(angle, speed));
        }
        this.charging = false;
        this.damage(0);
      }
    },
    blast: {
      value: function blast() {
        var _this = this;

        this.is_shot = false;
        var s = 0.5 + this.health / 30;
        this.body.collideWorldBounds = false;
        game.add.tween(this.scale).to({ x: s, y: s }, 500, Phaser.Easing.Quadratic.Out, true).onComplete.addOnce(function () {
          _this.health = 0;
          game.add.tween(_this).to({ alpha: 0 }, 800, Phaser.Easing.Cubic.Out, true).onComplete.addOnce(_this.kill, _this);
        }, this);
      }
    },
    shoot: {
      value: function shoot(velocity) {
        this.is_shot = true;
        this.body.collideWorldBounds = true;
        this.body.velocity.setTo(velocity.x, velocity.y);
      }
    },
    hit: {
      value: function hit() {
        this.health -= 1;
      }
    },
    damage: {
      value: function damage(val) {
        if (val < 0 && this.health >= this.maxHealth) {
          return;
        }this.health -= val;
        if (this.is_shot || this.charging) this.scale.setTo(this.health / 80);
        if (this.charging) {
          return;
        }if (this.health <= 8) this.kill();
        this.alpha = this.health < this.minHealth ? this.health / this.minHealth : 1;
      }
    },
    update: {
      value: function update() {
        this.angle += this.health > 0 ? this.health / 5 : 1;

        if (this.charging) {
          this.damage(-1);
        } else if (this.is_shot) {
          this.damage(0.1);
        }
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
    game.load.image("bg", "images/grid.jpg");
    game.load.image("smoke", "images/smoke.png");
    game.load.atlasJSONHash("bot", "images/blue.png", "images/blue.json");
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

var Interface = _interopRequire(require("../entities/Interface.js"));

var MineGroup = _interopRequire(require("../entities/MineGroup.js"));

var Bot = _interopRequire(require("../entities/Bot.js"));

module.exports = {
  create: function create() {
    game.setVec = function (one, two) {
      one.x = two.x;one.y = two.y;
    };
    game.subVec = function (one, two) {
      return { x: one.x - two.x, y: one.y - two.y };
    };
    game.addVec = function (one, two) {
      return { x: one.x + two.x, y: one.y + two.y };
    };

    game.ui = new Interface();
    game.shotGroup = game.add.group();
    game.mines = new MineGroup();
    game.bot = new Bot(game.width / 2, game.height / 2);
    game.rockets = new RocketGroup();
    game.blasts = new BlastGroup();
  },

  update: function update() {
    if (game.wave_in_progress) {
      game.rockets.launch();
    }
    if (game.wave_timer <= 0) {
      game.wave_in_progress = false;
      this.something = false;
      if (game.rockets.countLiving() === 0 && this.something === false) {
        game.ui.nextWave();
      }
    }
    game.physics.arcade.overlap(game.rockets, game.shotGroup, this.test, null, this);
  },

  test: function test(rocket, shot) {
    rocket.damage(shot.health);
    shot.hit(rocket);
  },

  render: function render() {} };

},{"../entities/BlastGroup.js":"/Users/danielwhiffing/Dropbox/js/phaser/minebot/src/entities/BlastGroup.js","../entities/Bot.js":"/Users/danielwhiffing/Dropbox/js/phaser/minebot/src/entities/Bot.js","../entities/Interface.js":"/Users/danielwhiffing/Dropbox/js/phaser/minebot/src/entities/Interface.js","../entities/MineGroup.js":"/Users/danielwhiffing/Dropbox/js/phaser/minebot/src/entities/MineGroup.js","../entities/RocketGroup.js":"/Users/danielwhiffing/Dropbox/js/phaser/minebot/src/entities/RocketGroup.js"}]},{},["./src/game.js"]);
