/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { EuiPanel } from '@elastic/eui';
import React from 'react';
import { css } from '@emotion/react/dist/emotion-react.cjs';

export interface PreviewSectionProps {
  component: React.ReactElement;
  width: number | undefined;
}

export const PreviewSection: React.FC<PreviewSectionProps> = ({
  component,
  width,
}: PreviewSectionProps) => {
  const previewWith: string = width ? `${width}px` : '0px';

  return (
    <>
      <div
        css={css`
          position: absolute;
          top: 0;
          bottom: 0;
          right: 0;
          left: ${previewWith};
          background-color: #242934;
          opacity: 0.5;
        `}
      />
      <div
        css={css`
          position: absolute;
          top: 0;
          bottom: 0;
          right: 0;
          left: ${previewWith};
          z-index: 1000;
        `}
      >
        <EuiPanel
          css={css`
            margin: 8px;
            height: 100%;
          `}
        >
          {component}
        </EuiPanel>
      </div>
    </>
  );
};

PreviewSection.displayName = 'PreviewSection';
