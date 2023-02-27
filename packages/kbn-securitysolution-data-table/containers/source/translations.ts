/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { i18n } from '@kbn/i18n';

export const ERROR_BEAT_FIELDS = i18n.translate(
  'xpack.securitySolution.beatFields.errorSearchDescription',
  {
    defaultMessage: `An error has occurred on getting beat fields`,
  }
);

export const FAIL_BEAT_FIELDS = i18n.translate(
  'xpack.securitySolution.beatFields.failSearchDescription',
  {
    defaultMessage: `Failed to run search on beat fields`,
  }
);
