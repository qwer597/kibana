/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import {
  ALERT_DETAILS_FLYOUT_HISTORY_TAB,
  ALERT_DETAILS_FLYOUT_INSIGHTS_TAB,
  ALERT_DETAILS_FLYOUT_INSIGHTS_TAB_CONTENT,
  ALERT_DETAILS_FLYOUT_INVESTIGATIONS_TAB_CONTENT,
  ALERT_DETAILS_FLYOUT_INVESTIGATIONS_TAB,
  ALERT_DETAILS_FLYOUT_VISUALIZE_TAB,
  ALERT_DETAILS_FLYOUT_VISUALIZE_TAB_BUTTON_GROUP,
  ALERT_DETAILS_FLYOUT_HISTORY_TAB_CONTENT,
  ALERT_DETAILS_FLYOUT_VISUALIZE_TAB_SESSION_VIEW_BUTTON,
  ALERT_DETAILS_FLYOUT_VISUALIZE_TAB_GRAPH_ANALYSER_BUTTON,
  ALERT_DETAILS_FLYOUT_VISUALIZE_TAB_SESSION_VIEW_CONTENT,
  ALERT_DETAILS_FLYOUT_VISUALIZE_TAB_GRAPH_ANALYSER_CONTENT,
} from '../../../screens/alert_details_expandable_flyout';
import {
  expandAlertDetailsExpandableFlyoutLeftSection,
  expandFirstAlertExpandableFlyout,
  openGraphAnalyser,
  openHistoryTab,
  openInsightsTab,
  openInvestigationsTab,
  openSessionView,
  openVisualizeTab,
} from '../../../tasks/alert_details_expandable_flyout';
import { cleanKibana } from '../../../tasks/common';
import { login, visit } from '../../../tasks/login';
import { createCustomRuleEnabled } from '../../../tasks/api_calls/rules';
import { getNewRule } from '../../../objects/rule';
import { ALERTS_URL } from '../../../urls/navigation';
import { waitForAlertsToPopulate } from '../../../tasks/create_new_rule';

// Skipping these for now as the feature is protected behind a feature flag set to false by default
// To run the tests locally, add 'securityFlyoutEnabled' in the Cypress config.ts here https://github.com/elastic/kibana/blob/main/x-pack/test/security_solution_cypress/config.ts#L50
describe.skip('Alert details expandable flyout left panel', { testIsolation: false }, () => {
  before(() => {
    cleanKibana();
    login();
    createCustomRuleEnabled(getNewRule());
    visit(ALERTS_URL);
    waitForAlertsToPopulate();
    expandFirstAlertExpandableFlyout();
    expandAlertDetailsExpandableFlyoutLeftSection();
  });

  it('should display 4 tabs in the header', () => {
    cy.get(ALERT_DETAILS_FLYOUT_VISUALIZE_TAB).should('be.visible').and('have.text', 'Visualize');
    cy.get(ALERT_DETAILS_FLYOUT_INSIGHTS_TAB).should('be.visible').and('have.text', 'Insights');
    cy.get(ALERT_DETAILS_FLYOUT_INVESTIGATIONS_TAB)
      .should('be.visible')
      .and('have.text', 'Investigation');
    cy.get(ALERT_DETAILS_FLYOUT_HISTORY_TAB).should('be.visible').and('have.text', 'History');
  });

  it('should display tab content when switching tabs', () => {
    openVisualizeTab();
    cy.get(ALERT_DETAILS_FLYOUT_VISUALIZE_TAB_BUTTON_GROUP).should('be.visible');

    openInsightsTab();
    cy.get(ALERT_DETAILS_FLYOUT_INSIGHTS_TAB_CONTENT).should('be.visible');

    openInvestigationsTab();
    cy.get(ALERT_DETAILS_FLYOUT_INVESTIGATIONS_TAB_CONTENT).should('be.visible');

    openHistoryTab();
    cy.get(ALERT_DETAILS_FLYOUT_HISTORY_TAB_CONTENT).should('be.visible');
  });

  it('should display a button group with 2 button in the visualize tab', () => {
    openVisualizeTab();
    cy.get(ALERT_DETAILS_FLYOUT_VISUALIZE_TAB_SESSION_VIEW_BUTTON)
      .should('be.visible')
      .and('have.text', 'Session View');
    cy.get(ALERT_DETAILS_FLYOUT_VISUALIZE_TAB_GRAPH_ANALYSER_BUTTON)
      .should('be.visible')
      .and('have.text', 'Analyzer Graph');
  });

  it('should display content when switching buttons', () => {
    openVisualizeTab();
    openSessionView();
    cy.get(ALERT_DETAILS_FLYOUT_VISUALIZE_TAB_SESSION_VIEW_CONTENT)
      .should('be.visible')
      .and('have.text', 'Session view');

    openGraphAnalyser();
    cy.get(ALERT_DETAILS_FLYOUT_VISUALIZE_TAB_GRAPH_ANALYSER_CONTENT)
      .should('be.visible')
      .and('have.text', 'Analyzer graph');
  });
});
