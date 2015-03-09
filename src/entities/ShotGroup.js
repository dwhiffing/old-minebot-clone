import Mine from './Mine.js';
import BlastGroup from './BlastGroup.js';

class RocketGroup extends Phaser.Group {

  constructor() {
    super(game)
    this.MAX_MINES = 5;
    this.blasts = new BlastGroup(this.game)
  }

  createMine() {
    var mine = new Mine(0, 0);
    this.add(mine);
    return mine;
  }

  getMine(x, y) {
    var mine = this.getFirstDead() || this.createMine();
    mine.reset(x, y);
    return mine;
  }

  launch(x, y) {
    if (this.countLiving() < this.MAX_MINES) {
      this.getMine(x, y);
    }
  }

}
export default RocketGroup;