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
  leftId: string;
  rightId: string;
  previewIds: string[];
  allIds: string[];
}

export const initialFlyoutState: SecurityFlyoutState = {
  byId: {},
  leftId: '',
  rightId: '',
  previewIds: [],
  allIds: [],
};

export const flyoutsSlice = createSlice({
  name: 'flyouts',
  initialState: initialFlyoutState,
  reducers: {
    openSecurityFlyoutPanels: (
      state,
      {
        payload: { left, preview, right },
      }: PayloadAction<{
        right?: SecurityFlyoutPanel;
        left?: SecurityFlyoutPanel;
        preview?: SecurityFlyoutPanel;
      }>
    ) => {
      const byId: { [panelId: string]: SecurityFlyoutPanel } = {};
      const allIds: string[] = [];

      if (right) {
        byId[right.key] = right;
        allIds.push(right.key);
      }
      if (left) {
        byId[left.key] = left;
        allIds.push(left.key);
      }
      if (preview) {
        byId[preview.key] = preview;
        allIds.push(preview.key);
      }

      return {
        byId,
        leftId: left?.key || '',
        rightId: right?.key || '',
        previewIds: preview ? [preview.key] : [],
        allIds,
      };
    },
    openSecurityFlyoutRightPanel: (state, action: PayloadAction<SecurityFlyoutPanel>) => ({
      byId: {
        ...state.byId,
        [action.payload.key]: action.payload,
      },
      leftId: state.leftId,
      rightId: action.payload.key,
      previewIds: state.previewIds,
      allIds: [...state.allIds, action.payload.key],
    }),
    openSecurityFlyoutLeftPanel: (state, action: PayloadAction<SecurityFlyoutPanel>) => ({
      byId: {
        ...state.byId,
        [action.payload.key]: action.payload,
      },
      leftId: action.payload.key,
      rightId: state.rightId,
      previewIds: state.previewIds,
      allIds: [...state.allIds, action.payload.key],
    }),
    openSecurityFlyoutPreviewPanel: (state, action: PayloadAction<SecurityFlyoutPanel>) => ({
      byId: {
        ...state.byId,
        [action.payload.key]: action.payload,
      },
      leftId: state.leftId,
      rightId: state.rightId,
      previewIds: [...state.previewIds, action.payload.key],
      allIds: [...state.allIds, action.payload.key],
    }),
    closeSecurityFlyoutRightPanel: (state) => {
      const byId = { ...state.byId };
      delete byId[state.rightId];

      return {
        byId,
        leftId: state.leftId,
        rightId: '',
        previewIds: state.previewIds,
        allIds: state.allIds.filter((id: string) => id !== state.rightId),
      };
    },
    closeSecurityFlyoutLeftPanel: (state) => {
      const byId = { ...state.byId };
      delete byId[state.leftId];

      return {
        byId,
        leftId: '',
        rightId: state.rightId,
        previewIds: state.previewIds,
        allIds: state.allIds.filter((id: string) => id !== state.leftId),
      };
    },
    closeSecurityFlyoutPreviewPanel: (state) => {
      const byId = { ...state.byId };
      state.previewIds.forEach((id: string) => delete byId[id]);

      return {
        byId,
        leftId: state.leftId,
        rightId: state.rightId,
        previewIds: [],
        allIds: state.allIds.filter((id: string) => state.previewIds.includes(id)),
      };
    },
    previousSecurityFlyoutPreviewPanel: (state) => {
      const lastPreviewPanelId = state.previewIds[state.previewIds.length - 1];
      const byId = { ...state.byId };
      delete byId[lastPreviewPanelId];

      return {
        byId,
        leftId: state.leftId,
        rightId: state.rightId,
        previewIds: state.previewIds.slice(-1),
        allIds: state.allIds.filter((id: string) => id !== lastPreviewPanelId),
      };
    },
    closeSecurityFlyoutPanels: () => ({
      byId: {},
      leftId: '',
      rightId: '',
      previewIds: [],
      allIds: [],
    }),
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
} = flyoutsSlice.actions;

const selectFlyouts = (state: State): SecurityFlyoutState => state.flyouts;

export const selectFlyoutLayout = createSelector(
  selectFlyouts,
  (flyouts: SecurityFlyoutState): SecurityFlyoutLayout => ({
    left: flyouts.byId[flyouts.leftId],
    right: flyouts.byId[flyouts.rightId],
    preview: flyouts.previewIds.map((id: string) => flyouts.byId[id]),
  })
);

export const flyoutsReducer = flyoutsSlice.reducer;
