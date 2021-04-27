import { default as config } from 'configs/client.json';
import { default as financialIndicators } from 'configs/dashboards/financial/indicators.json';
import { default as factorsDataBlock1 } from 'configs/requests/financial/factors/factorsDataBlock1.json';
import { default as factorsDataBlock2 } from 'configs/requests/financial/factors/factorsDataBlock2.json';
import { default as factorsResultsBlock1 } from 'configs/requests/financial/factors/factorsResultsBlock1.json';
import { default as factorsResultsBlock2 } from 'configs/requests/financial/factors/factorsResultsBlock2.json';
import { qlikRequestDates, qlikRequestDatesUpdate } from './dates';
import { qlikRequestFilterState, qlikRequestFiltersUpdate } from './filter';
import { qlikRequestPrecisions, qlikRequestPrecisionsUpdate } from './precision';
import callApi from 'utilities/callApi'

const INDICATORS = financialIndicators.reduce((result, group) => [...result, ...group.indicators], []);

function findIndicator(indicator) {
  return INDICATORS.find(option => option.url === indicator);
}

function processFactorsResultsBlock(reply) {
  const matrix = reply.qHyperCube.qDataPages[0].qMatrix;
  const DATA = { items: []};
  for(let i=0; i < matrix.length; i++){
      const row = matrix[i];
      const item = {
          id: row[0].qNum,
          name: row[1].qText,
          column: {
              factPrevYearPrecent: row[1],
              budgetPercent: row[2],
              factCurrYearPercent: row[3],
              bridgeResultBudgetPercent: row[4],
              bridgeResultPrevYearPercent: row[5]
          }
      }
      DATA.items.push(item);
  }
  return DATA
}

function processFactorsDataBlock(reply) {
  const matrix = reply.qHyperCube.qDataPages[0].qMatrix;
  const DATA = { items: []};
  for (let i=0; i < matrix.length; i++){
    let row = matrix[i];
    let item = {
      id: row[0].qText,
      name: row[1].qText,
      column: {
        vsBudgetPercent: row[3],
        vsFactPercent: row[2],
      }
    }
    DATA.items.push(item);
  }
  return DATA;
}

async function requestFactorsResultsBlock1(app) {
  const response = await new Promise(resolve => {
    app.createCube(factorsResultsBlock1, resolve).then(e => e.close());
  })
  return processFactorsResultsBlock(response)
}

async function requestFactorsResultsBlock2(app) {
  const response = await new Promise(resolve => {
    app.createCube(factorsResultsBlock2, resolve).then(e => e.close());
  })
  return processFactorsResultsBlock(response)
}

async function requestFactorsDataBlock1(app) {
  const response = await new Promise(resolve => {
    app.createCube(factorsDataBlock1, resolve).then(e => e.close());
  })
  return processFactorsDataBlock(response)
}

async function requestFactorsDataBlock2(app) {
  const response = await new Promise(resolve => {
    app.createCube(factorsDataBlock2, resolve).then(e => e.close());
  })
  return processFactorsDataBlock(response)
}

async function qlikRequestResultsAndBridges(app) {
  await app.variable.setStringValue('vAbsFlag', `1`); // % от выр.
  const unit1ResultsBlock1 = await requestFactorsResultsBlock1(app);
  const unit1ResultsBlock2 = await requestFactorsResultsBlock2(app);
  const unit1DataBlock1 = await requestFactorsDataBlock1(app);
  const unit1DataBlock2 = await requestFactorsDataBlock2(app);
  await app.variable.setStringValue('vAbsFlag', `2`); // % от выр.
  const unit2ResultsBlock1 = await requestFactorsResultsBlock1(app);
  const unit2ResultsBlock2 = await requestFactorsResultsBlock2(app);
  const unit2DataBlock1 = await requestFactorsDataBlock1(app);
  const unit2DataBlock2 = await requestFactorsDataBlock2(app);
  const results = unit1ResultsBlock1.items.map((item, index) => {
    return {
      id: item.id,
      name: item.name,
      column1: [ item.column, unit2ResultsBlock1.items[index].column ],
      column2: [ unit1ResultsBlock2.items[index].column, unit2ResultsBlock2.items[index].column ]
    }
  })
  const bridges = unit1DataBlock1.items.map((item, index) => {
    return {
      id: item.id,
      name: item.name,
      column1: [ item.column, unit2DataBlock1.items[index].column ],
      column2: [ unit1DataBlock2.items[index].column, unit2DataBlock2.items[index].column ]
    }
  })
  return { results, bridges };
}

function zipFinancialFactors(results, bridges, filter, precision, dates, id) {
  return {
    dates,
    filter,
    precision,
    data: {
      results: results,
      bridges: bridges,
    },
  };
}

async function qlikUpdateFilters(app, { conditions, date, datePoP, datePrecision, columnPrecision, units, dynamics }) {
  await qlikRequestDatesUpdate(app, date, datePoP, datePrecision);
  await qlikRequestFiltersUpdate(app, conditions);
  await qlikRequestPrecisionsUpdate(app, [columnPrecision, dynamics, units]);
  return Promise.resolve();
}

export async function qlikRequestFinancialFactorsData(app, id) {
  const dates = await callApi(qlikRequestDates(app), "qlikRequestDates");
  const filter = await callApi(qlikRequestFilterState(app), "qlikRequestFilterState");
  const precision = await callApi(qlikRequestPrecisions(app), "qlikRequestPrecisions");
  const { results, bridges } = await callApi(qlikRequestResultsAndBridges(app), "qlikRequestResultsAndBridges");
  const factors = zipFinancialFactors(results, bridges, filter, precision, dates, id);
  return factors;
}

function qlikSelectIndicator(app, value) {
  return app.field(config.indicators).clear().then(() => app.field(config.indicators).selectValues([value], true, true));
}

export async function qlikRequestFinancialFactors(app, indicator, filters) {
  const foundIndicator = findIndicator(indicator);
  const { label, id } = foundIndicator;
  console.log("FACTORS STARTED", label, id, foundIndicator)
  if (filters && !filters.fetch) await callApi(qlikSelectIndicator(app, label), "qlikSelectIndicator");
  if (filters && !filters.initial && !filters.noUpdate) await callApi(qlikUpdateFilters(app, filters), "qlikUpdateFilters");
  const factors = await qlikRequestFinancialFactorsData(app, id);
  console.log("FACTORS FINISHED")
  return factors;
}
