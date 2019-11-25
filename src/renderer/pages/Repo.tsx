import * as React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom';

import { bindActionCreators, Dispatch  } from 'redux'

const Repo = () => {		
	return (
		<div>
			<Link to="/">Go back</Link>
			<div>hey</div>
		</div>
	)
}

const mapStateToProps = (state: any) => ({	
	repo: state.projects.projects
})


export default connect<any, any>(mapStateToProps)(Repo)