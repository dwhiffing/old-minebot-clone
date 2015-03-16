class Mine extends Phaser.Sprite { 

  constructor(x, y) {
    super(game, x, y, 'mine');
    this.anchor.setTo(0.5, 0.5);
    this.damage = 100;
    this.triggered = false;
    this.blast_delay = 350
  }

  update() {
    if (!this.alive || this.triggered) return
      
    if (this.getInRange().length > 0) {
      this.triggered = true
      game.time.events.add(this.blast_delay, () => this.kill())
    }
  }

  getInRange() {
    return game.rockets.children.filter((r) => this.getDist(r) < 60);
  }

  getDist(thing) {
    return game.math.distance(this.x, this.y, thing.x, thing.y);
  }

  kill() {
    this.triggered = false;
    game.blasts.get(this.x, this.y, 0.7);
    this.getInRange().forEach((r) => r.damage(this.damage))
    super.kill();
  }
}

export default Mine;