import { ConnectedRouter } from 'connected-react-router'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'
import { connect, Provider } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createGlobalStyle, ThemeProvider } from 'styled-components'
import Routes from './Routes'

import { loadProjects } from '../store/actions/projects'
import { initTheme } from '../store/actions/theme'

import { AppState } from '../store/reducers'

const { useEffect, useState } = React

const GlobalStyle = createGlobalStyle`
  @import url("https://fonts.googleapis.com/css?family=Poppins:400,500,600,700");
  
  html, body {
    margin: 0;
    padding: 0;
    height: 100vh;    
  }

  svg:not(:root) {
      overflow: inherit;
  }

  a {
      text-decoration: none;
  }


  * {
    box-sizing: border-box;
  }
  ul, li {
    margin:0;
    padding: 0;
    text-indent: 0;
    list-style-type: none;
  }

  *::-webkit-scrollbar  {
    width: 5px;
    height: 5px;
    }
    
    *::-webkit-scrollbar-track {
        border-radius: 5px;
        
    }

    *::-webkit-scrollbar-corner       { display: none; }

    
    *::-webkit-scrollbar-thumb {
        background-color: ${props => props.theme && props.theme.colors.zircon};
        border-radius: 5px;
    }


`

const Root = ({ store, history, actions, theme }: any) => {
    const [useTheme, setTheme] = useState(theme)
    useEffect(() => {
        async function init() {
            await actions.initTheme()
            setTheme(theme)
            await actions.loadProjects()
        }
        init()
    }, [])

    return (
        <Provider store={store}>
            <ThemeProvider theme={useTheme}>
                <ConnectedRouter history={history}>
                    <>
                        <GlobalStyle theme={useTheme} />
                        <Routes />
                    </>
                </ConnectedRouter>
            </ThemeProvider>
        </Provider>
    )
}

const mapStateToProps = (state: AppState) => ({
    theme: state.theme.theme,
})

const mapDispatchToProps = (dispatch: any) => ({
    actions: bindActionCreators({ initTheme, loadProjects }, dispatch),
})

export default hot(connect(mapStateToProps, mapDispatchToProps)(Root))
