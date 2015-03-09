class SmokeEmitter extends Phaser.Particles.Arcade.Emitter { 
  constructor(x=0, y=0, amount=15, lifetime=1000) {
    super(game, x, y, amount);
    this.gravity = 0;
    this.setXSpeed(0, 0);
    this.setYSpeed(0, 0);
    this.setAlpha(0.8, 0, lifetime, Phaser.Easing.Linear.InOut);
    this.setScale(1, 0.7, 1, 0.7, lifetime, Phaser.Easing.Linear.InOut);
    this.makeParticles('smoke');
    this.start(false, lifetime, 40);
    return this
  }
}

export default SmokeEmitter