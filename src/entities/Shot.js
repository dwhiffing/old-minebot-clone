class Shot extends Phaser.Sprite { 

  constructor(x, y) {
    super(game, x, y, 'shot');
    this.charging = true
    this.damage = 5;
    this.minDamage = 20;
    this.maxDamage = 40;
    this.speed = {min: 300, max: 600}
    this.chargingRate = 0.4;
    game.shotGroup.add(this)
    this.anchor.setTo(0.5, 0.5);
    game.physics.enable(this, Phaser.Physics.ARCADE);
  }

  release(angle, speed) {
    if (this.damage < this.minDamage) this.kill();

    if (speed < 100) {
      var scale = 1+this.damage/30
      game.add.tween(this.scale)
        .to({x:scale,y:scale}, 500, Phaser.Easing.Linear.None, true)
        .onComplete.addOnce(this.kill, this);
    } else {
      game.math.clamp(speed, this.speed.min, this.speed.max)
      speed = game.physics.arcade.velocityFromAngle(angle, speed)
      this.body.velocity.setTo(speed.x, speed.y)
      this.charging = false;
    }
  }

  bounceX(){
    this.body.velocity.x = -this.body.velocity.x;
  }

  bounceY(){
    this.body.velocity.y = -this.body.velocity.y;
  }

  hit() {
    this.damage -= 1;
  }
  
  update() {
    if (this.charging && this.damage < this.maxDamage){
      this.damage += this.chargingRate;
    } else {
      this.damage -= 0.1;
      if (this.damage <= 8) this.kill();

      if (this.x<10 || this.x > game.width-20) {
        this.x = this.x<10 ? this.x+25 : this.x-25
        this.bounceX()
      }
      if (this.y<10 || this.y > game.height-20) {
        this.y = this.y<10 ? this.y+25 : this.y-25
        this.bounceY()
      }
    }
    this.alpha = this.damage < 20 ? this.damage/20 : 1;
    
    this.scale.setTo(this.damage/80)
  }
}

export default Shot;