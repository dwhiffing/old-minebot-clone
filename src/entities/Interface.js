const addText = (x, y, string, opts) => {
  if (x < 0) {
    x = game.width+x
  }
  if (y < 0) {
    y = game.height+y
  }
  opts = opts || {}
  opts = Object.assign({font: '13pt Arial', fill: '#ee2c63'}, opts)

  let text = game.add.text(x, y, string, opts)
  if (opts.anchorX && opts.anchorY) {
    text.anchor.setTo(opts.anchorX, opts.anchorY)
  }
  return text
}

export default class Interface {
  constructor() {
    this.createBG()
    this.createHUD()
    game.world.setBounds()
    this.createShop()
  }

  createBG() {
    game.bg = game.add.sprite(0 ,0, 'bg');
    game.stars_back = game.add.sprite(0 ,0, 'stars1');
    game.stars_back2 = game.add.sprite(0 ,0, 'stars0');
    game.stars_fore = game.add.sprite(0 ,0, 'stars2');
    game.grid = game.add.sprite(0 ,0, 'grid')
  }

  createHUD() {
    game.health_text = addText(20, -60, 'health 100', {
      anchorX: 0.01,
      anchorY: 0.5
    })
    game.lives_text = addText(20, -35, 'lives 3', {
      anchorX: 0.01,
      anchorY: 0.5
    })
    game.score_text = addText(20, -10, 'score 0', {
      anchorX: 0.01,
      anchorY: 0.5
    })
    game.wave_text = addText(-20, -35, 'wave 1', {
      anchorX: 1,
      anchorY: 0.5,
      align:'right'
    })
    game.left_text = addText(-20, -10, 'enemies 0', {
      anchorX: 1,
      anchorY: 0.5,
      align:'right'
    })

    game.fullscreenButton = game.add.button(10,10, 'full', () => {
      if (game.scale.isFullScreen) {
        game.scale.stopFullScreen();
      } else {
        game.scale.startFullScreen(false);
      }
    })

    game.text_group = game.add.group()
    game.text_group.addMultiple([
      game.fullscreenButton,
      game.health_text,
      game.lives_text,
      game.score_text,
      game.wave_text,
      game.left_text
    ])
  }

  createShop() {
    this.shop_group = game.add.group()
    this.shop_group.classType = Phaser.Button
    const labels = ['ARMOR', 'MINE SPEED', 'MINE COUNT', 'MINE POWER', 'CHARGE RATE','REPAIR', 'BLAST', 'SHIELD', 'DOUBLE SHOT', 'BOUNCE SHOT']

    game.upgrades = [
      {text: 'Get more armor', cost: 100, increase: 400, level: 0, max: 5},
      {text: 'Lay mines faster', cost: 100, increase: 100, level: 0, max: 5},
      {text: 'Lay more mines at once', cost: 300, increase: 200, level: 2, max: 6},
      {text: 'Mines have a larger blast', cost: 500, increase: 500, level: 0, max: 3},
      {text: 'Charge energy faster', cost: 500, increase: 500, level: 0, max: 3},
      {text: 'Repair all damage', cost: 100},
      {text: 'Release energy while stationary for a blast', cost: 1000},
      {text: 'Gain a charging defensive shield [NOT YET IMPLEMENTED]', cost: 2000},
      {text: 'Shoot two shots at once [NOT YET IMPLEMENTED]', cost: 3000},
      {text: 'Shots bounce off walls [NOT YET IMPLEMENTED]', cost: 3000},
    ]

    let description = addText(150, 240, "", {
      font: '16pt Arial',
      fill: '#ffffff',
      align: 'center'
    });
    description.setTextBounds(0,0, 500, 200)
    description.boundsAlignH = 'center'
    game.shop_selected = null
    this.shop_group.add(description)

    let bufferX = 50;
    // create top row of shop
    [0,1,2,3,4,5,6].map((num)=> {
      let x = bufferX+120*(num%6)
      let y = 80
      if (num==6) {
        x = bufferX
        y = 250
        var button = this.shop_group.create(x, y, 'shop_icon',() => {
          this.nextWave()
        })
        var label = 'NEXT WAVE'
      } else {
        var label = labels[num]
        var button = this.shop_group.create(x, y, 'shop_icon',() => {
          var thing = game.upgrades[num]
          thing.level = thing.level || 0
          thing.increase = thing.increase || 0
          thing.max = thing.max || 1
          let cost = thing.cost + (thing.level * thing.increase)
          if (game.shop_selected != null && game.shop_selected == num) {
            if ((game.bot.score >= cost && thing.level < thing.max) && !(num == 5 && game.bot.health == game.bot.maxHealth)) {
              game.bot.score -= cost
              thing.level++
              game.score_text.text = `score ${game.bot.score}`
              cost = thing.cost + (thing.level * thing.increase)
              this.updateForUpgrades()
            }
          }
          game.shop_selected = num
          description.text = `${thing.text} \nCost: ${cost}\nLevel: ${thing.level} (Max: ${thing.max}) score\n(Click again to purchase)`
        })
      }
      let text = addText(x, y+85, label, {
        font: '10pt Arial',
        fill: '#ffffff'
      });
      text.setTextBounds(-5,0, 85, 10)
      text.boundsAlignH = 'center'
      text.boundsAlignV = 'center'
      this.shop_group.add(text)
    });

    this.hideShop();
    this.shop_group.y = game.height+150
  }

  updateForUpgrades() {
    let last_health = game.bot.maxHealth
    game.bot.maxHealth = 100 * (game.upgrades[0].level+1)
    if (last_health !== game.bot.maxHealth) {
      game.bot.health = game.bot.maxHealth
    }
    // game.bot.max_mines = 2 + game.upgrades[1].level+1
    game.bot.max_mines = game.upgrades[2].level
    // game.bot.max_mines = 2 + game.upgrades[3].level+1
    if (game.upgrades[5].level == 1) {
      game.upgrades[5].level = 0
      game.bot.health = game.bot.maxHealth
    }
    game.health_text.text = `health ${game.bot.health}`
    game.bot.damage(0)
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
    game.time.events.remove(game.doSpawnEvent)
    if (game.spawn_rate > 250) game.spawn_rate -= 50
    game.doSpawnEvent = game.time.events.loop(game.spawn_rate, this.doSpawn.bind(this))
    game.enemies_per_wave += game.enemies_gained_per_wave;
    game.enemies_left_to_spawn = game.enemies_per_wave;
    game.killed_this_wave = 0
    game.time.events.add(2000,()=>{
      game.wave_num++
      game.wave_text.text = `wave ${game.wave_num}`
      game.wave_in_progress = true;
      game.rockets.updateForWave(game.wave_num)
    })
  }

  resetWaves(){
    if (game.doSpawnEvent){
      game.time.events.remove(game.doSpawnEvent)
    }
    game.spawn_rate = 1000
    game.doSpawnEvent = game.time.events.loop(game.spawn_rate, this.doSpawn.bind(this))
    game.rockets.callAll("kill")
    game.bot.lives = 3;
    game.bot.score = 0
    game.wave_num = 1;
    game.enemies_per_wave = 5;
    game.enemies_left_to_spawn = 5;
    game.enemies_gained_per_wave = 2;
    game.wave_in_progress = true;
    game.killed_this_wave = 0
    game.wave_text.text = 'wave 1'
    game.left_text.text = 'enemies 5'
    game.score_text.text = `score ${game.bot.score}`
  }

  doSpawn() {
    if (game.wave_in_progress) {
      if (game.enemies_left_to_spawn > 0) {
        game.enemies_left_to_spawn--
        game.left_text.text = `enemies ${game.enemies_per_wave- game.killed_this_wave}`
        game.rockets.launch();
      }
    }
    if (game.enemies_left_to_spawn <= 0 && game.rockets.countLiving() <= 0){
      game.mines.callAll('kill')
      game.wave_in_progress = false;
      if (game.rockets.countLiving() === 0 && !game.shop_active) {
        this.showShop();
      }
    }
  }

  update() {
    // this.updateBG()
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
