/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { EuiFlyoutBody } from '@elastic/eui';
import { css } from '@emotion/react';
import type { VFC } from 'react';
import React, { useMemo } from 'react';
import type { LeftPanelPaths } from '.';
import { tabs } from './tabs';

export interface PanelContentProps {
  /**
   * Id of the tab selected in the parent component to display its content
   */
  selectedTabId: LeftPanelPaths;
}

/**
 * Alert details expandable flyout left section. Appears after the user clicks on the expand details button in the right section.
 * Will display the content of the visualize, investigation, insights and history tabs.
 */
export const PanelContent: VFC<PanelContentProps> = ({ selectedTabId }) => {
  const selectedTabContent = useMemo(() => {
    return tabs.find((tab) => tab.id === selectedTabId)?.content;
  }, [selectedTabId]);

  return (
    <EuiFlyoutBody
      css={css`
        height: calc(100vh - 160px);
      `}
    >
      {selectedTabContent}
    </EuiFlyoutBody>
  );
};

PanelContent.displayName = 'PanelContent';
