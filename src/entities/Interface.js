export default class Interface {
  constructor() {
    game.bg = game.add.sprite(0 ,0, 'bg');
    
    game.lives_text = game.add.text(10, game.height-35, 'lives 5', {font:'13pt Arial',fill:'#ee2c63'})
    game.lives_text.anchor.setTo(0,0.5)
    game.score_text = game.add.text(10, game.height-10, 'score 0', {font:'13pt Arial',fill:'#ee2c63'})
    game.score_text.anchor.setTo(0,0.5)
    game.wave_text = game.add.text(game.width-20, game.height-35, 'wave 1', {font:'13pt Arial',fill:'#ee2c63', align:'right'})
    game.wave_text.anchor.setTo(1,0.5)
    game.left_text = game.add.text(game.width-20, game.height-10, 'enemies 0', {font:'13pt Arial',fill:'#ee2c63', align:'right'})
    game.left_text.anchor.setTo(1,0.5)   

    game.wave_num = 1;
    game.wave_timer = 10;
    game.wave_in_progress = true;
    this.something = true;

  }

  nextWave() {
    game.wave_timer = 10+game.wave_num*2;
    this.something = true;
    game.time.events.add(2000,()=>{
      game.wave_num++
      game.wave_text.text = `wave ${game.wave_num}`
      game.wave_in_progress = true;
      game.rockets.updateForWave(game.wave_num)
    })
  }

  resetWaves(){
    game.bot.lives = 5;
    game.wave_num = 1;
    game.wave_text.text = 'wave 1'
    game.left_text.text = 'enemies 0'
    game.wave_timer = 3;
    game.wave_in_progress = true;
    game.bot.score=0
    game.score_text.text = `score 0`
    game.rockets.callAll("kill")
  }
}

