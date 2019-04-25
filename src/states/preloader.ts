export default class Preloader extends Phaser.State {
	preloadBar: Phaser.Sprite;
	ready: boolean = false;

	preload() {
		this.game.load.crossOrigin = 'anonymous'
		this.preloadBar = this.add.sprite(this.world.centerX - 500/2, this.world.centerY, 'preloadBar')
	}

	create() {
		this.game.state.start('Title', true, false)
	}
}
