export interface Storable {
	commit(): void
	load(): Promise<any>
}
export interface listener {
	context: any
	callback: Function
}
interface observer {
	key:string
	listener: listener[]
}

export function bindable(target: any, key: string) {
	if (this === undefined)
		return
	let _val = this[key]

	let getter = function () { return _val }

	let setter = function (newVal:any) {
		_val = newVal
		let listener = undefined
		for (let i = 0; i < this.observeTable.length; i++)
			if (this.observeTable[i])
				if (this.observeTable[i].key === key)
					listener = this.observeTable[i].listener
		if (listener !== undefined)
			for (let j = 0; j < listener.length; j++)
					listener[j].callback.apply(listener[j].context,[newVal])
	}

	if (delete this[key]) {
		Object.defineProperty(target, key, { get: getter, set: setter, enumerable: true, configurable: true })
	}
}

export function noenum(target: any, key: string) {
	if (this === undefined)
		return
	let _val = this[key]
	let getter = function () { return _val }
	let setter = function (newVal:any) { _val = newVal }

	if (delete this[key]) { Object.defineProperty(target, key, { get: getter, set: setter, enumerable: false, configurable: true })
	}
}

function listKey(obj:any) {
	console.log(Object.keys(obj))
}

export class FBStorage implements Storable {
	@noenum  private leaderBoardName:string
	@noenum private observeTable:observer[] = []

	constructor(leaderBoardName:string) {
		this.leaderBoardName = leaderBoardName
	}

	commit() {
		let saveKeys:string[] = []
		for (let key in this) saveKeys.push(key)

		let saveObj:any = {}
		saveKeys.forEach( key => saveObj[key] = (<any>this)[key])
		FBInstant.player.setDataAsync(saveObj).then(() => {
			FBInstant.getLeaderboardAsync(this.leaderBoardName)
			.then(leaderboard => {
				return leaderboard.setScoreAsync((<any>this)['score']).catch(error => console.log(error))
			})
			.then(() => console.log('Score saved'))
			.catch(error => console.error(error))
		}).catch(error => console.error(error))
	}

	load(): Promise<any> {
		let saveKeys:string[] = []
		for (let key in this) saveKeys.push(key)

		let promise:Promise<any> = FBInstant.player.getDataAsync(saveKeys)
		promise.then( (obj:any) => {
			// console.log(saveKeys)
			saveKeys.forEach( key => { if (obj[key]) (<any>this)[key] = obj[key] })
		})
		return promise
	}

	bind(key:string, listener:Function, context:any) {
		for (let i = 0; i < this.observeTable.length; i++)
			if (this.observeTable[i].key === key)
				this.observeTable[i].listener.push({context:context, callback:listener})
	}

	unbind(key:string, context:any) {

	}

	buildObserveTable() {
		for (let key in this)
			this.observeTable.push({key:key, listener:[]})
	}
}

export class MyFBStorage extends FBStorage {
	@bindable public lv:number
	@bindable public score:number
	@bindable public custom:string
	constructor() {
		super('global_leaderboardnow')
		this.lv = 0
		this.score = 0
		this.custom = ''
		super.buildObserveTable()
	}
}

export class LocalStorage implements Storable {
	constructor() {
	}
	
	load(): Promise<any> {
		return new Promise<any>( (resolve:any, reject:any) => {
			resolve('')
		})
	}

	commit() {

	}
}	
