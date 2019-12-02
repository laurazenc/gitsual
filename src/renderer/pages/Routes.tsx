import * as React from 'react'
import { Route, Switch } from 'react-router'
import App from './App'
import Home from './Home'
import Repo from './Repo'

export default () => (
    <App>
        <Switch>
            <Route exact={true} path="/" component={Home} />
            <Route exact={true} path="/repo/:name" component={Repo} />
        </Switch>
    </App>
)
