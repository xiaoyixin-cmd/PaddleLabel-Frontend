/// <reference types="cypress" />
import { detailIt } from '../support/detail';
import { overviewIt } from '../support/overview';
import { config } from '../support/config';
import { sampleIt } from '../support/sample';
import { runTasks } from '../support/util';

describe('Test Project Overview Page Functions on 8 Sample Datasets', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.spyAllApiCalls();
  });

  var pjId = 2;
  var catgInfo = { ...config.catgInfo };

  const tasks = [
    {
      name: 'Clear Projects',
      func: () => {
        cy.clearPjs();
      },
    },
    sampleIt.import('placeholder'),
    // create 8 pjs
    ...Object.keys(catgInfo).map(function* (catg) {
      for (const labelFormat of Object.keys(catgInfo[catg])) {
        yield detailIt.import(catg, labelFormat);
        catgInfo[catg][labelFormat] = pjId;
        pjId += 1;
      }
    }),

    ...Object.keys(catgInfo).map(function* (catg) {
      for (const labelFormat of Object.keys(catgInfo[catg])) {
        const currPjId = catgInfo[catg][labelFormat];
        yield overviewIt.split50(currPjId);
        yield overviewIt.split100(currPjId);
        yield overviewIt.export(currPjId, `${config.sampleBaseDir}/export/dummy`);
      }
    }),
  ];

  runTasks(tasks);
});
