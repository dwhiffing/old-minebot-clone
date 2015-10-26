import Mine from './Mine.js'
import Shot from './Shot.js'

class Bot extends Phaser.Sprite {

  constructor(x, y) {
    super(game, x, y, 'bot');

    this.anchor.setTo(0.5, 0.5);
    game.physics.enable(this, Phaser.Physics.ARCADE);

    this.num_frames = 21
    this.animations.add('life')
    this.animations.play('life', 0)

    this.history = []
    this.drag = {}
    this.drag.point= new Phaser.Point(0,0)
    this.drag.offset=new  Phaser.Point(0,0)
    this.drag.start= new Phaser.Point(0,0)

    this.is_mobile = game.device.touch
    this.pointer = this.is_mobile ? game.input.pointer1 : game.input.activePointer;
    this.target = this.is_mobile ? {x,y} : this.pointer;

    this.maxHealth = 100
    this.lives = 3;
    this.score = 0
    this.max_mines = 2
    this.mine_ready = true

    game.input.onDown.add(this.move, this);
    game.input.onUp.add(this.stopMoving, this);

    game.add.existing(this)
    this.reset(x, y, this.maxHealth, false)
  }

  update() {
    if (!this.alive) return

    if (game.shop_active) {

    }

    if(this.currentShot) {
      var shot_dist = (this.getCurrentSpeed() > 100) ? 24 : 0
      var angle = game.physics.arcade.velocityFromAngle(this.getCurrentAngle(), shot_dist)
      this.currentShot.position.set(this.x + angle.x, this.y + angle.y)
    }

    if(this.moving){
      this.drag.offset = Phaser.Point.subtract(this.drag.point, this.pointer)
      this.target = Phaser.Point.subtract(this.drag.start, this.drag.offset)
    }

    this.history.push({x: this.x, y: this.y})
    if(this.history.length > 10) this.history.shift()

    this.body.angularVelocity *= 0.97
    this.body.angularVelocity += this.getCurrentSpeed()/20
    if (this.body.angularVelocity> 1200) this.body.angularVelocity=1200

    this.position.set(this.target.x, this.target.y)
  }

  move(pointer) {
    if (this.is_mobile && (pointer.x < game.width/2.5 || this.charging) ){
      if (!this.moving) {
        this.moving = true;
        this.movementPointer = pointer.id
        this.drag.point.set(this.pointer.x, this.pointer.y)
        this.drag.start.set(this.position.x, this.position.y)
      }
    } else {
      this.chargeShot(pointer);
    }
  }

  stopMoving(pointer) {
    if (this.is_mobile && this.movementPointer == pointer.id) {
      this.moving = false;
    } else {
      this.charging = false;
      this.releaseShot()
    }
  }

  chargeShot(pointer) {
    if (!this.alive || !game.wave_in_progress) return
    let checkShot = ()=>{
      if(!pointer.isDown || (pointer.isDown && this.is_mobile && pointer.id === this.movementPointer)) {
        if (game.mines.countLiving() < this.max_mines && this.mine_ready) {
          game.mines.get(this.x, this.y)
          this.mine_ready = false
          let delay = (game.upgrades[1].level+1) * 300
          game.time.events.add(1200 - delay, ()=>{
            this.mine_ready = true
          })
        }
      } else {
        this.currentShot = game.shotGroup.get(this.x, this.y)
        this.currentShot.position.set(this.x, this.y)
      }
    }
    if (this.is_mobile && !this.charging) {
      this.charging = true
      game.time.events.add(200, checkShot)
    } else if (!this.is_mobile) {
      game.time.events.add(200, checkShot)
    }
  }

  releaseShot() {
    if(!this.currentShot) return;

    this.currentShot.release(this.getCurrentAngle(), this.getCurrentSpeed())
    this.currentShot = null;
  }

  damage(val) {
    if (!this.alive || this.invincible) return
    super.damage(val)
    this.animations.frame = this.num_frames-Math.ceil(this.health/(this.maxHealth/this.num_frames))
    game.health_text.text = `health ${this.health}`
  }

  kill() {
    this.lives--
    if (this.lives < 1) game.ui.resetWaves();
    game.blasts.get(this.x, this.y, 1);
    game.lives_text.text = `lives ${this.lives}`
    game.time.events.add(1000, () => {
      this.reset(game.width/2,game.height/2, this.maxHealth)
    })
    super.kill()
  }

  reset(x, y, health=this.maxHealth, invuln=true) {
    super.reset(x, y, health)
    if (!invuln) return
    this.alpha = 0.5;
    this.invincible = true;
    game.time.events.add(2500,()=>{
      this.alpha = 1;
      this.invincible = false;
      this.damage(0)
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
}

export default Bot;
