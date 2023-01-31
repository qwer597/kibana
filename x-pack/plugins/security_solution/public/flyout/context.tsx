/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { noop } from 'lodash/fp';
import type { SecurityFlyoutPanel } from '../common/store/flyout/panel-model';
import type { SecurityFlyoutLayout } from '../common/store/flyout/model';
import {
  closeSecurityFlyoutLeftPanel,
  closeSecurityFlyoutPanels,
  closeSecurityFlyoutPreviewPanel,
  closeSecurityFlyoutRightPanel,
  openSecurityFlyoutLeftPanel,
  openSecurityFlyoutPreviewPanel,
  openSecurityFlyoutRightPanel,
} from '../common/store/flyout/reducers';

export interface ExpandableFlyoutContext {
  /**
   *
   */
  close: () => void;
  /**
   *
   */
  panels: SecurityFlyoutLayout;
  /**
   *
   */
  scope: string;
  /**
   *
   */
  openRightPanel: (panel: SecurityFlyoutPanel) => void;
  /**
   *
   */
  openLeftPanel: (panel: SecurityFlyoutPanel) => void;
  /**
   *
   */
  openPreviewPanel: (panel: SecurityFlyoutPanel) => void;
  /**
   *
   */
  closeRightPanel: () => void;
  /**
   *
   */
  closeLeftPanel: () => void;
  /**
   *
   */
  closePreviewPanel: () => void;
  /**
   *
   */
  closePanels: () => void;
}

export const ExpandableFlyoutContext = createContext<ExpandableFlyoutContext>({
  panels: {
    left: {},
    right: {},
    preview: [],
  },
  scope: '',
  openRightPanel: noop,
  openLeftPanel: noop,
  openPreviewPanel: noop,
  closeRightPanel: noop,
  closeLeftPanel: noop,
  closePreviewPanel: noop,
  closePanels: noop,
  close: noop,
});

export interface ExpandableFlyoutProviderProps {
  /**
   *
   */
  layout: SecurityFlyoutLayout;
  /**
   *
   */
  scope: string;
  /**
   *
   */
  children: React.ReactNode;
  /**
   *
   */
  close: () => void;
}

export const ExpandableFlyoutProvider = ({
  layout,
  scope,
  children,
  close,
}: ExpandableFlyoutProviderProps) => {
  const [panels, setPanels] = useState(layout);
  const dispatch = useDispatch();

  const openRightPanel = useCallback(
    (p: SecurityFlyoutPanel) => dispatch(openSecurityFlyoutRightPanel({ scope, panel: p })),
    [dispatch, scope]
  );

  const openLeftPanel = useCallback(
    (p: SecurityFlyoutPanel) => dispatch(openSecurityFlyoutLeftPanel({ scope, panel: p })),
    [dispatch, scope]
  );

  const openPreviewPanel = useCallback(
    (p: SecurityFlyoutPanel) => dispatch(openSecurityFlyoutPreviewPanel({ scope, panel: p })),
    [dispatch, scope]
  );

  const closeRightPanel = useCallback(
    () => dispatch(closeSecurityFlyoutRightPanel({ scope })),
    [dispatch, scope]
  );

  const closeLeftPanel = useCallback(
    () => dispatch(closeSecurityFlyoutLeftPanel({ scope })),
    [dispatch, scope]
  );

  const closePreviewPanel = useCallback(
    () => dispatch(closeSecurityFlyoutPreviewPanel({ scope })),
    [dispatch, scope]
  );

  const closePanels = useCallback(
    () => dispatch(closeSecurityFlyoutPanels({ scope })),
    [dispatch, scope]
  );

  useEffect(() => setPanels(layout), [layout]);

  const contextValue = useMemo(
    () => ({
      panels,
      scope,
      openRightPanel,
      openLeftPanel,
      openPreviewPanel,
      closeRightPanel,
      closeLeftPanel,
      closePreviewPanel,
      closePanels,
      close,
    }),
    [
      panels,
      scope,
      openRightPanel,
      openLeftPanel,
      openPreviewPanel,
      closeRightPanel,
      closeLeftPanel,
      closePreviewPanel,
      closePanels,
      close,
    ]
  );

  return (
    <ExpandableFlyoutContext.Provider value={contextValue}>
      {children}
    </ExpandableFlyoutContext.Provider>
  );
};

export const useExpandableFlyoutContext = () =>
  useContext<NonNullable<ExpandableFlyoutContext>>(ExpandableFlyoutContext);
