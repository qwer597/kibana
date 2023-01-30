/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ExpandableFlyoutProvider } from './context';
import { closeSecurityFlyoutPanels, selectFlyoutLayout } from '../common/store/flyout/reducers';
import { ExpandableFlyout } from '../common/components/expandable_flyout';
import { expandableFlyoutPanels } from './event/panels';

export interface SecurityFlyoutProps {
  /**
   *
   */
  className?: string;
  /**
   * Allows developers to run code on close action
   */
  handleOnClose?: () => void;
}

/**
 * Flyout intended to be used for the entire Security Solution plugin. This flyout has 3 main sections:
 * - a left section
 * - a right section
 * - a preview section
 * Each section can display a panel, with a certain width.
 * The panel's information are saved in the url to display the flyout identically after refresh.
 */
export const SecurityFlyout = React.memo(({ handleOnClose, className }: SecurityFlyoutProps) => {
  const dispatch = useDispatch();
  const flyouts = useSelector(selectFlyoutLayout);

  const close = useCallback(() => {
    if (handleOnClose) handleOnClose();
    dispatch(closeSecurityFlyoutPanels());
  }, [dispatch, handleOnClose]);

  if (!flyouts) return null;

  return (
    <ExpandableFlyoutProvider close={close} layout={flyouts}>
      <ExpandableFlyout className={className} panels={expandableFlyoutPanels} onClose={close} />
    </ExpandableFlyoutProvider>
  );
});

SecurityFlyout.displayName = 'SecurityFlyout';
