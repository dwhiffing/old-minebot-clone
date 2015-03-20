import RocketGroup from '../entities/RocketGroup.js';
import BlastGroup from '../entities/BlastGroup.js';
import Interface from '../entities/Interface.js';
import MineGroup from '../entities/MineGroup.js';
import ShotGroup from '../entities/ShotGroup.js';
import Bot from '../entities/Bot.js';

export default {
  create: function() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.ui = new Interface();
    game.shotGroup = new ShotGroup();
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
    game.ui.update()
    game.physics.arcade.overlap(game.rockets, game.shotGroup, this.test, null, this)
  },
  
  test: function(rocket, shot) {
    rocket.damage(shot.health);
    shot.hit(rocket)
  },
  
  render: function() {
    // game.shotGroup.children.map((r) => game.debug.body(r))
  },
}
