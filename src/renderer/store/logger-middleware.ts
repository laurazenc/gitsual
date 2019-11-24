interface Action {
	type: string
}

const logger = (store: any) => (next: any) => (action: Action) => {
	if (typeof action !== 'function') {
	/* tslint:disable */
		console.group(action.type)
		console.info('dispatching', action)
		const result = next(action)
		console.log('next state', store.getState())
		console.groupEnd()
	/* tslint:enable */
		return result
	} 
		return next(action)
	
}

export default logger
