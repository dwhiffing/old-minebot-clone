class BlastGroup extends Phaser.Group {

  constructor(game) {
   super(game)
  }

  createBlast() {
    var blast = this.game.add.sprite(0, 0, 'explosion');
    blast.anchor.setTo(0.5, 0.5);
    var animation = blast.animations.add('boom', [0,1,2,3], 60, false);
    animation.killOnComplete = true;
    this.add(blast);

    return blast;
  }

  getBlast(x, y, scale = 0.3) {
    var blast = this.getFirstDead() || this.createBlast();
    blast.reset(x, y);
    blast.scale.setTo(scale, scale)
    
    blast.angle = this.game.rnd.integerInRange(0, 360);
    blast.animations.play('boom');

    return blast;
  }
}

export default BlastGroup;