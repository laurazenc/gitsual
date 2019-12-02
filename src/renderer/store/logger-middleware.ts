interface Action {
    type: string
}

const logger = (store: any) => (next: any) => (action: Action) => {
    if (typeof action !== 'function') {
        console.group(action.type) // eslint-disable-line
		console.info('dispatching', action) // eslint-disable-line
        const result = next(action)
		console.log('next state', store.getState()) // eslint-disable-line
		console.groupEnd() // eslint-disable-line

        return result
    }
    return next(action)
}

export default logger
