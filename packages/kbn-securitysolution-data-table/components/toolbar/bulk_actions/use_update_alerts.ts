/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import type * as estypes from '@elastic/elasticsearch/lib/api/typesWithBodyKey';
import type { CoreStart } from '@kbn/core/public';

import { useKibana } from '@kbn/kibana-react-plugin/public';
import { DETECTION_ENGINE_SIGNALS_STATUS_URL } from '../../../../../common/constants';
import type { AlertWorkflowStatus } from '../../../types';

/**
 * Update alert status by query
 *
 * @param useDetectionEngine logic flag for using the regular Detection Engine URL or the RAC URL
 *
 * @param status to update to('open' / 'closed' / 'acknowledged')
 * @param index index to be updated
 * @param query optional query object to update alerts by query.

 *
 * @throws An error if response is not OK
 */
export const useUpdateAlertsStatus = (): {
  updateAlertStatus: (params: {
    status: AlertWorkflowStatus;
    index: string;
    query: object;
  }) => Promise<estypes.UpdateByQueryResponse>;
} => {
  const { http } = useKibana<CoreStart>().services;
  return {
    updateAlertStatus: async ({ status, index, query }) => {
      return http.fetch<estypes.UpdateByQueryResponse>(DETECTION_ENGINE_SIGNALS_STATUS_URL, {
        method: 'POST',
        body: JSON.stringify({ status, query }),
      });
    },
  };
};
