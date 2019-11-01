import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { loadRepo, initSideBar } from '../store/actions/repo';

const Repo = ({ match, actions, repo }) => {
  return (
    <div>
      <Link to="/">Go back</Link>
    </div>
  );
};

Repo.propTypes = {
  match: PropTypes.object,
  actions: PropTypes.object,
  repo: PropTypes.object
};

const mapStateToProps = ({ project, repo }) => ({
  currentRepo: project.repo,
  repo
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ loadRepo, initSideBar }, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Repo);
