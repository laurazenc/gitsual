// @flow
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { findProject, listProject } from '../store/actions/project';

const ProjectList = styled.ul``;
const ProjectItem = styled.li``;

type Props = {
  projects: Array,
  actions: any
};

const Home = ({ projects, actions }: Props) => {
  useEffect(() => {
    const getProjects = async () => {
      await actions.listProject();
    };
    getProjects();
  }, []);

  const retrieveProject = async () => {
    await actions.findProject();
  };

  return (
    <div>
      Home
      <button onClick={() => retrieveProject()}>Open project</button>
      <div>Current repos:</div>
      <ProjectList>
        {projects.map(project => {
          return (
            <ProjectItem key={project.name}>
              <Link to={`/repo/${project.name}`}>{project.name}</Link>
            </ProjectItem>
          );
        })}
      </ProjectList>
    </div>
  );
};

Home.propTypes = {
  projects: PropTypes.array,
  actions: PropTypes.object
};

const mapStateToProps = ({ project }) => ({
  projects: project.list
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ findProject, listProject }, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
