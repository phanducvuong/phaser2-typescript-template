import 'p2'
import 'pixi'
import 'phaser'


import Boot from './states/boot'
import Preloader from './states/preloader'
import Title from './states/title'
import {Storable, MyFBStorage, LocalStorage} from './models/model'

export let game:Game
export let isCloud:boolean = true

export function launch(cloud:boolean) {
	if (cloud) {
		FBInstant.initializeAsync().then( () => {
			FBInstant.setLoadingProgress(100)
			FBInstant.startGameAsync().then (() => {
				game = new Game(new MyFBStorage())
			}).catch(e => console.error(e))
		}).catch( e => console.log(e))			
	}
	else
		game = new Game(new LocalStorage())
}

export class Game extends Phaser.Game {
	public data:Storable
	private adsVideo:FBInstant.AdInstance
	private static readonly ADS_ID:string = '392451404877797_393676934755244'

	constructor(data:Storable) {
		super(1080, 1080*window.innerHeight/window.innerWidth, Phaser.AUTO, 'content', null)
		this.data = data
		this.data.load().then((obj) => {
			console.log(this.data)
			data.commit()
			this.state.add('Boot', Boot, false)
			this.state.add('Preloader', Preloader, false)
			this.state.add('Title', Title, false)
			this.state.start('Boot')				
		}).catch(e => console.error(e))
	}

	loadAds(): Promise<void> {
		return FBInstant.getRewardedVideoAsync('392451404877797_393676934755244').then(rewarded => {
			game.adsVideo = rewarded
			return game.adsVideo.loadAsync()
		})
		.then( () => console.log('Rewarded video preloaded'))
		.catch( e => console.error('Rewarded video failed to preload: ' + e.message) )
	}

	showAds(): Promise<void> {
		return this.adsVideo.showAsync()
	}
}


window.onload = function() {
    launch(isCloud)
}