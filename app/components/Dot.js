// @flow
import React from 'react';
import { Commit } from '../lib/commit';

interface DotStyle {
  size: Number
}

export const dotStyle: DotStyle = {
  size: 10
};

export interface DotProps {
  commit: Commit<React.ReactElement<SVGElement>>;
  onMouseOver: () => void;
  onMouseOut: () => void;
}

export const Dot: React.SFC<DotProps> = ({
  commit,
  onMouseOver,
  onMouseOut
}) => (
  <>
    <defs>
      <circle
        id={commit.hash}
        cx={dotStyle.size}
        cy={dotStyle.size}
        r={10}
        fill="red"
      />
      <clipPath id={`clip-${commit.hash}`}>
        <use xlinkHref={`#${commit.hash}`} />
      </clipPath>
    </defs>

    <g
      onClick={commit.onClick}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
    >
      <use
        xlinkHref={`#${commit.hash}`}
        clipPath={`url(#clip-${commit.hash})`}
        stroke={1}
        strokeWidth={1 * 2}
      />
      {commit.dotText && (
        <text
          alignmentBaseline="central"
          textAnchor="middle"
          x={3}
          y={3}
          style={{ font: 'normal 10pt Calibri' }}
        >
          {commit.dotText}
        </text>
      )}
    </g>
  </>
);
