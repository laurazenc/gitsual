// @flow
import React, { useState, useRef, useEffect } from 'react';
import { Branch } from '../lib/branch';
import { Commit } from '../lib/commit';

export const paddingX = 10;
export const paddingY = 5;

const BranchLabel = props => {
  const { branch, commit } = props;
  const [textWidth, settextWidth] = useState(0);
  const [textHeight, settextHeight] = useState(0);

  const $text = useRef<SVGTextElement>();

  useEffect(() => {
    const box = $text.current.getBBox();
    settextWidth(box.width);
    settextHeight(box.height);
  }, []);

  const boxWidth = textWidth + 2 * paddingX;
  const boxHeight = textHeight + 2 * paddingY;

  return (
    <g>
      <rect
        stroke="blue"
        fill="green"
        rx={30}
        width={boxWidth}
        height={boxHeight}
      />
      <text
        ref={$text}
        fill="red"
        alignmentBaseline="middle"
        dominantBaseline="middle"
        x={paddingX}
        y={boxHeight / 2}
      >
        {branch}
      </text>
    </g>
  );
};

export default BranchLabel;
