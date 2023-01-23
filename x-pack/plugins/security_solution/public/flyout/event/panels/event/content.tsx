/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { EuiFlyoutBody } from '@elastic/eui';
import React, { useMemo } from 'react';
import type { EventPanelPaths } from '../panel-model';
import { tabs } from './tabs';

export const EventContent = ({ selectedTabId }: { selectedTabId: EventPanelPaths }) => {
  const selectedTabContent = useMemo(() => {
    return tabs.find((tab) => tab.id === selectedTabId)?.content;
  }, [selectedTabId]);

  return <EuiFlyoutBody>{selectedTabContent}</EuiFlyoutBody>;
};
