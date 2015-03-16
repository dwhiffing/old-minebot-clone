class BlastGroup extends Phaser.Group {

  constructor() {
    super(game)
  }

  create() {
    var blast = game.add.sprite(0, 0, 'explosion');
    blast.anchor.setTo(0.5, 0.5);
    this.add(blast);
    
    var animation = blast.animations.add('boom', [0,1,2,3], 60, false);
    animation.killOnComplete = true;

    return blast;
  }

  get(x, y, scale = 0.3) {
    var blast = this.getFirstDead() || this.create();
    blast.reset(x, y);
    blast.scale.setTo(scale, scale)
    
    blast.angle = game.rnd.integerInRange(0, 360);
    blast.animations.play('boom');

    return blast;
  }
}

export default BlastGroup;