import React, { Component } from 'react'
import styled from 'styled-components'

const AppWrapper = styled.div`
    height: 100vh;
    padding: 0;
    margin: 0;
    background-color: ${props => props.theme.window.backgroundColor};
`

const App = ({ children }: any) => {
	return <AppWrapper>{children}</AppWrapper>
}

export default App
