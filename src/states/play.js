import RocketGroup from '../entities/RocketGroup.js';
import BlastGroup from '../entities/BlastGroup.js';
import MineGroup from '../entities/MineGroup.js';
import Bot from '../entities/Bot.js';

export default {
  create: function() {
    game.stage.backgroundColor = 0x000000;
    
    game.lives_text = game.add.text(10, game.height-35, 'lives 5', {font:'13pt Arial',fill:'#ee2c63'})
    game.lives_text.anchor.setTo(0,0.5)
    game.score_text = game.add.text(10, game.height-10, 'score 0', {font:'13pt Arial',fill:'#ee2c63'})
    game.score_text.anchor.setTo(0,0.5)
    game.wave_text = game.add.text(game.width-20, game.height-35, 'wave 1', {font:'13pt Arial',fill:'#ee2c63', align:'right'})
    game.wave_text.anchor.setTo(1,0.5)
    game.left_text = game.add.text(game.width-20, game.height-10, 'enemies 0', {font:'13pt Arial',fill:'#ee2c63', align:'right'})
    game.left_text.anchor.setTo(1,0.5)
    
    game.shotGroup = game.add.group();
    game.mines = new MineGroup(game);
    game.bot = new Bot(game.width/2, game.height/2);
    game.rockets = new RocketGroup(game);
    game.blasts = new BlastGroup(game);

    game.wave_num = 1;
    game.wave_timer = 10;
    game.wave_in_progress = true;
    this.something = true;
  },

  update: function() {
    if (game.wave_in_progress) {
      game.rockets.launch();
    }
    if (game.wave_timer <= 0){
      game.wave_in_progress = false;
      this.something = false;
      if(game.rockets.countLiving() === 0 && this.something === false) {
        this.nextWave();
      }
    }
    game.physics.arcade.overlap(game.rockets, game.shotGroup, this.test, null, this)
  },
  
  test: function(rocket, shot) {
    rocket.damage(shot.damage);
    shot.hit(rocket)
  },

  nextWave: function() {
    game.wave_timer = 10+game.wave_num*2;
    this.something = true;
    game.time.events.add(2000,()=>{
      game.wave_num++
      game.wave_text.text = `wave ${game.wave_num}`
      game.wave_in_progress = true;
      game.rockets.updateForWave(game.wave_num)
    })
  },
  
  render: function() {},
}
