class Mine extends Phaser.Sprite {

  constructor(x, y) {
    super(game, x, y, 'mine');
    this.anchor.setTo(0.5, 0.5);
    this.damage = 100;
    this.triggssered = false;
    this.blast_delay = 350
  }

  update() {
    if (!this.alive || this.triggered) return

    if (this.getInRangeForTrigger().length > 0) {
      this.triggered = true
      game.time.events.add(this.blast_delay, () => this.kill())
    }
  }

  getInRangeForTrigger() {
    return game.rockets.children.filter((r) => this.getDist(r) < 60)
  }

  getInRangeForDamage() {
    return game.rockets.children.filter((r) => this.getDist(r) < 60 + (30* game.upgrades[3].level));
  }

  getDist(thing) {
    return game.math.distance(this.x, this.y, thing.x, thing.y);
  }

  kill() {
    if (this.alive) {
      this.triggered = false;
      game.blasts.get(this.x, this.y, 0.7 + (0.3 * game.upgrades[3].level));
      this.getInRangeForDamage().forEach((r) => r.damage(this.damage))
      super.kill();
    }
  }
}

export default Mine;
