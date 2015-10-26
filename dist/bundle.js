(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var ratio = window.innerHeight / window.innerWidth;
window.game = new Phaser.Game(800, 450, Phaser.AUTO, "game-container");

game.state.add("boot", require("./states/boot.js"));
game.state.add("load", require("./states/load.js"));
game.state.add("play", require("./states/play.js"));
game.state.start("boot");

},{"./states/boot.js":12,"./states/load.js":13,"./states/play.js":14}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
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
    this.drag = {};
    this.drag.point = new Phaser.Point(0, 0);
    this.drag.offset = new Phaser.Point(0, 0);
    this.drag.start = new Phaser.Point(0, 0);

    this.is_mobile = game.device.touch;
    this.pointer = this.is_mobile ? game.input.pointer1 : game.input.activePointer;
    this.target = this.is_mobile ? { x: x, y: y } : this.pointer;

    this.maxHealth = 100;
    this.lives = 3;
    this.score = 0;
    this.max_mines = 2;
    this.mine_ready = true;

    game.input.onDown.add(this.move, this);
    game.input.onUp.add(this.stopMoving, this);

    game.add.existing(this);
    this.reset(x, y, this.maxHealth, false);
  }

  _inherits(Bot, _Phaser$Sprite);

  _createClass(Bot, {
    update: {
      value: function update() {
        if (!this.alive) {
          return;
        }if (game.shop_active) {}

        if (this.currentShot) {
          var shot_dist = this.getCurrentSpeed() > 100 ? 24 : 0;
          var angle = game.physics.arcade.velocityFromAngle(this.getCurrentAngle(), shot_dist);
          this.currentShot.position.set(this.x + angle.x, this.y + angle.y);
        }

        if (this.moving) {
          this.drag.offset = Phaser.Point.subtract(this.drag.point, this.pointer);
          this.target = Phaser.Point.subtract(this.drag.start, this.drag.offset);
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
        if (this.is_mobile && (pointer.x < game.width / 2.5 || this.charging)) {
          if (!this.moving) {
            this.moving = true;
            this.movementPointer = pointer.id;
            this.drag.point.set(this.pointer.x, this.pointer.y);
            this.drag.start.set(this.position.x, this.position.y);
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
          this.charging = false;
          this.releaseShot();
        }
      }
    },
    chargeShot: {
      value: function chargeShot(pointer) {
        var _this = this;

        if (!this.alive || !game.wave_in_progress) {
          return;
        }var checkShot = function () {
          if (!pointer.isDown || pointer.isDown && _this.is_mobile && pointer.id === _this.movementPointer) {
            if (game.mines.countLiving() < _this.max_mines && _this.mine_ready) {
              game.mines.get(_this.x, _this.y);
              _this.mine_ready = false;
              var delay = (game.upgrades[1].level + 1) * 300;
              game.time.events.add(1200 - delay, function () {
                _this.mine_ready = true;
              });
            }
          } else {
            _this.currentShot = game.shotGroup.get(_this.x, _this.y);
            _this.currentShot.position.set(_this.x, _this.y);
          }
        };
        if (this.is_mobile && !this.charging) {
          this.charging = true;
          game.time.events.add(200, checkShot);
        } else if (!this.is_mobile) {
          game.time.events.add(200, checkShot);
        }
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
        this.animations.frame = this.num_frames - Math.ceil(this.health / (this.maxHealth / this.num_frames));
        game.health_text.text = "health " + this.health;
      }
    },
    kill: {
      value: function kill() {
        var _this = this;

        this.lives--;
        if (this.lives < 1) game.ui.resetWaves();
        game.blasts.get(this.x, this.y, 1);
        game.lives_text.text = "lives " + this.lives;
        game.time.events.add(1000, function () {
          _this.reset(game.width / 2, game.height / 2, _this.maxHealth);
        });
        _get(Object.getPrototypeOf(Bot.prototype), "kill", this).call(this);
      }
    },
    reset: {
      value: function reset(x, y) {
        var _this = this;

        var health = arguments[2] === undefined ? this.maxHealth : arguments[2];
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

},{"./Mine.js":5,"./Shot.js":9}],4:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var addText = function (x, y, string, opts) {
  if (x < 0) {
    x = game.width + x;
  }
  if (y < 0) {
    y = game.height + y;
  }
  opts = opts || {};
  opts = Object.assign({ font: "13pt Arial", fill: "#ee2c63" }, opts);

  var text = game.add.text(x, y, string, opts);
  if (opts.anchorX && opts.anchorY) {
    text.anchor.setTo(opts.anchorX, opts.anchorY);
  }
  return text;
};

var Interface = (function () {
  function Interface() {
    _classCallCheck(this, Interface);

    this.createBG();
    this.createHUD();
    game.world.setBounds();
    this.createShop();
  }

  _createClass(Interface, {
    createBG: {
      value: function createBG() {
        game.bg = game.add.sprite(0, 0, "bg");
        game.stars_back = game.add.sprite(0, 0, "stars1");
        game.stars_back2 = game.add.sprite(0, 0, "stars0");
        game.stars_fore = game.add.sprite(0, 0, "stars2");
        game.grid = game.add.sprite(0, 0, "grid");
      }
    },
    createHUD: {
      value: function createHUD() {
        game.health_text = addText(20, -60, "health 100", {
          anchorX: 0.01,
          anchorY: 0.5
        });
        game.lives_text = addText(20, -35, "lives 3", {
          anchorX: 0.01,
          anchorY: 0.5
        });
        game.score_text = addText(20, -10, "score 0", {
          anchorX: 0.01,
          anchorY: 0.5
        });
        game.wave_text = addText(-20, -35, "wave 1", {
          anchorX: 1,
          anchorY: 0.5,
          align: "right"
        });
        game.left_text = addText(-20, -10, "enemies 0", {
          anchorX: 1,
          anchorY: 0.5,
          align: "right"
        });

        game.fullscreenButton = game.add.button(10, 10, "full", function () {
          if (game.scale.isFullScreen) {
            game.scale.stopFullScreen();
          } else {
            game.scale.startFullScreen(false);
          }
        });

        game.text_group = game.add.group();
        game.text_group.addMultiple([game.fullscreenButton, game.health_text, game.lives_text, game.score_text, game.wave_text, game.left_text]);
      }
    },
    createShop: {
      value: function createShop() {
        var _this = this;

        this.shop_group = game.add.group();
        this.shop_group.classType = Phaser.Button;
        var labels = ["ARMOR", "MINE SPEED", "MINE COUNT", "MINE POWER", "CHARGE RATE", "REPAIR", "BLAST", "SHIELD", "DOUBLE SHOT", "BOUNCE SHOT"];

        game.upgrades = [{ text: "Get more armor", cost: 100, increase: 400, level: 0, max: 5 }, { text: "Lay mines faster", cost: 100, increase: 100, level: 0, max: 5 }, { text: "Lay more mines at once", cost: 300, increase: 200, level: 2, max: 6 }, { text: "Mines have a larger blast", cost: 500, increase: 500, level: 0, max: 3 }, { text: "Charge energy faster", cost: 500, increase: 500, level: 0, max: 3 }, { text: "Repair all damage", cost: 100 }, { text: "Release energy while stationary for a blast", cost: 1000 }, { text: "Gain a charging defensive shield [NOT YET IMPLEMENTED]", cost: 2000 }, { text: "Shoot two shots at once [NOT YET IMPLEMENTED]", cost: 3000 }, { text: "Shots bounce off walls [NOT YET IMPLEMENTED]", cost: 3000 }];

        var description = addText(150, 240, "", {
          font: "16pt Arial",
          fill: "#ffffff",
          align: "center"
        });
        description.setTextBounds(0, 0, 500, 200);
        description.boundsAlignH = "center";
        game.shop_selected = null;
        this.shop_group.add(description);

        var bufferX = 50;
        // create top row of shop
        [0, 1, 2, 3, 4, 5, 6].map(function (num) {
          var x = bufferX + 120 * (num % 6);
          var y = 80;
          if (num == 6) {
            x = bufferX;
            y = 250;
            var button = _this.shop_group.create(x, y, "shop_icon", function () {
              _this.nextWave();
            });
            var label = "NEXT WAVE";
          } else {
            var label = labels[num];
            var button = _this.shop_group.create(x, y, "shop_icon", function () {
              var thing = game.upgrades[num];
              thing.level = thing.level || 0;
              thing.increase = thing.increase || 0;
              thing.max = thing.max || 1;
              var cost = thing.cost + thing.level * thing.increase;
              if (game.shop_selected != null && game.shop_selected == num) {
                if (game.bot.score >= cost && thing.level < thing.max && !(num == 5 && game.bot.health == game.bot.maxHealth)) {
                  game.bot.score -= cost;
                  thing.level++;
                  game.score_text.text = "score " + game.bot.score;
                  cost = thing.cost + thing.level * thing.increase;
                  _this.updateForUpgrades();
                }
              }
              game.shop_selected = num;
              description.text = "" + thing.text + " \nCost: " + cost + "\nLevel: " + thing.level + " (Max: " + thing.max + ") score\n(Click again to purchase)";
            });
          }
          var text = addText(x, y + 85, label, {
            font: "10pt Arial",
            fill: "#ffffff"
          });
          text.setTextBounds(-5, 0, 85, 10);
          text.boundsAlignH = "center";
          text.boundsAlignV = "center";
          _this.shop_group.add(text);
        });

        this.hideShop();
        this.shop_group.y = game.height + 150;
      }
    },
    updateForUpgrades: {
      value: function updateForUpgrades() {
        var last_health = game.bot.maxHealth;
        game.bot.maxHealth = 100 * (game.upgrades[0].level + 1);
        if (last_health !== game.bot.maxHealth) {
          game.bot.health = game.bot.maxHealth;
        }
        // game.bot.max_mines = 2 + game.upgrades[1].level+1
        game.bot.max_mines = game.upgrades[2].level;
        // game.bot.max_mines = 2 + game.upgrades[3].level+1
        if (game.upgrades[5].level == 1) {
          game.upgrades[5].level = 0;
          game.bot.health = game.bot.maxHealth;
        }
        game.health_text.text = "health " + game.bot.health;
        game.bot.damage(0);
      }
    },
    showShop: {
      value: function showShop() {
        var thing = game.height + 150;
        game.add.tween(game.camera).to({ y: thing }, 750, "Quad.easeInOut", true);
        game.add.tween(game.text_group).to({ y: thing }, 750, "Quad.easeInOut", true);
        game.add.tween(game.grid).to({ y: thing / 2 }, 750, "Quad.easeInOut", true);
        game.shop_active = true;
      }
    },
    hideShop: {
      value: function hideShop() {
        game.add.tween(game.camera).to({ y: 0 }, 750, "Quad.easeInOut", true);
        game.add.tween(game.text_group).to({ y: 0 }, 750, "Quad.easeInOut", true);
        game.add.tween(game.grid).to({ y: 0 }, 750, "Quad.easeInOut", true);
        game.shop_active = false;
      }
    },
    nextWave: {
      value: function nextWave() {
        this.hideShop();
        game.time.events.remove(game.doSpawnEvent);
        if (game.spawn_rate > 250) game.spawn_rate -= 50;
        game.doSpawnEvent = game.time.events.loop(game.spawn_rate, this.doSpawn.bind(this));
        game.enemies_per_wave += game.enemies_gained_per_wave;
        game.enemies_left_to_spawn = game.enemies_per_wave;
        game.killed_this_wave = 0;
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
        if (game.doSpawnEvent) {
          game.time.events.remove(game.doSpawnEvent);
        }
        game.spawn_rate = 1000;
        game.doSpawnEvent = game.time.events.loop(game.spawn_rate, this.doSpawn.bind(this));
        game.rockets.callAll("kill");
        game.bot.lives = 3;
        game.bot.score = 0;
        game.wave_num = 1;
        game.enemies_per_wave = 5;
        game.enemies_left_to_spawn = 5;
        game.enemies_gained_per_wave = 2;
        game.wave_in_progress = true;
        game.killed_this_wave = 0;
        game.wave_text.text = "wave 1";
        game.left_text.text = "enemies 5";
        game.score_text.text = "score " + game.bot.score;
      }
    },
    doSpawn: {
      value: function doSpawn() {
        if (game.wave_in_progress) {
          if (game.enemies_left_to_spawn > 0) {
            game.enemies_left_to_spawn--;
            game.left_text.text = "enemies " + (game.enemies_per_wave - game.killed_this_wave);
            game.rockets.launch();
          }
        }
        if (game.enemies_left_to_spawn <= 0 && game.rockets.countLiving() <= 0) {
          game.mines.callAll("kill");
          game.wave_in_progress = false;
          if (game.rockets.countLiving() === 0 && !game.shop_active) {
            this.showShop();
          }
        }
      }
    },
    update: {
      value: function update() {}
    },
    updateBG: {
      value: function updateBG() {
        if (game.shop_active) {
          return;
        }game.stars_fore.x = game.bot.target.x / 250;
        game.stars_fore.y = game.bot.target.y / 250;

        game.stars_back.x = game.bot.target.x / 120;
        game.stars_back.y = game.bot.target.y / 120;

        game.stars_back2.x = game.bot.target.x / 80;
        game.stars_back2.y = game.bot.target.y / 80;
      }
    }
  });

  return Interface;
})();

module.exports = Interface;

// this.updateBG()

},{}],5:[function(require,module,exports){
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
    this.triggssered = false;
    this.blast_delay = 350;
  }

  _inherits(Mine, _Phaser$Sprite);

  _createClass(Mine, {
    update: {
      value: function update() {
        var _this = this;

        if (!this.alive || this.triggered) {
          return;
        }if (this.getInRangeForTrigger().length > 0) {
          this.triggered = true;
          game.time.events.add(this.blast_delay, function () {
            return _this.kill();
          });
        }
      }
    },
    getInRangeForTrigger: {
      value: function getInRangeForTrigger() {
        var _this = this;

        return game.rockets.children.filter(function (r) {
          return _this.getDist(r) < 60;
        });
      }
    },
    getInRangeForDamage: {
      value: function getInRangeForDamage() {
        var _this = this;

        return game.rockets.children.filter(function (r) {
          return _this.getDist(r) < 60 + 30 * game.upgrades[3].level;
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

        if (this.alive) {
          this.triggered = false;
          game.blasts.get(this.x, this.y, 0.7 + 0.3 * game.upgrades[3].level);
          this.getInRangeForDamage().forEach(function (r) {
            return r.damage(_this.damage);
          });
          _get(Object.getPrototypeOf(Mine.prototype), "kill", this).call(this);
        }
      }
    }
  });

  return Mine;
})(Phaser.Sprite);

module.exports = Mine;

},{}],6:[function(require,module,exports){
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

},{"./Mine.js":5}],7:[function(require,module,exports){
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
    // this.blendMode = PIXI.blendModes.SCREEN;

    this.maxSpeed = 200;
    this.minSpeed = 2;
    this.turnRate = 5;
    this.wobble = 3;

    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.setSize(20, 20, 0, 0);

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
            if (Phaser.Utils.chanceRoll(50)) avoid_angle *= -1;
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
        game.bot.damage(25);
        this.hit_target = true;
        game.enemies_left_to_spawn++;
        this.kill();
      }
    },
    kill: {
      value: function kill() {
        if (!this.hit_target) {
          game.bot.score += 50;
          game.score_text.text = "score " + game.bot.score;
          game.killed_this_wave++;
        }
        this.hit_target = false;
        game.blasts.get(this.x, this.y);
        game.left_text.text = "enemies " + (game.enemies_per_wave - game.killed_this_wave);
        _get(Object.getPrototypeOf(Rocket.prototype), "kill", this).call(this);
      }
    },
    reset: {
      value: function reset(x, y) {
        var speed = arguments[2] === undefined ? 350 : arguments[2];
        var turnRate = arguments[3] === undefined ? 5 : arguments[3];

        this.target = game.bot;
        this.hit_target = false;
        this.maxSpeed = speed;
        this.turnRate = turnRate;
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

},{"./SmokeEmitter":11}],8:[function(require,module,exports){
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
        rocket.reset(x, y, 200 + 10 * game.wave_num);
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
          var x = Phaser.Utils.chanceRoll(50) ? -20 : game.width + 20;
          var y = Phaser.Utils.chanceRoll(50) ? -20 : game.height + 20;

          this.get(x, y);
        }
      }
    }
  });

  return RocketGroup;
})(Phaser.Group);

module.exports = RocketGroup;

},{"./Rocket.js":7}],9:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Shot = (function (_Phaser$Sprite) {
  function Shot(x, y) {
    _classCallCheck(this, Shot);

    _get(Object.getPrototypeOf(Shot.prototype), "constructor", this).call(this, game, x, y, "shot");
    this.minHealth = 20;
    this.maxHealth = 40;
    this.speed = { min: 300, max: 600 };
    this.chargingRate = 0.2;
    this.drainRate = 0.2;
    this.anchor.setTo(0.5);
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.bounce.setTo(0.8, 0.8);
    game.shotGroup.add(this);
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
          this.body.setSize(this.width * 1.3, this.height * 1.3, 0, 0);
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
        // this.body.setSize(this.width*1.3, this.height*1.3, 0, 0);
        this.health -= 6;
      }
    },
    kill: {
      value: function kill() {
        this.body.setSize(0, 0, 0, 0);
        _get(Object.getPrototypeOf(Shot.prototype), "kill", this).call(this);
      }
    },
    reset: {
      value: function reset(x, y, health) {
        _get(Object.getPrototypeOf(Shot.prototype), "reset", this).call(this, x, y, health);
        this.charging = true;
        this.health = 5;
        this.alpha = 1;
        this.scale.setTo(0);
        this.body.setSize(10, 10, 0, 0);
      }
    },
    heal: {
      value: function heal(val) {
        this.damage(-val);
      }
    },
    damage: {
      value: function damage(val) {
        if (val < 0 && this.health >= this.maxHealth) {
          return;
        }this.health -= val;
        if (this.is_shot || this.charging) {
          this.scale.setTo(this.health / 80);
        }
        if (this.charging) {
          return;
        }if (this.health <= 8) this.kill();
        this.alpha = this.health < this.minHealth ? this.health / this.minHealth : 1;
      }
    },
    update: {
      value: function update() {
        if (!this.alive) {
          return;
        }this.angle += this.health > 0 ? this.health / 5 : 1;

        if (this.charging) {
          var rate = this.chargingRate * (game.upgrades[4].level + 1);
          this.heal(rate);
        } else if (this.is_shot) {
          this.damage(this.drainRate);
        } else {
          var change = 0.35;
          this.body.setSize(this.width * change, this.height * change, 0, 0);
        }
      }
    }
  });

  return Shot;
})(Phaser.Sprite);

module.exports = Shot;

},{}],10:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Shot = _interopRequire(require("./Shot.js"));

var ShotGroup = (function (_Phaser$Group) {
  function ShotGroup() {
    _classCallCheck(this, ShotGroup);

    _get(Object.getPrototypeOf(ShotGroup.prototype), "constructor", this).call(this, game);
  }

  _inherits(ShotGroup, _Phaser$Group);

  _createClass(ShotGroup, {
    create: {
      value: function create() {
        var shot = new Shot(0, 0);
        this.add(shot);
        return shot;
      }
    },
    get: {
      value: function get(x, y) {
        var shot = this.getFirstDead() || this.create();
        shot.reset(x, y);
        return shot;
      }
    }
  });

  return ShotGroup;
})(Phaser.Group);

module.exports = ShotGroup;

},{"./Shot.js":9}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
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
    game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
    // game.scale.setScreenSize(true);
    game.scale.refresh();
    game.state.start("load", true, false);
  } };

},{}],13:[function(require,module,exports){
"use strict";

module.exports = {
  constructor: function constructor() {},

  preload: function preload() {
    game.load.image("mine", "images/mine.png");
    game.load.image("shop_icon", "images/icon.png");
    game.load.image("rocket", "images/rocket.png");
    game.load.image("bg", "images/bg.jpg");
    game.load.image("stars0", "images/bg0.png");
    game.load.image("stars1", "images/bg1.png");
    game.load.image("stars2", "images/bg2.png");
    game.load.image("grid", "images/grid.png");
    game.load.image("smoke", "images/smoke.png");
    game.load.image("full", "images/fullscreen.png");
    game.load.atlasJSONHash("bot", "images/blue.png", "images/blue.json");
    game.load.image("shot", "images/shot.png");
    game.load.spritesheet("explosion", "images/explosion.png", 128, 128);

    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
  },

  onLoadComplete: function onLoadComplete() {
    game.state.start("play", true, false);
  }
};

},{}],14:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var RocketGroup = _interopRequire(require("../entities/RocketGroup.js"));

var BlastGroup = _interopRequire(require("../entities/BlastGroup.js"));

var Interface = _interopRequire(require("../entities/Interface.js"));

var MineGroup = _interopRequire(require("../entities/MineGroup.js"));

var ShotGroup = _interopRequire(require("../entities/ShotGroup.js"));

var Bot = _interopRequire(require("../entities/Bot.js"));

module.exports = {
  create: function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.ui = new Interface();
    game.shotGroup = new ShotGroup();
    game.mines = new MineGroup();
    game.bot = new Bot(game.width / 2, game.height / 2);
    game.rockets = new RocketGroup();
    game.blasts = new BlastGroup();
    game.ui.resetWaves();
  },

  update: function update() {
    game.ui.update();
    game.physics.arcade.overlap(game.rockets, game.shotGroup, this.test, null, this);
  },

  test: function test(rocket, shot) {
    rocket.damage(shot.health);
    shot.hit(rocket);
  },

  render: function render() {} };

},{"../entities/BlastGroup.js":2,"../entities/Bot.js":3,"../entities/Interface.js":4,"../entities/MineGroup.js":6,"../entities/RocketGroup.js":8,"../entities/ShotGroup.js":10}]},{},[1]);
