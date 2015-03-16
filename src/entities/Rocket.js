import SmokeEmitter from './SmokeEmitter'

class Rocket extends Phaser.Sprite { 

  constructor(game, x, y) {
    super(game, x, y, 'rocket');

    this.anchor.setTo(0.5, 0.5);
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.target = game.bot;
    this.math = game.math;
    this.didhit=false;
    this.maxSpeed = 250;
    this.turnRate = 5;
    this.scale.setTo(1.5,1.5)
    this.sleepTimer = 100;
    this.sleeping = false;

    this.wobble = 1;
    this.currentSpeed = this.maxSpeed;
    
    this.sleepFreq = game.rnd.integerInRange(3000,8000)    
    this.sleepTime = game.rnd.integerInRange(500,2000)    
    this.timer = game.time.create(false);
    this.timer.start();
    this.sleep()

    game.add.tween(this).to({ wobble: -this.wobble },
        250, Phaser.Easing.Sinusoidal.InOut, true, 0,
        Number.POSITIVE_INFINITY, true
      );

    this.smokeEmitter = new SmokeEmitter(game);
  }

  updateEmitter() { 
    this.smokeEmitter.on = this.alive && !this.sleeping;
    this.smokeEmitter.x = this.x;
    this.smokeEmitter.y = this.y;
  }

  getFlockAngle(distance) { 
    var avoidAngle = 0;
    this.parent.forEachAlive(function(rocket) {
      if (this == rocket || avoidAngle !== 0) return;

      var distance = game.math.distance(this.x, this.y, rocket.x, rocket.y);
      if (distance < 30) {
        avoidAngle = Math.PI/2;
        if (game.math.chanceRoll(50)) avoidAngle *= -1;
      }
    }, this);

    if(distance < 100) avoidAngle /= 2
    return avoidAngle
  }

  getWobble() { 
    return game.math.degToRad(this.wobble)
  }

  rotationThrottle(angle) { 
    if (this.rotation === angle) return;
    // Gradually aim the Rocket towards the target angle
    var delta = angle - this.rotation;

    // Keep it in range from -180 to 180 to make the most efficient turns.
    if (delta > Math.PI) delta -= Math.PI * 2;
    if (delta < -Math.PI) delta += Math.PI * 2;

    if (delta > 0) {
      this.angle += this.turnRate;
    } else {
      this.angle -= this.turnRate;
    }
    // Just set angle to target angle if they are close
    if (Math.abs(delta) < game.math.degToRad(this.turnRate)) {
      this.rotation = angle;
    }
  }

  kill() {
    if(!this.didhit) {
      game.bot.score+=100
      game.score_text.text = `score ${game.bot.score}`
    }
    this.didhit=false;
    game.blasts.get(this.x, this.y);
    super.kill()
    game.left_text.text = `enemies ${game.wave_timer+game.rockets.countLiving()}`
  }

  hit() {
    game.bot.damage(15);
    this.didhit=true;
    this.kill()
  }

  sleep() {
    this.sleeping = true;
    this.timer.add(this.sleepTime, () => {
      this.sleeping = false;
      this.timer.add(this.sleepFreq, () => this.sleep())
    })
  }

  update() {
    this.updateEmitter();
    if (!this.alive) return
    
    var targetAngle = game.math.angleBetween(this.x, this.y, this.target.x, this.target.y);
    var distance = game.math.distance(this.x, this.y, this.target.x, this.target.y);
    
    if (distance < 125) {
      this.timer.pause()
      this.currentSpeed = this.maxSpeed * (distance/100) - 15;
    } else {
      this.timer.resume()
      targetAngle += this.getWobble();
      this.currentSpeed = this.maxSpeed;
    }

    targetAngle += this.getFlockAngle(distance);
    this.rotationThrottle(targetAngle);
    
    
    if(this.sleeping) {
      this.turnRate *= 0.96
      this.body.velocity.x *= 0.96
      this.body.velocity.y *= 0.96
      this.timer.resume()
    } else {
      this.turnRate = 5
      if (this.currentSpeed < 2) this.currentSpeed = 2;
      this.body.velocity.x = Math.cos(this.rotation) * this.currentSpeed;
      this.body.velocity.y = Math.sin(this.rotation) * this.currentSpeed;
    }

    if (distance < 30&& game.bot.alive) this.hit();
  }
}

export default Rocket;