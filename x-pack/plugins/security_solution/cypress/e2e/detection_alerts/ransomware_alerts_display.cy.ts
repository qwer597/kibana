/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { setStartDate } from '../../tasks/date_picker';
import { waitForAlertsToPopulate } from '../../tasks/create_new_rule';
import { login, visit, visitWithoutDateRange } from '../../tasks/login';

import { ALERTS_URL, TIMELINES_URL } from '../../urls/navigation';
import { ALERT_DATA_GRID, SELECT_HISTOGRAM, TREND_CHART_LEGEND } from '../../screens/alerts';
import { esArchiverLoad, esArchiverUnload } from '../../tasks/es_archiver';
import { TIMELINE_QUERY } from '../../screens/timeline';

describe('Ransomware alerts display', () => {
  before(() => {
    login();
    esArchiverLoad('ransomware');
  });

  after(() => {
    esArchiverUnload('ransomware');
  });

  describe('Ransomware display in Alerts Section', () => {
    beforeEach(() => {
      visitWithoutDateRange(ALERTS_URL);
      const dateContainingAllEvents = 'Jul 27, 2015 @ 00:00:00.000';
      setStartDate(dateContainingAllEvents);
      waitForAlertsToPopulate();
    });

    describe('Alerts table', () => {
      it('shows Ransomware Alerts', () => {
        cy.get(ALERT_DATA_GRID)
          .invoke('text')
          .then((text) => {
            expect(text).contains('Ransomware Prevention Alert');
          });

        cy.get(ALERT_DATA_GRID)
          .invoke('text')
          .then((text) => {
            expect(text).contains('Ransomware Detection Alert');
          });
      });
    });

    describe('Trend Chart', () => {
      beforeEach(() => {
        cy.get(SELECT_HISTOGRAM).click();
      });

      it('shows Ransomware Detection Alert in the trend chart', () => {
        cy.get(TREND_CHART_LEGEND)
          .invoke('text')
          .then((text) => {
            expect(text).contains('Ransomware Detection Alert');
          });
      });

      it('shows Ransomware Prevention Alert in the trend chart', () => {
        cy.get(TREND_CHART_LEGEND)
          .invoke('text')
          .then((text) => {
            expect(text).contains('Ransomware Prevention Alert');
          });
      });
    });
  });

  describe('Ransomware in Timelines', () => {
    before(() => {
      visit(TIMELINES_URL);

      cy.get('[data-test-subj="timeline-new-with-border"]').click();
    });

    it('Renders ransomware entries in timelines table', () => {
      cy.get(TIMELINE_QUERY).type('event.code: "ransomware"{enter}');

      // Wait for grid to load, it should have an analyzer icon
      cy.get('[data-test-subj="view-in-analyzer"]');

      cy.get('[data-test-subj="timeline-body"]')
        .invoke('text')
        .then((text) => {
          expect(text).contains('Ransomware');
        });
    });
  });
});
