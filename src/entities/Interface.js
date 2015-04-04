export default class Interface {
  constructor() {
    game.bg = game.add.sprite(0 ,0, 'bg');
    game.stars_back = game.add.sprite(0 ,0, 'stars1');
    game.stars_back2 = game.add.sprite(0 ,0, 'stars0');
    game.stars_fore = game.add.sprite(0 ,0, 'stars2');
    game.grid = game.add.sprite(0 ,0, 'grid');
    
    game.lives_text = game.add.text(10, game.height-35, 'lives 5', {font:'13pt Arial',fill:'#ee2c63'})
    game.lives_text.anchor.setTo(0,0.5)
    game.score_text = game.add.text(10, game.height-10, 'score 0', {font:'13pt Arial',fill:'#ee2c63'})
    game.score_text.anchor.setTo(0,0.5)
    game.wave_text = game.add.text(game.width-20, game.height-35, 'wave 1', {font:'13pt Arial',fill:'#ee2c63', align:'right'})
    game.wave_text.anchor.setTo(1,0.5)
    game.left_text = game.add.text(game.width-20, game.height-10, 'enemies 0', {font:'13pt Arial',fill:'#ee2c63', align:'right'})
    game.left_text.anchor.setTo(1,0.5)

    game.text_group = game.add.group()
    game.text_group.addMultiple([game.lives_text, game.score_text, game.wave_text, game.left_text])

    game.wave_num = 1;
    game.wave_timer = 2;
    game.wave_in_progress = true;

    game.world.setBounds()

    this.shop_group = game.add.group()
    this.shop_group.classType = Phaser.Button
    let buffer = 100;

    [0,1,2,3,4].map((num)=> {
      let x = buffer+120*num
      let y = 80
      this.shop_group.create(x, y, 'shop_icon', () => this.nextWave());
      let text = game.add.text(x, y+80, 'TEXT', {font:'13pt Arial',fill:'#ffffff', align: 'center'})
      this.shop_group.add(text);

    });

    [0,1,2,3,4].map((num)=> {
      let x = buffer+120*num
      let y = 250
      this.shop_group.create(x, y, 'shop_icon', () => this.nextWave());
      let text = game.add.text(x, y+80, 'TEXT', {font:'13pt Arial',fill:'#ffffff', align: 'center'})
      this.shop_group.add(text);
    })

    this.hideShop();
    this.shop_group.y = game.height+150

  }

  showShop() {
    var thing = game.height+150;
    game.add.tween(game.camera).to({y: thing}, 750, "Quad.easeInOut", true)
    game.add.tween(game.text_group).to({y: thing}, 750, "Quad.easeInOut", true)
    game.add.tween(game.grid).to({y: thing/2}, 750, "Quad.easeInOut", true)
    game.shop_active = true;
  }
  
  hideShop() {
    game.add.tween(game.camera).to({y: 0}, 750, "Quad.easeInOut", true)
    game.add.tween(game.text_group).to({y: 0}, 750, "Quad.easeInOut", true)
    game.add.tween(game.grid).to({y: 0}, 750, "Quad.easeInOut", true)
    game.shop_active = false;
  }

  nextWave() {
    this.hideShop();
    game.wave_timer = game.wave_num*2;
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

  update() {
    this.updateBG()
    if (game.wave_in_progress) {
      game.wave_timer--
      game.left_text.text = `enemies ${game.wave_timer+ game.rockets.countLiving()}`
      game.rockets.launch();
    }
    if (game.wave_timer <= 0){
      game.wave_in_progress = false;
      if(game.rockets.countLiving() === 0 && !game.shop_active) {
        this.showShop();
      }
    }
  }

  updateBG() {
    if (game.shop_active) return 
    game.stars_fore.x = game.bot.target.x / 250
    game.stars_fore.y = game.bot.target.y / 250

    game.stars_back.x = game.bot.target.x / 120
    game.stars_back.y = game.bot.target.y / 120

    game.stars_back2.x = game.bot.target.x / 80
    game.stars_back2.y = game.bot.target.y / 80
  }
}

