import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { loadRepo, initSideBar } from '../store/actions/repo';

const Repo = ({ match, actions, repo }) => {
  const { params } = match;
  useEffect(() => {
    const openRepo = async () => {
      await actions.loadRepo(params.name);
    };
    params.name && openRepo(); // eslint-disable-line
  }, [params]);

  useEffect(() => {
    const getInfo = async () => {
      await actions.initSideBar(repo.repo);
    };
    repo.repo && getInfo(); // eslint-disable-line
  }, [repo.repo]);

  const getLocalBranches = branches => {
    let localBranches = branches.filter(branch => {
      return branch.name().indexOf('refs/heads') !== -1;
    });
    localBranches = localBranches.map(branch => {
      return {
        name: branch.name().replace(/refs\/heads\//g, ''),
        path: branch.name(),
        isHead: branch.isHead()
      };
    });
    return localBranches.map(branch => {
      return <div key={branch.name}>{branch.name}</div>;
    });
  };

  const getRemoteBranches = branches => {
    const branchNames = [];

    let remoteBranches = branches.filter(branch => {
      for (const branchName of branchNames) {
        if (branchName === branch.name()) {
          return false;
        }
      }
      branchNames.push(branch.name());
      return branch.name().indexOf('refs/remotes') !== -1;
    });
    remoteBranches = remoteBranches.map(branch => {
      return {
        name: branch
          .name()
          .replace(/refs\/remotes\//g, '')
          .split('/')[1],
        path: branch.name(),
        isHead: branch.isHead()
      };
    });
    return remoteBranches.map(branch => {
      return <div key={branch.name}>{branch.name}</div>;
    });
  };

  return (
    <>
      <Link to="/">Go back</Link>
      <div>Repo: {params.name}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <h2>Branches</h2>
          <h3>Local</h3>
          {getLocalBranches(repo.branches)}
          <h3>Origin</h3>
          {getRemoteBranches(repo.branches)}
        </div>
        <div>body</div>
      </div>
    </>
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
