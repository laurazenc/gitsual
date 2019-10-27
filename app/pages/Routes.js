import React from 'react';
import { Switch, Route } from 'react-router';
import App from './App';
import Home from './Home';
import Repo from './Repo';

export default () => (
  <App>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/repo/:name" component={Repo} />
    </Switch>
  </App>
);