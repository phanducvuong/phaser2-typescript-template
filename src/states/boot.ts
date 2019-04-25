
export default class Boot extends Phaser.State {
    init() {
        this.input.maxPointers = 1
        this.stage.disableVisibilityChange = false
        // this.game.physics.startSystem(Phaser.Physics.ARCADE);

        if (this.game.device.desktop) {
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
            this.scale.forcePortrait = true
            this.scale.pageAlignVertically = true
        }
        else {
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
            // this.scale.setMinMax(480, 260, 2048, 1080)
            this.scale.forcePortrait = true
            this.scale.pageAlignVertically = true
            this.scale.pageAlignHorizontally = true
        }
    }

    preload() {
        this.load.image('preloadBar', 'assets/loadbar.png')
    }

    create() {
        this.game.state.start('Preloader')
    }
}
