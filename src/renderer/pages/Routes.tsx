import * as React from 'react'
import { Switch, Route } from 'react-router'
import App from './App'
import Home from './Home'

export default () => (
	<App>
		<Switch>
			<Route exact={true} path="/" component={Home} />>
		</Switch>
	</App>
)