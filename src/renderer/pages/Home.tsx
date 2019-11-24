import * as React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { Theme } from '../../bin/ThemeManager'
import { Button, Flex, Icon, Text } from '../components'

const FlexContainer = styled(Flex)`
	height: 100%;
`


const Panel = styled.div``

const Home = () => {		
	return <FlexContainer justify="space-between" align="center" direction="column" padding="16px">
		<Flex direction="column" align="center" justify="center" maxWidth="700px" style={{height: '100%'}} >
			<Icon name="logo" />
			<Text size="21px" height="30px" margin="30px 0"> Welcome to gitsual </Text>
			<Flex justify="space-between" margin="100px 0 0">
				<Panel>
					<Button border={true} radius="3px" justify="flex-start" margin="0 0 10px 0" padding="6px 12px">
						<Icon name="folder" color="accent" />
						<Text size="16px" height="24px" margin="0 0 0 10px">Open existing repo</Text>
					</Button>
					<Button border={true} radius="3px" justify="flex-start" margin="0 0 10px 0" padding="6px 12px">
						<Icon name="laptop" color="accent" />
						<Text size="16px" height="24px" margin="0 0 0 10px">Clone repository</Text>
					</Button>
					<Button border={true} radius="3px" justify="flex-start" padding="6px 12px">
						<Icon name="file" color="accent" />
						<Text size="16px" height="24px" margin="0 0 0 10px">Start new repo</Text>
					</Button>
				</Panel>
				<Panel>
					<Text size="20px" height="30px" margin="0 0 16px 0">Recent</Text>
					<Flex>
						<Text size="16px" height="24px" margin="0 12px 0 0" color="accent">gitsual</Text>
						<Text size="16px" height="24px" color="light">C:/Users/wadus/gitsual</Text>
					</Flex>
					<Flex>
						<Text size="16px" height="24px" margin="0 12px 0 0" color="accent">gitsual</Text>
						<Text size="16px" height="24px" color="light">C:/Users/wadus/gitsual</Text>
					</Flex>
				</Panel>
				<Panel>
					<Text size="20px" height="30px" margin="0 0 16px 0">Customize</Text>
					<Flex align="center">
						<Icon name="cog" />
						<Text size="16px" height="24px" color="accent" margin="0 0 0 10px">Preferences</Text>
					</Flex>				
				</Panel>
			</Flex>					
		</Flex>
		<Flex justify="center">
			<Text size="12px" height="16px">Made with </Text>
			<Icon name="heart" color="red" />
			<Text size="12px" height="16px"> by </Text>
			<Text size="12px" height="16px" color="accent">@laurazenc</Text>
		</Flex>
	</FlexContainer>
}

const mapStateToProps = (state: any) => ({
	theme: state.theme.theme
})

export default connect(mapStateToProps)(Home)