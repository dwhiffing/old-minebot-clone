export default {
  preload: function () {
    this.load.baseURL = 'assets/';
  },

  create: function () {
    this.input.maxPointers = 2;

    this.stage.disableVisibilityChange = true;

    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
    // game.scale.setScreenSize(true);
    game.scale.refresh();
    game.state.start('load', true, false);
  },
};
