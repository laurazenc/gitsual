import chalk from 'chalk';

interface Action {
    type: string;
}

const logger = (store: any) => (next: any) => (action: Action) => {
    if (typeof action !== 'function') {
        console.group(action.type);
        console.info('dispatching', action);
        const result = next(action);
        console.log('next state', store.getState());
        console.groupEnd();
        return result;
    } 
        return next(action);
    
};

export default logger;
