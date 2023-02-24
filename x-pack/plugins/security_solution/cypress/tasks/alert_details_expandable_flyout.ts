/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import {
  ALERT_DETAILS_FLYOUT_COLLAPSE_DETAILS_BUTTON,
  ALERT_DETAILS_FLYOUT_EXPAND_DETAILS_BUTTON,
  ALERT_DETAILS_FLYOUT_HISTORY_TAB,
  ALERT_DETAILS_FLYOUT_INSIGHTS_TAB,
  ALERT_DETAILS_FLYOUT_INVESTIGATIONS_TAB,
  ALERT_DETAILS_FLYOUT_JSON_TAB,
  ALERT_DETAILS_FLYOUT_OVERVIEW_TAB,
  ALERT_DETAILS_FLYOUT_TABLE_TAB,
  ALERT_DETAILS_FLYOUT_VISUALIZE_TAB,
  ALERT_DETAILS_FLYOUT_VISUALIZE_TAB_GRAPH_ANALYSER_BUTTON,
  ALERT_DETAILS_FLYOUT_VISUALIZE_TAB_SESSION_VIEW_BUTTON,
} from '../screens/alert_details_expandable_flyout';
import { EXPAND_ALERT_BTN } from '../screens/alerts';

/**
 * Find the first alert row in the alerts table then click on the expand icon button to open the flyout
 */
export const expandFirstAlertExpandableFlyout = () => {
  cy.get(EXPAND_ALERT_BTN).first().click();
};

/**
 * Expand the left section of the alert details expandable flyout by clicking on the Find the first alert row in the alerts table then click on the expand icon button to open the flyout
 */
export const expandAlertDetailsExpandableFlyoutLeftSection = () =>
  cy.get(ALERT_DETAILS_FLYOUT_EXPAND_DETAILS_BUTTON).click();

/**
 * Expand the left section of the alert details expandable flyout by clicking on the Find the first alert row in the alerts table then click on the expand icon button to open the flyout
 */
export const collapseAlertDetailsExpandableFlyoutLeftSection = () =>
  cy.get(ALERT_DETAILS_FLYOUT_COLLAPSE_DETAILS_BUTTON).click();

/**
 * Open the Overview tab in the alert details expandable flyout right section
 */
export const openOverviewTab = () => cy.get(ALERT_DETAILS_FLYOUT_OVERVIEW_TAB).click();

/**
 * Open the Table tab in the alert details expandable flyout right section
 */
export const openTableTab = () => cy.get(ALERT_DETAILS_FLYOUT_TABLE_TAB).click();

/**
 * Open the Json tab in the alert details expandable flyout right section
 */
export const openJsonTab = () => cy.get(ALERT_DETAILS_FLYOUT_JSON_TAB).click();

/**
 * Open the Visualize tab in the alert details expandable flyout left section
 */
export const openVisualizeTab = () => cy.get(ALERT_DETAILS_FLYOUT_VISUALIZE_TAB).click();

/**
 * Open the Session View under the Visualize tab in the alert details expandable flyout left section
 */
export const openSessionView = () =>
  cy.get(ALERT_DETAILS_FLYOUT_VISUALIZE_TAB_SESSION_VIEW_BUTTON).click();

/**
 * Open the Graph Analyser under the Visuablize tab in the alert details expandable flyout left section
 */
export const openGraphAnalyser = () =>
  cy.get(ALERT_DETAILS_FLYOUT_VISUALIZE_TAB_GRAPH_ANALYSER_BUTTON).click();

/**
 * Open the Insights tab in the alert details expandable flyout left section
 */
export const openInsightsTab = () => cy.get(ALERT_DETAILS_FLYOUT_INSIGHTS_TAB).click();

/**
 * Open the Investigations tab in the alert details expandable flyout left section
 */
export const openInvestigationsTab = () => cy.get(ALERT_DETAILS_FLYOUT_INVESTIGATIONS_TAB).click();

/**
 * Open the History tab in the alert details expandable flyout left section
 */
export const openHistoryTab = () => cy.get(ALERT_DETAILS_FLYOUT_HISTORY_TAB).click();
