export default {
  constructor: function() {},

  preload: function() {
    game.load.image('mine', 'images/mine.png');
    game.load.image('shop_icon', 'images/icon.png');
    game.load.image('rocket', 'images/rocket.png');
    game.load.image('bg', 'images/bg.jpg');
    game.load.image('stars0', 'images/bg0.png');
    game.load.image('stars1', 'images/bg1.png');
    game.load.image('stars2', 'images/bg2.png');
    game.load.image('grid', 'images/grid.png');
    game.load.image('smoke', 'images/smoke.png');
    game.load.atlasJSONHash('bot', 'images/blue.png', 'images/blue.json');
    game.load.image('shot', 'images/shot.png');
    game.load.spritesheet('explosion', 'images/explosion.png', 128, 128);

    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
  },

  onLoadComplete: function() {
    game.state.start('play', true, false);
  }
}
