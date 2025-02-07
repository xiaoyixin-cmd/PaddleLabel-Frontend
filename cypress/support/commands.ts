/// <reference types="cypress" />

import cypress from 'cypress';
import { camel2snake } from './util.ts';

Cypress.Commands.add('spyAllApiCalls', () => {
  cy.intercept('http://localhost:17995/api/**').as('apicalls');
});

Cypress.Commands.add('g', (testId, params = {}) => {
  cy.get(`[data-test-id='${testId}']`, params);
});

Cypress.Commands.add('clearPjs', () => {
  cy.request('GET', 'http://localhost:17995/api/projects').then((res) => {
    console.log('res', res.body);
    for (const pj of res.body) {
      cy.request('DELETE', `http://localhost:17995/api/projects/${pj.project_id}`);
    }
  });
});

Cypress.Commands.add('onPage', (urlPart, allowError: boolean = false) => {
  const url_part = camel2snake(urlPart);
  if (!allowError) cy.get('[data-icon="close-circle"]', { timeout: 500 }).should('not.exist');
  cy.url({ timeout: 15000 }).should('contain', url_part);
  if (!allowError) cy.get('[data-icon="close-circle"]').should('not.exist');
  cy.wait('@apicalls', { timeout: 15000 });
  if (!allowError) cy.get('[data-icon="close-circle"]', { timeout: 500 }).should('not.exist');
  cy.g('global.loading').should('not.exist');
  cy.wait(500);
});

Cypress.Commands.add('printDebugId', (debugId) => {
  cy.request('GET', `http://localhost:17995/api/debug/printid/${debugId}`);
});
