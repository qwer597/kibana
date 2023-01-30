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
  openRightPanel: (configUpdate: SecurityFlyoutPanel) => void;
  /**
   *
   */
  openLeftPanel: (configUpdate: SecurityFlyoutPanel) => void;
  /**
   *
   */
  openPreviewPanel: (configUpdate: SecurityFlyoutPanel) => void;
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
  close: noop,
  panels: {
    left: undefined,
    right: undefined,
    preview: undefined,
  },
  openRightPanel: noop,
  openLeftPanel: noop,
  openPreviewPanel: noop,
  closeRightPanel: noop,
  closeLeftPanel: noop,
  closePreviewPanel: noop,
  closePanels: noop,
});

export interface ExpandableFlyoutProviderProps {
  /**
   *
   */
  close: () => void;
  /**
   *
   */
  layout: SecurityFlyoutLayout;
  /**
   *
   */
  children: React.ReactNode;
}

export const ExpandableFlyoutProvider = ({
  close,
  layout,
  children,
}: ExpandableFlyoutProviderProps) => {
  const [panels, setPanels] = useState(layout);
  const dispatch = useDispatch();

  const openRightPanel = useCallback(
    (p: SecurityFlyoutPanel) => dispatch(openSecurityFlyoutRightPanel({ ...p })),
    [dispatch]
  );

  const openLeftPanel = useCallback(
    (p: SecurityFlyoutPanel) => dispatch(openSecurityFlyoutLeftPanel({ ...p })),
    [dispatch]
  );

  const openPreviewPanel = useCallback(
    (p: SecurityFlyoutPanel) => dispatch(openSecurityFlyoutPreviewPanel({ ...p })),
    [dispatch]
  );

  const closeRightPanel = useCallback(() => dispatch(closeSecurityFlyoutRightPanel()), [dispatch]);

  const closeLeftPanel = useCallback(() => dispatch(closeSecurityFlyoutLeftPanel()), [dispatch]);

  const closePreviewPanel = useCallback(
    () => dispatch(closeSecurityFlyoutPreviewPanel()),
    [dispatch]
  );

  const closePanels = useCallback(() => dispatch(closeSecurityFlyoutPanels()), [dispatch]);

  useEffect(() => setPanels(layout), [layout]);

  const contextValue = useMemo(
    () => ({
      close,
      panels,
      openRightPanel,
      openLeftPanel,
      openPreviewPanel,
      closeRightPanel,
      closeLeftPanel,
      closePreviewPanel,
      closePanels,
    }),
    [
      close,
      panels,
      openRightPanel,
      openLeftPanel,
      openPreviewPanel,
      closeRightPanel,
      closeLeftPanel,
      closePreviewPanel,
      closePanels,
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
