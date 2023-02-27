/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { AlertsTableConfigurationRegistry } from '@kbn/triggers-actions-ui-plugin/public/types';
import type { QueryDslQueryContainer } from '@elastic/elasticsearch/lib/api/types';
import type { SerializableRecord } from '@kbn/utility-types';
import { isEqual } from 'lodash';
import type { Filter } from '@kbn/es-query';
import { useCallback } from 'react';
import type { TableId } from '@kbn/securitysolution-data-table/common/types';
import type { inputsModel, State } from '../../../common/store';
import { useShallowEqualSelector } from '../../../common/hooks/use_selector';
import { inputsSelectors } from '../../../common/store';
import { SourcererScopeName } from '../../../common/store/sourcerer/model';
import { useGlobalTime } from '../../../common/containers/use_global_time';
import { useAddBulkToTimelineAction } from '../../components/alerts_table/timeline_actions/use_add_bulk_to_timeline';
import { useBulkAlertActionItems } from './use_alert_actions';
import { useBulkAddToCaseActions } from '../../components/alerts_table/timeline_actions/use_bulk_add_to_case_actions';

// check to see if the query is a known "empty" shape
export function isKnownEmptyQuery(query: QueryDslQueryContainer) {
  const queries = [
    // the default query used by the job wizards
    { bool: { must: [{ match_all: {} }] } },
    // the default query used created by lens created jobs
    { bool: { filter: [], must: [{ match_all: {} }], must_not: [] } },
    // variations on the two previous queries
    { bool: { filter: [], must: [{ match_all: {} }] } },
    { bool: { must: [{ match_all: {} }], must_not: [] } },
    // the query generated by QA Framework created jobs
    { match_all: {} },
  ];
  if (queries.some((q) => isEqual(q, query))) {
    return true;
  }

  return false;
}

function getFiltersForDSLQuery(datafeedQuery: QueryDslQueryContainer): Filter[] {
  if (isKnownEmptyQuery(datafeedQuery)) {
    return [];
  }

  return [
    {
      meta: {
        negate: false,
        disabled: false,
        type: 'custom',
        value: JSON.stringify(datafeedQuery),
      },
      query: datafeedQuery as SerializableRecord,
    },
  ];
}

export const getBulkActionHook =
  (tableId: TableId): AlertsTableConfigurationRegistry['useBulkActions'] =>
  (query) => {
    const { from, to } = useGlobalTime();
    const filters = getFiltersForDSLQuery(query);
    const getGlobalQueries = inputsSelectors.globalQuery();

    const globalQuery = useShallowEqualSelector((state: State) => getGlobalQueries(state));

    const refetchGlobalQuery = useCallback(() => {
      globalQuery.forEach((q) => q.refetch && (q.refetch as inputsModel.Refetch)());
    }, [globalQuery]);

    const timelineAction = useAddBulkToTimelineAction({
      localFilters: filters,
      from,
      to,
      scopeId: SourcererScopeName.detections,
      tableId,
    });

    const alertActions = useBulkAlertActionItems({
      scopeId: SourcererScopeName.detections,
      filters,
      from,
      to,
      tableId,
      refetch: refetchGlobalQuery,
    });

    const caseActions = useBulkAddToCaseActions();

    return [...alertActions, ...caseActions, timelineAction];
  };
