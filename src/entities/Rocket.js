import SmokeEmitter from './SmokeEmitter'

class Rocket extends Phaser.Sprite { 

  constructor(game, x, y) {
    super(game, x, y, 'rocket');
    this.anchor.setTo(0.5, 0.5);
    this.scale.setTo(1.5,1.5);
    
    this.maxSpeed = 250;
    this.minSpeed = 2;
    this.turnRate = 5;
    this.wobble = 1;

    game.physics.enable(this, Phaser.Physics.ARCADE);

    game.add.tween(this).to({ wobble: -this.wobble },
      250, Phaser.Easing.Sinusoidal.InOut, true, 0,
      Number.POSITIVE_INFINITY, true
    );

    this.smoke_emitter = new SmokeEmitter(game);
  }

  updateEmitter() { 
    this.smoke_emitter.on = this.alive && !this.sleeping;
    this.smoke_emitter.x = this.x;
    this.smoke_emitter.y = this.y;
  }

  getFlockAngle(distance) { 
    var avoid_angle = 0;
    this.parent.forEachAlive(function(rocket) {
      if (this == rocket || avoid_angle !== 0) return;

      var distance = game.math.distance(this.x, this.y, rocket.x, rocket.y);
      if (distance < 30) {
        avoid_angle = Math.PI/2;
        if (game.math.chanceRoll(50)) avoid_angle *= -1;
      }
    }, this);

    if(distance < 100) avoid_angle /= 2
    return avoid_angle
  }

  getWobble() { 
    return game.math.degToRad(this.wobble)
  }

  turnTowardsAngle(angle) { 
    if (this.rotation === angle) return;
    // Gradually aim the Rocket towards the target angle
    var delta = angle - this.rotation;

    // Keep it in range from -180 to 180 to make the most efficient turns.
    if (delta > Math.PI) delta -= Math.PI * 2;
    if (delta < -Math.PI) delta += Math.PI * 2;

    this.angle += (delta > 0) ? this.turnRate : -this.turnRate;

    // Just set angle to target angle if they are close
    if (Math.abs(delta) < game.math.degToRad(this.turnRate)) this.rotation = angle;
  }


  update() {
    this.updateEmitter();
    if (!this.alive) return
    
    var target_angle = game.math.angleBetween(this.x, this.y, this.target.x, this.target.y);
    var target_dist = game.math.distance(this.x, this.y, this.target.x, this.target.y);
    
    if (target_dist < 125) {
      this.sleep_timer.pause()
      this.current_speed = this.maxSpeed * (target_dist/100) - 15;
    } else {
      this.sleep_timer.resume()
      target_angle += this.getWobble();
      this.current_speed = this.maxSpeed;
    }

    target_angle += this.getFlockAngle(target_dist);
    this.turnTowardsAngle(target_angle);
    
    if (this.sleeping) {
      this.turnRate *= 0.96
      this.body.velocity.multiply(0.96, 0.96)
      this.sleep_timer.resume()
    } else {
      this.turnRate = 5
      if (this.current_speed < this.minSpeed) this.current_speed = this.minSpeed;
      this.body.velocity.x = Math.cos(this.rotation) * this.current_speed;
      this.body.velocity.y = Math.sin(this.rotation) * this.current_speed;
    }

    if (target_dist < 30 && this.target.alive) this.hitTarget();
  }

  hitTarget() {
    game.bot.damage(15);
    this.hit_target=true;
    this.kill()
  }

  kill() {
    if(!this.hit_target) {
      game.bot.score+=100
      game.score_text.text = `score ${game.bot.score}`
    }
    this.hit_target = false;
    game.blasts.get(this.x, this.y);
    game.left_text.text = `enemies ${game.wave_timer+game.rockets.countLiving()}`
    super.kill()
  }

  reset(x, y) {
    this.target = game.bot;
    this.hit_target = false;

    this.sleeping = false;
    this.sleep_frequency = game.rnd.integerInRange(3000,8000)    
    this.sleep_duration = game.rnd.integerInRange(500,2000)    
    this.sleep_timer = game.time.create(false);
    this.sleep_timer.start();
    super.reset(x, y, 10)
  }

  sleep() {
    this.sleeping = true;
    this.sleep_timer.add(this.sleep_duration, () => {
      this.sleeping = false;
      this.sleep_timer.add(this.sleep_frequency, () => this.sleep())
    })
  }
}

export default Rocket;