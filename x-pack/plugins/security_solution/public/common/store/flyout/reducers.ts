/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import type { State } from '..';
import type { SecurityFlyoutLayout, SecurityFlyoutPanel } from './model';

export interface SecurityFlyoutState {
  byId: { [panelId: string]: SecurityFlyoutPanel };
  leftIds: string[];
  rightIds: string[];
  previewIds: string[];
  idsByScope: { [scopeId: string]: string[] };
  allIds: string[];
}

export const initialFlyoutState: SecurityFlyoutState = {
  byId: {},
  leftIds: [],
  rightIds: [],
  previewIds: [],
  idsByScope: {},
  allIds: [],
};

export const flyoutSlice = createSlice({
  name: 'flyout',
  initialState: initialFlyoutState,
  reducers: {
    openSecurityFlyoutPanels: (
      state,
      action: PayloadAction<{
        scope: string;
        right?: SecurityFlyoutPanel;
        left?: SecurityFlyoutPanel;
        preview?: SecurityFlyoutPanel;
      }>
    ) => {
      const { scope, left, right, preview } = action.payload;

      const byId: { [panelId: string]: SecurityFlyoutPanel } = { ...state.byId };
      const leftIds: string[] = [...state.leftIds];
      const rightIds: string[] = [...state.rightIds];
      const previewIds: string[] = [...state.previewIds];
      const idsByScope: { [scopeId: string]: string[] } = { ...state.idsByScope };
      const allIds: string[] = [...state.allIds];

      if (!idsByScope[scope]) {
        idsByScope[scope] = [];
      }

      if (right) {
        const { key } = right;
        byId[key] = right;
        rightIds.push(key);
        idsByScope[scope].push(key);
        allIds.push(key);
      }
      if (left) {
        const { key } = left;
        byId[key] = left;
        leftIds.push(key);
        idsByScope[scope].push(key);
        allIds.push(key);
      }
      if (preview) {
        const { key } = preview;
        byId[key] = preview;
        previewIds.push(key);
        idsByScope[scope].push(key);
        allIds.push(key);
      }

      return {
        byId,
        leftIds,
        rightIds,
        previewIds,
        idsByScope,
        allIds,
      };
    },
    openSecurityFlyoutRightPanel: (
      state,
      action: PayloadAction<{ scope: string; panel: SecurityFlyoutPanel }>
    ) => {
      const { scope, panel } = action.payload;

      const previousId: string = state.idsByScope[scope].find((id: string) =>
        state.rightIds.includes(id)
      ) as string;

      let scopedIds: string[];
      if (!state.idsByScope[scope]) {
        scopedIds = [panel.key];
      } else {
        scopedIds = state.idsByScope[scope].filter((id: string) => id === previousId);
        scopedIds.push(panel.key);
      }

      return {
        byId: { ...state.byId, [panel.key]: panel },
        leftIds: state.leftIds,
        rightIds: [...state.rightIds.filter((id: string) => id === previousId), panel.key],
        previewIds: state.previewIds,
        idsByScope: { ...state.idsByScope, [scope]: scopedIds },
        allIds: [...state.allIds.filter((id: string) => id === previousId), panel.key],
      };
    },
    openSecurityFlyoutLeftPanel: (
      state,
      action: PayloadAction<{ scope: string; panel: SecurityFlyoutPanel }>
    ) => {
      const { scope, panel } = action.payload;

      const previousId: string = state.idsByScope[scope].find((id: string) =>
        state.leftIds.includes(id)
      ) as string;

      let scopedIds: string[];
      if (!state.idsByScope[scope]) {
        scopedIds = [panel.key];
      } else {
        scopedIds = state.idsByScope[scope].filter((id: string) => id === previousId);
        scopedIds.push(panel.key);
      }

      return {
        byId: { ...state.byId, [panel.key]: panel },
        leftIds: [...state.leftIds.filter((id: string) => id === previousId), panel.key],
        rightIds: state.rightIds,
        previewIds: state.previewIds,
        idsByScope: { ...state.idsByScope, [scope]: scopedIds },
        allIds: [...state.allIds.filter((id: string) => id === previousId), panel.key],
      };
    },
    openSecurityFlyoutPreviewPanel: (
      state,
      action: PayloadAction<{ scope: string; panel: SecurityFlyoutPanel }>
    ) => {
      const { scope, panel } = action.payload;

      const previousId: string = state.idsByScope[scope].find((id: string) =>
        state.rightIds.includes(id)
      ) as string;

      let scopedIds: string[];
      if (!state.idsByScope[scope]) {
        scopedIds = [panel.key];
      } else {
        scopedIds = state.idsByScope[scope].filter((id: string) => id === previousId);
        scopedIds.push(panel.key);
      }

      return {
        byId: { ...state.byId, [panel.key]: panel },
        leftIds: state.leftIds,
        rightIds: state.rightIds,
        previewIds: [...state.previewIds.filter((id: string) => id === previousId), panel.key],
        idsByScope: { ...state.idsByScope, [scope]: scopedIds },
        allIds: [...state.allIds.filter((id: string) => id === previousId), panel.key],
      };
    },
    closeSecurityFlyoutRightPanel: (state, action: PayloadAction<{ scope: string }>) => {
      const { scope } = action.payload;

      if (!state.idsByScope[scope]) {
        return state;
      }

      const scopedIds: string[] = state.idsByScope[scope];
      const panelId: string = scopedIds.find((id: string) => state.rightIds.includes(id)) as string;

      const byId = { ...state.byId };
      delete byId[panelId];

      return {
        byId,
        leftIds: state.leftIds,
        rightIds: state.rightIds.filter((id: string) => id === panelId),
        previewIds: state.previewIds,
        idsByScope: {
          ...state.idsByScope,
          [scope]: state.idsByScope[scope].filter((id: string) => id === panelId),
        },
        allIds: state.allIds.filter((id: string) => id !== panelId),
      };
    },
    closeSecurityFlyoutLeftPanel: (state, action: PayloadAction<{ scope: string }>) => {
      const { scope } = action.payload;

      if (!state.idsByScope[scope]) {
        return state;
      }

      const scopedIds: string[] = state.idsByScope[scope];
      const panelId: string = scopedIds.find((id: string) => state.leftIds.includes(id)) as string;

      const byId = { ...state.byId };
      delete byId[panelId];

      return {
        byId,
        leftIds: state.leftIds.filter((id: string) => id === panelId),
        rightIds: state.rightIds,
        previewIds: state.previewIds,
        idsByScope: {
          ...state.idsByScope,
          [scope]: state.idsByScope[scope].filter((id: string) => id === panelId),
        },
        allIds: state.allIds.filter((id: string) => id !== panelId),
      };
    },
    closeSecurityFlyoutPreviewPanel: (state, action: PayloadAction<{ scope: string }>) => {
      const { scope } = action.payload;

      if (!state.idsByScope[scope]) {
        return state;
      }

      const scopedIds: string[] = state.idsByScope[scope];
      const panelIds: string[] = scopedIds.filter((id: string) => state.previewIds.includes(id));

      const byId = { ...state.byId };
      panelIds.forEach((id: string) => delete byId[id]);

      return {
        byId,
        leftIds: state.leftIds,
        rightIds: state.rightIds,
        previewIds: state.previewIds.filter((id: string) => panelIds.includes(id)),
        idsByScope: {
          ...state.idsByScope,
          [scope]: state.idsByScope[scope].filter((id: string) => panelIds.includes(id)),
        },
        allIds: state.allIds.filter((id: string) => panelIds.includes(id)),
      };
    },
    previousSecurityFlyoutPreviewPanel: (state, action: PayloadAction<{ scope: string }>) => {
      const { scope } = action.payload;

      if (!state.idsByScope[scope]) {
        return state;
      }

      const scopedIds: string[] = [...state.idsByScope[scope]];
      const scopedPreviewIds: string[] = scopedIds.filter((id: string) =>
        state.previewIds.includes(id)
      );
      const mostRecentId: string = scopedPreviewIds[scopedPreviewIds.length - 1];

      const byId = { ...state.byId };
      delete byId[mostRecentId];

      const previewIds = [...state.previewIds];
      let index = previewIds.indexOf(mostRecentId);
      if (index !== -1) {
        previewIds.splice(index, 1);
      }

      const allIds = [...state.allIds];
      index = allIds.indexOf(mostRecentId);
      if (index !== -1) {
        allIds.splice(index, 1);
      }

      index = scopedIds.indexOf(mostRecentId);
      if (index !== -1) {
        scopedIds.splice(index, 1);
      }

      return {
        byId,
        leftIds: state.leftIds,
        rightIds: state.rightIds,
        previewIds,
        idsByScope: { ...state.idsByScope, [scope]: scopedIds },
        allIds,
      };
    },
    closeSecurityFlyoutPanels: (state, action: PayloadAction<{ scope: string }>) => {
      const { scope } = action.payload;

      if (!state.idsByScope[scope]) {
        return state;
      }

      const scopedIds: string[] = state.idsByScope[scope];

      const byId = { ...state.byId };
      scopedIds.forEach((id: string) => delete byId[id]);

      const idsByScope = { ...state.idsByScope };
      delete idsByScope[scope];

      return {
        byId,
        leftIds: state.leftIds.filter((id: string) => scopedIds.includes(id)),
        rightIds: state.rightIds.filter((id: string) => scopedIds.includes(id)),
        previewIds: state.previewIds.filter((id: string) => scopedIds.includes(id)),
        idsByScope,
        allIds: state.allIds.filter((id: string) => scopedIds.includes(id)),
      };
    },
  },
});

export const {
  openSecurityFlyoutPanels,
  openSecurityFlyoutRightPanel,
  openSecurityFlyoutLeftPanel,
  openSecurityFlyoutPreviewPanel,
  closeSecurityFlyoutRightPanel,
  closeSecurityFlyoutLeftPanel,
  closeSecurityFlyoutPreviewPanel,
  previousSecurityFlyoutPreviewPanel,
  closeSecurityFlyoutPanels,
} = flyoutSlice.actions;

const selectFlyout = (state: State): SecurityFlyoutState => state.flyouts;

export const selectFlyoutLayout = (scope: string) =>
  createSelector(selectFlyout, (flyout: SecurityFlyoutState): SecurityFlyoutLayout => {
    const scopedPanelIds: string[] = flyout.idsByScope[scope];
    if (!scopedPanelIds) {
      return {
        right: {},
        left: {},
        preview: [],
      };
    }

    const leftPanelId: string = scopedPanelIds.find((id: string) =>
      flyout.leftIds.includes(id)
    ) as string;
    const rightPanelId: string = scopedPanelIds.find((id: string) =>
      flyout.rightIds.includes(id)
    ) as string;
    const previewPanelIds: string[] = scopedPanelIds.filter((id: string) =>
      flyout.previewIds.includes(id)
    );

    return {
      left: flyout.byId[leftPanelId],
      right: flyout.byId[rightPanelId],
      preview: previewPanelIds.map((id: string) => flyout.byId[id]),
    };
  });

export const flyoutReducer = flyoutSlice.reducer;
