import storeDev from './store.dev';
import storeProd from './store.prod';

const selectedConfigureStore =
    process.env.NODE_ENV === 'production' ? configureStoreProd : configureStoreDev;

export const { configureStore } = selectedConfigureStore;

export const { history } = selectedConfigureStore;
