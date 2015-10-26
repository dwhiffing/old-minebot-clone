class Shot extends Phaser.Sprite {

  constructor(x, y) {
    super(game, x, y, 'shot');
    this.minHealth = 20;
    this.maxHealth = 40;
    this.speed = {min: 300, max: 600}
    this.chargingRate = 0.2;
    this.drainRate = 0.2;
    this.anchor.setTo(0.5);
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.bounce.setTo(0.8, 0.8)
    game.shotGroup.add(this)
  }

  release(angle, speed) {
    if (speed < 100) {
      this.blast()
    } else {
      game.math.clamp(speed, this.speed.min, this.speed.max)
      this.shoot(game.physics.arcade.velocityFromAngle(angle, speed))
      this.body.setSize(this.width*1.3, this.height*1.3, 0, 0);
    }
    this.charging = false;
    this.damage(0)
  }

  blast() {
    this.is_shot = false
    var s = 0.5+this.health/30
    this.body.collideWorldBounds = false
    game.add.tween(this.scale)
      .to({x:s,y:s}, 500, Phaser.Easing.Quadratic.Out, true)
      .onComplete.addOnce(() => {
        this.health = 0
        game.add.tween(this)
          .to({alpha: 0}, 800, Phaser.Easing.Cubic.Out, true)
          .onComplete.addOnce(this.kill, this);
      }, this);
  }

  shoot(velocity) {
    this.is_shot = true
    this.body.collideWorldBounds = true
    this.body.velocity.setTo(velocity.x, velocity.y)
  }

  hit() {
    // this.body.setSize(this.width*1.3, this.height*1.3, 0, 0);
    this.health -= 6
  }

  kill() {
    this.body.setSize(0, 0, 0, 0);
    super.kill();
  }

  reset(x, y, health) {
    super.reset(x, y, health);
    this.charging = true
    this.health = 5;
    this.alpha = 1
    this.scale.setTo(0)
    this.body.setSize(10, 10, 0, 0);
  }

  heal(val) {
    this.damage(-val);
  }

  damage(val) {
    if (val < 0 && this.health >= this.maxHealth) return

    this.health -= val;
    if (this.is_shot || this.charging) {
      this.scale.setTo(this.health/80)
    }
    if(this.charging) return
    if (this.health <= 8) this.kill();
    this.alpha = this.health < this.minHealth ? this.health/this.minHealth : 1;
  }

  update() {
    if(!this.alive) return
    this.angle += (this.health>0) ? this.health/5 : 1

    if (this.charging) {
      let rate = this.chargingRate * (game.upgrades[4].level +1)
      this.heal(rate)
    } else if(this.is_shot){
      this.damage(this.drainRate)
    } else {
      let change = .35
      this.body.setSize(this.width*change, this.height*change, 0, 0);
    }
  }
}

export default Shot;
