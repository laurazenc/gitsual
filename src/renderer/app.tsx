import react, { Fragment } from 'react';
import { render } from 'react-dom';
import { AppContainer as ReactHotAppContainer } from 'react-hot-loader';
import Root from './pages/Root';
import { configureStore, history } from './store';

const store = configureStore({});

const AppContainer = process.env.PLAIN_HMR ? Fragment : ReactHotAppContainer;

const mainElement = document.createElement('div');
document.body.appendChild(mainElement);

render(
    <AppContainer>
        <Root store={store} history={history} />
    </AppContainer>,
    mainElement
);
