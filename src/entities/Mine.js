class Mine extends Phaser.Sprite { 

  constructor(x, y) {
    super(game, x, y, 'mine');
    this.anchor.setTo(0.5, 0.5);
    this.damage = 100;
  }

  update() {
    if (!this.alive) return
    var shouldKill = false
    game.rockets.forEachAlive(function(rocket) {
      var distance = this.game.math.distance(this.x, this.y, rocket.x, rocket.y);
      if (distance < 60) {
        shouldKill = true;
        rocket.damage(this.damage);
      }
    }, this);
    if(shouldKill){ 
      this.kill()
    }
  }

  kill() {
    this.parent.blasts.getBlast(this.x, this.y, 0.7);
    super.kill();
  }
}

export default Mine;