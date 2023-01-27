/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React from 'react';
import { EuiHorizontalRule, EuiPanel, EuiSpacer } from '@elastic/eui';
import { SessionViewerPreview } from '../components/session_viewer_preview';
import { InsightsSection } from '../components/insights';
import { MitreDetails } from '../components/mitre-details';
import { RuleDetails } from '../components/rule-details';
import { ReasonDetails } from '../components/reason-details';
import { HighlightedFields } from '../components/highlighted-fields';
import { Entities } from '../components/entities';

export const EventOverviewTab: React.FC = React.memo(() => {
  return (
    <>
      <MitreDetails />
      <RuleDetails />
      <EuiHorizontalRule margin="l" />
      <SessionViewerPreview />
      <EuiSpacer size="m" />
      <EuiSpacer size="m" />
      <EuiPanel hasBorder hasShadow={false}>
        <ReasonDetails />
      </EuiPanel>
      <EuiSpacer size="m" />
      <EuiPanel hasBorder hasShadow={false}>
        <HighlightedFields />
      </EuiPanel>
      <EuiHorizontalRule margin="l" />
      <Entities />
      <EuiHorizontalRule margin="l" />
      <InsightsSection />
    </>
  );
});

EventOverviewTab.displayName = 'EventOverviewTab';
