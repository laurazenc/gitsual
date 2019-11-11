// @flow
import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { loadRepo } from '../store/actions/repo';
import { toSvgPath } from '../lib/branch-path';

import BranchLabel, { paddingX } from '../components/BranchLabel';
import { TAG_PADDING_X } from '../components/Tag';
import { Dot, dotStyle } from '../components/Dot';

const Container = styled.div`
  position: relative;
  height: 100%;
  display: flex;
  flex: 1;
`;

const Repo = ({ match, actions, repo }) => {
  const { params } = match;
  const [commits, setCommits] = useState([]);
  const [edges, setbranchesPaths] = useState(new Map());
  const [commitMessagesX, setcommitMessagesX] = useState(0);
  const [currentCommitOver, setcurrentCommitOver] = useState(null);
  const [commitYWithOffsets, setcommitYWithOffsets] = useState({});
  const graphRef = useRef();
  const commitsRef = useRef();

  const $tooltip: React.ReactElement<SVGGElement> | null = null;

  const commitsElements: {
    [commitHash: string]: {
      branchLabel: React.RefObject<SVGGElement> | null,
      tags: Array<React.RefObject<SVGGElement>>,
      message: React.RefObject<SVGGElement> | null
    }
  } = {};

  useEffect(() => {
    const load = async () => {
      await actions.loadRepo(params.name);
    };
    params.name && load(); // eslint-disable-line
  }, [params.name]);

  useEffect(() => {
    const { graph } = repo.repo;
    if (graph) {
      const { commits, commitMessagesX, edges } = graph;
      setCommits(commits);
      setbranchesPaths(edges);
      setcommitMessagesX(commitMessagesX);
      positionCommitsElements();
      // setcommitYWithOffsets(computeOffsets(commits));
    }
  }, [repo]);

  const positionCommitsElements = (): void => {
    const padding = 10;
    console.log('commitsElements', commitsElements);
    // Ensure commits elements (branch labels, message…) are well positionned.
    // It can't be done at render time since elements size is dynamic.
    Object.keys(commitsElements).forEach(commitHash => {
      const { branchLabel, tags, message } = commitsElements[commitHash];

      // We'll store X position progressively and translate elements.
      let x = commitMessagesX;

      if (branchLabel && branchLabel.current) {
        moveElement(branchLabel.current, x);

        // For some reason, one paddingX is missing in BBox width.
        const branchLabelWidth = branchLabel.current.getBBox().width + paddingX;
        x += branchLabelWidth + padding;
      }

      tags.forEach(tag => {
        if (!tag || !tag.current) return;

        moveElement(tag.current, x);

        // For some reason, one paddingX is missing in BBox width.
        const tagWidth = tag.current.getBBox().width + TAG_PADDING_X;
        x += tagWidth + padding;
      });

      if (message && message.current) {
        moveElement(message.current, x);
      }
    });
  };

  const renderDot = (commit: Commit<ReactSvgElement>) => {
    if (commit.renderDot) {
      return commit.renderDot(commit);
    }

    return (
      <Dot
        commit={commit}
        onMouseOver={() => {
          setcurrentCommitOver(commit);
          commit.onMouseOver();
        }}
        onMouseOut={() => {
          setcurrentCommitOver(null);
          this.$tooltip = null;
          commit.onMouseOut();
        }}
      />
    );
  };

  const computeOffsets = (commits: Element[]) => {
    let totalOffsetY = 0;

    // In VerticalReverse orientation, commits are in the same order in the DOM.
    const orientedCommits = commits;

    return orientedCommits.reduce((newOffsets, commit) => {
      const commitY = parseInt(
        commit
          .getAttribute('transform')
          .split(',')[1]
          .slice(0, -1),
        10
      );

      const firstForeignObject = commit.getElementsByTagName(
        'foreignObject'
      )[0];
      const customHtmlMessage =
        firstForeignObject && firstForeignObject.firstElementChild;

      let messageHeight = 0;
      if (customHtmlMessage) {
        const { height } = customHtmlMessage.getBoundingClientRect();
        const marginTopInPx =
          window.getComputedStyle(customHtmlMessage).marginTop || '0px';
        const marginTop = parseInt(marginTopInPx.replace('px', ''), 10);

        messageHeight = height + marginTop;
      }

      // Force the height of the foreignObject (browser issue)
      if (firstForeignObject) {
        firstForeignObject.setAttribute('height', `${messageHeight}px`);
      }

      newOffsets[commitY] = commitY + totalOffsetY;

      // Increment total offset after setting the offset
      // => offset next commits accordingly.
      totalOffsetY += messageHeight;

      return newOffsets;
    }, {});
  };

  const getWithCommitOffset = ({ x, y }: Coordinate): Coordinate => {
    return { x, y: commitYWithOffsets[y] || y };
  };

  const moveElement = (target: Element, x: number): void => {
    const transform = target.getAttribute('transform') || 'translate(0, 0)';
    target.setAttribute(
      'transform',
      transform.replace(/translate\(([\d\.]+),/, `translate(${x},`)
    );
  };

  const renderBranchesPaths = () => {
    const offset = 15;
    const isBezier = false;
    return Array.from(edges).map(([, coordinates], i) => {
      return (
        <path
          key={`${i}-asd`}
          d={toSvgPath(coordinates, isBezier, true)}
          fill="blue"
          stroke="#000"
          strokeWidth="5"
          transform={`translate(${offset}, ${offset})`}
        />
      );
    });
  };

  const renderCommits = () => {
    return (
      <g ref={commitsRef}>{commits.map(commit => renderCommit(commit))}</g>
    );
  };

  const renderCommit = (commit: Commit<ReactSvgElement>) => {
    const { x, y } = getWithCommitOffset(commit);
    return (
      <g key={commit.hashAbbrev} transform={`translate(${x}, ${y})`}>
        {renderDot(commit)}
        {/* {renderArrows(commit) */}
        <g transform={`translate(${-x}, 0)`}>
          {renderMessage(commit)}
          {/* {renderBranchLabels(commit)} */}
          {/* {this.renderTags(commit)} */}
        </g>
      </g>
    );
  };

  const createBranchLabelRef = (
    commit: Commit<ReactSvgElement>
  ): React.RefObject<SVGGElement> => {
    const ref = React.createRef<SVGGElement>();

    if (!commitsElements[commit.hashAbbrev]) {
      initCommitElements(commit);
    }

    commitsElements[commit.hashAbbrev].branchLabel = ref;

    return ref;
  };

  const renderBranchLabels = (commit: Commit<ReactSvgElement>) => {
    // @gitgraph/core could compute branch labels into commits directly.
    // That will make it easier to retrieve them, just like tags.
    if (commit.branches[0] === '') return null;

    const ref = createBranchLabelRef(commit);
    const branchLabel = (
      <BranchLabel branch={commit.branches[0]} commit={commit} />
    );

    const commitDotSize = 30 * 2;
    const horizontalMarginTop = 15;
    const y = commitDotSize + horizontalMarginTop;

    return (
      <g
        key={commit.branches[0]}
        ref={ref}
        transform={`translate(${commit.x}, ${y})`}
      >
        {branchLabel}
      </g>
    );
    // });
  };

  const initCommitElements = (commit: Commit<ReactSvgElement>): void => {
    commitsElements[commit.hashAbbrev] = {
      branchLabel: null,
      tags: [],
      message: null
    };
  };

  const createMessageRef = (
    commit: Commit<ReactSvgElement>
  ): React.RefObject<SVGGElement> => {
    const ref = React.createRef<SVGGElement>();

    if (!commitsElements[commit.hashAbbrev]) {
      initCommitElements(commit);
    }

    commitsElements[commit.hashAbbrev].message = ref;

    return ref;
  };

  const renderMessage = (commit: Commit<ReactSvgElement>) => {
    const ref = createMessageRef(commit);

    if (commit.renderMessage) {
      return <g ref={ref}>{commit.renderMessage(commit)}</g>;
    }

    let body = null;
    if (commit.body) {
      body = (
        <foreignObject width="600" x="10">
          <p>{commit.body}</p>
        </foreignObject>
      );
    }

    // Use commit dot radius to align text with the middle of the dot.
    const y = 3;
    return (
      <g
        ref={ref}
        transform={`translate(${commitMessagesX + dotStyle.size * 2 + 50}, ${y +
          dotStyle.size / 2})`}
      >
        <text
          alignmentBaseline="central"
          fill="black"
          style={{ font: 'normal 10pt Calibri' }}
          onClick={commit.onMessageClick}
        >
          {commit.message}
        </text>
        {body}
      </g>
    );
  };

  return (
    <Container>
      <Link to="/">Go back</Link>
      <svg ref={graphRef}>
        <g transform={`translate(${paddingX}, 10)`}>
          {renderBranchesPaths()}
          {renderCommits()}
        </g>
      </svg>
    </Container>
  );
};

Repo.propTypes = {
  match: PropTypes.object,
  actions: PropTypes.object,
  repo: PropTypes.object
};

const mapStateToProps = ({ repo }) => ({
  repo
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ loadRepo }, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Repo);
