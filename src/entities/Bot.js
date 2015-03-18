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
    this.drag = {
      point: Phaser.Point(), 
      offset: Phaser.Point(), 
      start: Phaser.Point()
    }

    this.is_mobile = game.device.touch
    this.pointer = this.is_mobile ? game.input.pointer1 : game.input.activePointer;
    this.target = this.is_mobile ? {x,y} : this.pointer;

    this.max_health = 100
    this.lives = 5;
    this.score = 0

    game.input.onDown.add(this.move, this);
    game.input.onUp.add(this.stopMoving, this);
    
    game.add.existing(this)
    this.reset(x, y, this.max_health, false)
  }

  update() {
    if (!this.alive) return 
    
    if(this.currentShot) {
      var shot_dist = (this.getCurrentSpeed() > 100) ? 24 : 0
      var angle = game.physics.arcade.velocityFromAngle(this.getCurrentAngle(), shot_dist)
      this.currentShot.position.set(this.x + angle.x, this.y + angle.y)
    }
    
    if(this.moving){
      Phaser.Point.subtract(this.drag.point, this.pointer, this.drag.offset)
      Phaser.Point.subtract(this.drag.start, this.drag.offset, this.target)
    }
    
    this.history.push({x: this.x, y: this.y})
    if(this.history.length > 10) this.history.shift()
    
    this.body.angularVelocity *= 0.97
    this.body.angularVelocity += this.getCurrentSpeed()/20
    if (this.body.angularVelocity> 1200) this.body.angularVelocity=1200

    this.position.set(this.target.x, this.target.y)
  }

  move(pointer) {
    if (this.is_mobile && pointer.x < game.width/2.5){
      if (!this.moving) {
        this.moving = true;
        this.movementPointer = pointer.id
        this.drag.point.set(this.pointer)
        this.drag.start.set(this.position)
      }
    } else {
      this.chargeShot(pointer);
    }
  }

  stopMoving(pointer) {
    if (this.is_mobile && this.movementPointer == pointer.id) {
      this.moving = false;
    } else {
      this.releaseShot()
    }
  }

  chargeShot(pointer) {
    if (!this.alive) return

    game.time.events.add(200, ()=>{
      if(!pointer.isDown) {
        game.mines.get(this.x, this.y)
      } else {
        this.currentShot = new Shot(this.x, this.y)
        this.currentShot.position.set(this.x, this.y)
      }
    })
  }

  releaseShot() {
    if(!this.currentShot) return;
    
    this.currentShot.release(this.getCurrentAngle(), this.getCurrentSpeed())
    this.currentShot = null;
  }
  
  damage(val) {
    if (!this.alive || this.invincible) return
    super.damage(val)
    this.animations.frame = this.num_frames-Math.ceil(this.health/(this.max_health/this.num_frames))
  }

  kill() {
    if (this.lives < 1) game.ui.resetWaves();
    game.blasts.get(this.x, this.y, 1);
    game.lives_text.text = `lives ${--this.lives}`
    game.time.events.add(1000, () => {
      this.reset(game.width/2,game.height/2, this.max_health)
    })
    super.kill()
  }

  reset(x, y, health=this.max_health, invuln=true) {
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