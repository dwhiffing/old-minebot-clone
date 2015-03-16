import Mine from './Mine.js';

class MineGroup extends Phaser.Group {

  constructor() {
    super(game)
  }

  create() {
    var mine = new Mine(0, 0);
    this.add(mine);
    return mine;
  }

  get(x, y) {
    var mine = this.getFirstDead() || this.create();
    mine.reset(x, y);
    return mine;
  }

}

export default MineGroup;