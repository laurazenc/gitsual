import * as React from 'react'
import { Provider, connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { ConnectedRouter } from 'connected-react-router'
import { hot } from 'react-hot-loader/root'
import Routes from './Routes'
import { createGlobalStyle, ThemeProvider } from 'styled-components'

import { initTheme, ThemeActionTypes } from '../store/actions/theme'
import { InitThemeReducer } from '../store/reducers/theme'

const { useEffect, useState } = React

const GlobalStyle = createGlobalStyle`
  @import url("https://fonts.googleapis.com/css?family=Poppins:400,500,700");
  
  html, body {
    margin: 0;
    padding: 0;
    height: 100vh;    
  }



  * {
    box-sizing: border-box;
  }
`


const Root = ({ store, history, actions, theme }: any) => {
	const [useTheme, setTheme] = useState(theme)
	useEffect(() => {
		async function init() {
			await actions.initTheme()
			setTheme(theme)
		}
		init()
	}, [])

	return (<Provider store={store}>
		<ThemeProvider theme={useTheme}>
			<ConnectedRouter history={history}>
				<>
					<GlobalStyle />
					<Routes />
				</>
			</ConnectedRouter>
		</ThemeProvider>
	</Provider>)
}
	

	const mapStateToProps = (state: InitThemeReducer) => ({
		theme: state.theme.theme
	})

	const mapDispatchToProps = (dispatch: any) => ({
		actions: bindActionCreators({ initTheme }, dispatch)
	})
   
	
export default hot(connect(mapStateToProps, mapDispatchToProps)(Root))
