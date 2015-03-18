import RocketGroup from '../entities/RocketGroup.js';
import BlastGroup from '../entities/BlastGroup.js';
import Interface from '../entities/Interface.js';
import MineGroup from '../entities/MineGroup.js';
import Bot from '../entities/Bot.js';

export default {
  create: function() {
    game.setVec = function(one, two){
      one.x = two.x; one.y = two.y;
    }
    game.subVec = function(one, two){
      return {x:one.x - two.x, y: one.y - two.y}
    }
    game.addVec = function(one, two){
      return {x:one.x + two.x, y: one.y + two.y}
    }

    game.ui = new Interface();
    game.shotGroup = game.add.group();
    game.mines = new MineGroup();
    game.bot = new Bot(game.width/2, game.height/2);
    game.rockets = new RocketGroup();
    game.blasts = new BlastGroup();
  },

  update: function() {
    if (game.wave_in_progress) {
      game.rockets.launch();
    }
    if (game.wave_timer <= 0){
      game.wave_in_progress = false;
      this.something = false;
      if(game.rockets.countLiving() === 0 && this.something === false) {
        game.ui.nextWave();
      }
    }
    game.physics.arcade.overlap(game.rockets, game.shotGroup, this.test, null, this)
  },
  
  test: function(rocket, shot) {
    rocket.damage(shot.health);
    shot.hit(rocket)
  },

  
  render: function() {},
}
