import bootState from './states/boot'
import loadState from './states/load'
import playState from './states/play'

var ratio = window.innerHeight / window.innerWidth
window.game = new Phaser.Game(800, 450, Phaser.AUTO, 'game-container')

game.state.add('boot', bootState)
game.state.add('load', loadState)
game.state.add('play', playState)
game.state.start('boot')
