import React from 'react';
import PropTypes from 'prop-types';

import styles from './sidebar.css';

const Sidebar = ({ currentBranch, localBranches, remoteBranches }) => {
  return (
    <div className={styles.sidebar}>
      <div>
        <h3>My branches</h3>
        <ul>
          {localBranches.map(branch => {
            return (
              <li className={branch.path === currentBranch ? 'current' : ''}>
                {branch.name}
              </li>
            );
          })}
        </ul>
      </div>
      <div>
        <h3>Remote branches</h3>
        <ul>
          {remoteBranches.map(branch => {
            return <li>{branch.name}</li>;
          })}
        </ul>
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  currentBranch: PropTypes.string,
  localBranches: PropTypes.array,
  remoteBranches: PropTypes.array
};

export default Sidebar;
