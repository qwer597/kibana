/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React, { useState } from 'react';
import { EuiFlexGroup } from '@elastic/eui';
import { Insights } from '../../../../../common/components/event_details/insights/insights';
import { TableId } from '../../../../../../common/types';
import { useEventDetailsPanelContext } from '../context';
import { HeaderSection } from '../../../../../common/components/header_section';
import { INSIGHTS_TITLE } from '../translations';

export const InsightsSection = () => {
  const { browserFields, dataFormattedForFieldBrowser, searchHit } = useEventDetailsPanelContext();
  const [isPanelExpanded, setIsPanelExpanded] = useState(false);

  const { _id, _index } = searchHit ?? {};
  if (!_id || !_index) return <></>;

  return (
    <EuiFlexGroup gutterSize="none" direction="column">
      <HeaderSection
        alignHeader="center"
        hideSubtitle
        outerDirection="row"
        title={INSIGHTS_TITLE}
        titleSize="xs"
        toggleQuery={setIsPanelExpanded}
        toggleStatus={isPanelExpanded}
      />
      {isPanelExpanded && (
        <Insights
          browserFields={browserFields}
          eventId={_id}
          data={dataFormattedForFieldBrowser}
          scopeId={TableId.alertsOnAlertsPage}
        />
      )}
    </EuiFlexGroup>
  );
};
