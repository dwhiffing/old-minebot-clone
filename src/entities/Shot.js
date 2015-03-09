class Shot extends Phaser.Sprite { 

  constructor(x, y) {
    super(game, x, y, 'shot');
    this.charging = true
    this.damage = 5;
    this.maxDamage = 40;
    this.minSpeed = 300;
    this.maxSpeed = 600;
    this.chargingRate = 0.4;
    game.shotGroup.add(this)
    this.anchor.setTo(0.5, 0.5);
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
  }

  release(angle, speed=this.minSpeed) {
    if (this.damage < 20) this.kill();

    if (speed < 100) {
      var scalething = 1 +this.damage/30
      var tween = game.add.tween(this.scale)
      tween.to({x:scalething,y:scalething}, 500, Phaser.Easing.Linear.None)
      tween.onComplete.addOnce(this.kill, this);
      tween.start();
      console.log(speed <100) 
    } else {
      speed = speed < this.minSpeed ? this.minSpeed : speed;
      speed = speed > this.maxSpeed ? this.maxSpeed : speed;
      speed = game.physics.arcade.velocityFromAngle(angle, speed)
      this.charging = false;
      this.body.velocity.x = speed.x;
      this.body.velocity.y = speed.y;
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
    if(this.charging && this.damage < this.maxDamage){
      this.damage += this.chargingRate;
    } else {
      this.damage -= 0.1;
      if (this.damage <= 8) {
        this.kill();
        return
      }
      if (this.x<10 || this.x > game.width-20) {
        this.x = this.x<10 ? this.x+25 : this.x-25
        this.bounceX()
      }
      if (this.y<10 || this.y > game.height-20) {
        this.y = this.y<10 ? this.y+25 : this.y-25
        this.bounceY()
      }
    }
    if (this.damage < 20) {
      this.alpha = this.damage/20;
    } else {
      this.alpha = 1;
    }
    this.width = this.damage;
    this.height = this.damage;
  }
}

export default Shot;