import Rocket from './Rocket.js';

class RocketGroup extends Phaser.Group {

  constructor() {
    this.max_missiles = 3;
    super(game)
  }

  createRocket() {
    var rocket = new Rocket(this.game, 0, 0);
    this.add(rocket);
    return rocket;
  }

  getRocket(x, y) {
    var rocket = this.getFirstDead() || this.createRocket();
    rocket.reset(x, y, 50);

    return rocket;
  }

  updateForWave(wave) {
    this.max_missiles = Math.floor(3 + wave/4)
  }

  launch() {
    if (this.countLiving() < this.max_missiles) {
      game.wave_timer--
      game.left_text.text = `enemies ${game.wave_timer+ this.countLiving()}`
      // Set the launch point to a random location below the bottom edge of the stage
      if (this.game.math.chanceRoll(50)) {
        var x = this.game.rnd.integerInRange(-20, 0)
      } else {
        var x = this.game.rnd.integerInRange(this.game.width, this.game.width+20)
      }

      if (this.game.math.chanceRoll(50)) {
        var y = this.game.rnd.integerInRange(-20, 0)
      } else {
        var y = this.game.rnd.integerInRange(this.game.height, this.game.height+20)
      }
      this.getRocket(x, y);
    }
  }

}
export default RocketGroup;