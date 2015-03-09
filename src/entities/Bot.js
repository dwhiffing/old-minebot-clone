import Mine from './Mine.js'
import Shot from './Shot.js'

class Bot extends Phaser.Sprite { 

  constructor(x, y) {
    super(game, x, y, 'bot');
    game.add.existing(this)
    this.dragPoint = {};
    this.dragOffset = {};
    this.dragStart = {};
    this.anchor.setTo(0.5, 0.5);
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    this.is_mobile = game.device.touch
    this.pointer = this.is_mobile ? game.input.pointer1 : game.input.activePointer;
    this.target = this.is_mobile ? {x,y} : this.pointer;
    this.history = []
    this.health = 100
    this.lives = 5;
    this.score = 0;
    this.damage(0)

    if (this.is_mobile) {
      game.input.onDown.add(this.move, this);
      game.input.onUp.add(this.stopMoving, this);
    } else {
      game.input.onDown.add(this.chargeShot, this);
      game.input.onUp.add(this.releaseShot, this);
    }
  }
  
  chargeShot(pointer) {
    if (!this.alive) return 
    game.time.events.add(200, ()=>{
      if(!pointer.isDown) {
        game.mines.getMine(this.x, this.y)
      } else {
        this.currentShot = new Shot(this.x, this.y)
        this.currentShot.x = this.x
        this.currentShot.y = this.y
      }
    })
  }

  getLastPosition() {
    return this.history[0] || null
  }

  getCurrentAngle() {
    var last = this.getLastPosition();
    var angle = game.math.angleBetween(last.x,last.y,this.x,this.y)
    var angle_norm = Phaser.Math.normalizeAngle(angle)
    return Phaser.Math.radToDeg(angle_norm)
  }

  getCurrentSpeed() {
    var last = this.getLastPosition();
    var dx = last.x - this.x;
    var dy = last.y - this.y;
    return Math.sqrt(dx*dx+dy*dy)*4;
  }

  releaseShot() {
    if(!this.currentShot) return;
    this.currentShot.release(this.getCurrentAngle(), this.getCurrentSpeed())
    this.currentShot = null;
  }

  move(pointer) {
    if (pointer.x < game.width/2.5){
      if (!this.moving) {
        this.movementPointer = pointer.id
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

  stopMoving(pointer) {
    if (this.movementPointer == pointer.id) {
      this.moving = false;
    } else {
      this.releaseShot()
    }
  }
  
  damage(dam) {
    if(!this.alive || this.invincible)return
    this.health -= dam
    var color_string = `rgba(${Math.floor(200-(20-this.health/2))},${200-(200-this.health*2)},${200-(200-this.health*2)})`
    this.scale.setTo(1,1)
    this.tint = this.rgb2hex(color_string);

    if (this.health <= 0) {
      var blast = game.blasts.getBlast(this.x, this.y);
      if (this.lives < 1) {
        this.lives = 5
        game.wave_num = 1;
        game.wave_text.text = 'wave 1'
        game.left_text.text = 'enemies 0'
        game.wave_timer = 3;
        game.wave_in_progress = true;
        game.bot.score=0
        game.score_text.text = `score 0`
        game.rockets.callAll("kill")
      }
      this.lives--
      game.lives_text.text = `lives ${this.lives}`
      blast.scale.setTo(1,1)
      this.kill();
      game.time.events.add(300,()=>{
        this.reset(game.width/2,game.height/2, 100)
      })
    }
  }

  reset(x,y,health) {
    super.reset(x,y,health)
    this.damage(0)
    this.alpha = 0.5;
    this.invincible = true;
    game.time.events.add(2500,()=>{
      this.alpha = 1;
      this.invincible = false;
      this.damage(0)
    })
  }
  
  rgb2hex(rgb){
   rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
   return (rgb && rgb.length === 4) ? "0x" +
    ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
    ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
    ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
  }

  update() {
    if (!this.alive) return 
    this.body.angularVelocity *= 0.97
    if(this.currentShot) {
      var shot_dist = (this.getCurrentSpeed() > 100) ? 24 : 0
      var angle = game.physics.arcade.velocityFromAngle(this.getCurrentAngle(), shot_dist)
      this.currentShot.x = this.x + angle.x;
      this.currentShot.y = this.y + angle.y;
    }
    if(this.moving){
      this.dragOffset.x = this.dragPoint.x - this.pointer.x;
      this.dragOffset.y = this.dragPoint.y - this.pointer.y;
      this.target.x = this.dragStart.x - this.dragOffset.x*2;
      this.target.y = this.dragStart.y - this.dragOffset.y*2;
    }
    this.history.push({x: this.x, y: this.y})
    if(this.history.length > 10) {
      this.history.shift()
    }
    this.body.angularVelocity += this.getCurrentSpeed()/20
    if (this.body.angularVelocity> 1200) this.body.angularVelocity=1200
    this.x = this.target.x;
    this.y = this.target.y;

  }
}

export default Bot;