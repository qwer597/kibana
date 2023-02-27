/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { TableId } from '@kbn/securitysolution-data-table/common/types';
import { defaultHeaders } from './header';

// FIXME add strong typings
export const mockGlobalState: any = {
  app: {
    notesById: {},
    errors: [
      { id: 'error-id-1', title: 'title-1', message: ['error-message-1'] },
      { id: 'error-id-2', title: 'title-2', message: ['error-message-2'] },
    ],
  },
  dataTable: {
    tableById: {
      [TableId.test]: {
        columns: defaultHeaders,
        defaultColumns: defaultHeaders,
        dataViewId: 'security-solution-default',
        deletedEventIds: [],
        expandedDetail: {},
        filters: [],
        indexNames: ['.alerts-security.alerts-default'],
        isSelectAllChecked: false,
        itemsPerPage: 25,
        itemsPerPageOptions: [10, 25, 50, 100],
        loadingEventIds: [],
        selectedEventIds: {},
        showCheckboxes: false,
        sort: [
          {
            columnId: '@timestamp',
            columnType: 'date',
            esTypes: ['date'],
            sortDirection: 'desc',
          },
        ],
        graphEventId: '',
        sessionViewConfig: null,
        selectAll: false,
        id: TableId.test,
        title: '',
        initialized: true,
        updated: 1663882629000,
        isLoading: false,
        queryFields: [],
        totalCount: 0,
      },
    },
  },
};
