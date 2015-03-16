import Shot from './Shot.js';

class ShotGroup extends Phaser.Group {

  constructor() {
    super(game)
  }

  create() {
    var shot = new Shot(0, 0);
    this.add(shot);
    return shot;
  }

  get(x, y) {
    var shot = this.getFirstDead() || this.create();
    shot.reset(x, y);
    return shot;
  }
}

export default ShotGroup;