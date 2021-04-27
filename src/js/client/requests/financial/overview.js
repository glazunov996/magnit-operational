/* eslint prefer-destructuring: 'off' */

import { default as config } from 'configs/client.json';
import { default as mainTableBlock1 } from 'configs/requests/financial/overview/mainTableBlock1.json';
import { default as mainTableBlock2 } from 'configs/requests/financial/overview/mainTableBlock2.json';
import { default as formatDeviationsCountBlock1 } from 'configs/requests/financial/overview/formatDeviationsCountBlock1.json';
import { default as formatDeviationsCountBlock2 } from 'configs/requests/financial/overview/formatDeviationsCountBlock2.json';
import { default as regionDeviationsCountBlock1 } from 'configs/requests/financial/overview/regionDeviationsCountBlock1.json';
import { default as regionDeviationsCountBlock2 } from 'configs/requests/financial/overview/regionDeviationsCountBlock2.json';
import { default as regionDeviationsCountAbsoluteBlock1 } from 'configs/requests/financial/overview/regionDeviationsCountAbsoluteBlock1.json';
import { default as regionDeviationsCountAbsoluteBlock2 } from 'configs/requests/financial/overview/regionDeviationsCountAbsoluteBlock2.json';
import { default as chartsMainTable } from 'configs/requests/financial/overview/chartsMainTable.json';
import { qlikRequestDates, qlikRequestDatesUpdate } from './dates';
import { qlikRequestFilterState, qlikRequestFiltersUpdate } from './filter';
import { qlikRequestPrecisions, qlikRequestPrecisionsUpdate } from './precision';
import callApi from 'utilities/callApi'

import * as _ from 'lodash';

function processMainTableBlock(reply) {
  const matrix = reply.qHyperCube.qDataPages[0].qMatrix;
  const DATA = { rows: []};
  for(let i=0; i < matrix.length; i++){
    const row = matrix[i];
    const dataRow = { column: {}, tooltip: {} };
    DATA.rows.push(dataRow);
    dataRow.id = row[0].qNum;
    dataRow.name = row[1].qText;
    dataRow.column.fact = row[2];
    dataRow.column.factPercent = row[3];
    dataRow.column.vsPpPercent = row[4];
    dataRow.column.vsPp = row[5];
    dataRow.column.vsBudgetPercent = row[6];
    dataRow.column.vsBudget = row[7];
    
    dataRow.column.tooltip = {
      factPercent: dataRow.column.factPercent,
      fact: dataRow.column.fact,
      vsBudgetPercent: dataRow.column.vsBudgetPercent,
      vsBudget: dataRow.column.vsBudget,
      budgetPercent: row[8],
      budget: row[9],
      vsFactPpPercent: dataRow.column.vsPpPercent,
      vsFactPp: dataRow.column.vsPp,
      factPpPercent: row[10],
      factPp: row[11],
    }
    dataRow.column.arrow = row[12];
  }
  return DATA;
}

async function requestMainTableBlock1(app) {
  const response = await new Promise(resolve => {
    app.createCube(mainTableBlock1, resolve).then(e => e.close());
  })
  return processMainTableBlock(response);
}

async function requestMainTableBlock2(app) {
  const response = await new Promise(resolve => {
    app.createCube(mainTableBlock2, resolve).then(e => e.close());
  })
  return processMainTableBlock(response);
}

function processDeviationsCountBlock1(reply) {
  const matrix = reply.qHyperCube.qDataPages[0].qMatrix;
  let DATA = { rows: []};
  for(let i=0; i < matrix.length; i++){
    let row = matrix[i];
    let item = {
      id: row[0].qNum,
      countDeviation: +row[1].qNum,
      column: {
        vsPpPercent: row[2],
        budgetPercent: row[3]
      }
    }
    DATA.rows.push(item);
  }
  return DATA
}

function processDeviationsCountBlock2(reply) {
  const matrix = reply.qHyperCube.qDataPages[0].qMatrix;
  let DATA = { rows: []};
  for(let i=0; i < matrix.length; i++){
    let row = matrix[i];
    let item = {
      id: row[0].qNum,
      countDeviation: 0,
      column: {
        vsPpPercent: row[1],
        budgetPercent: row[2]
      }
    }
    DATA.rows.push(item);
  }
  return DATA;
}

async function requestFormatDeviationsCountBlock1(app) {
  const response = await new Promise(resolve => {
    app.createCube(formatDeviationsCountBlock1, resolve).then(e => e.close());
  })
  return processDeviationsCountBlock1(response);
}

async function requestFormatDeviationsCountBlock2(app) {
  const response = await new Promise(resolve => {
    app.createCube(formatDeviationsCountBlock2, resolve).then(e => e.close());
  })
  return processDeviationsCountBlock2(response);
}

async function requestRegionDeviationsCountBlock1(app) {
  const response = await new Promise(resolve => {
    app.createCube(regionDeviationsCountBlock1, resolve).then(e => e.close());
  })
  return processDeviationsCountBlock1(response);
}

async function requestRegionDeviationsCountBlock2(app) {
  const response = await new Promise(resolve => {
    app.createCube(regionDeviationsCountBlock2, resolve).then(e => e.close());
  })
  return processDeviationsCountBlock2(response);
}

async function requestRegionDeviationsCountAbsoluteBlock1(app) {
  const response = await new Promise(resolve => {
    app.createCube(regionDeviationsCountAbsoluteBlock1, resolve).then(e => e.close());
  })
  return processDeviationsCountBlock1(response);
}

async function requestRegionDeviationsCountAbsoluteBlock2(app) {
  const response = await new Promise(resolve => {
    app.createCube(regionDeviationsCountAbsoluteBlock2, resolve).then(e => e.close());
  })
  return processDeviationsCountBlock2(response);
}

export async function qlikRequestFinancialOverviewTableData(app, filters, formats, regions) {  
  const { date, datePoP, datePrecision, actualDatePoP } = filters;
  await callApi(qlikRequestDatesUpdate(app, date, datePoP, datePrecision), "qlikRequestDatesUpdate");
  await app.variable.setStringValue('vAbsFlag', `1`); // % от выр.
  const graphs1 = await requestChartsMainTable(app);
  await app.variable.setStringValue('vAbsFlag', `2`); // млн. руб.
  const graphs2 = await requestChartsMainTable(app);
  await callApi(qlikRequestDatesUpdate(app, date, actualDatePoP, datePrecision), "qlikRequestDatesUpdate");
  const data1 = await requestMainTableBlock1(app);
  const data2 = await requestMainTableBlock2(app);  
  const graphs1Map = graphs1 ? Object.assign({}, ...graphs1.groups.map(item => ({ [item.id] : {...item}}))) : {}
  const graphs2Map = graphs2 ? Object.assign({}, ...graphs2.groups.map(item => ({ [item.id] : {...item}}))) : {} 
  const [unit1Format1Map, unit1Format2Map, unit2Format1Map, unit2Format2Map] = formats || [{}, {}, {}, {}];
  const [unit1Region1Map, unit1Region2Map, unit2Region1Map, unit2Region2Map] = regions || [{}, {}, {}, {}];
  const newData = data1.rows.map((item, index) => {
    return {
      id: item.id,
      name: item.name,
      column1: item.column,
      column2: data2.rows[index].column,
      graphs1: graphs1Map[item.id],
      graphs2: graphs2Map[item.id],        
      formatDeviations: [
        {
          id: item.id,
          name: item.name,
          column1: unit1Format1Map[item.id] ? unit1Format1Map[item.id].column : [],
          column2: unit1Format2Map[item.id] ? unit1Format2Map[item.id].column : [],
          countDeviation: unit1Format1Map[item.id] ? unit1Format1Map[item.id].countDeviation : 0
        },
        {
          id: item.id,
          name: item.name,
          column1: unit2Format1Map[item.id] ? unit2Format1Map[item.id].column : [],
          column2: unit2Format2Map[item.id] ? unit2Format2Map[item.id].column : [],
          countDeviation: unit2Format1Map[item.id] ? unit2Format1Map[item.id].countDeviation : 0
        }
      ],
      regionDeviations: [
        {
          id: item.id,
          name: item.name,
          column1: unit1Region1Map[item.id] ? unit1Region1Map[item.id].column : [],
          column2: unit1Region2Map[item.id] ? unit1Region2Map[item.id].column : [],
          countDeviation: unit1Region1Map[item.id] ? unit1Region1Map[item.id].countDeviation : 0
        },
        {
          id: item.id,
          name: item.name,
          column1: unit2Region1Map[item.id] ? unit2Region1Map[item.id].column : [],
          column2: unit2Region2Map[item.id] ? unit2Region2Map[item.id].column : [],
          countDeviation: unit2Region1Map[item.id] ? unit2Region1Map[item.id].countDeviation : 0
        }
      ],
    }
  })
  return newData; 
}

function parseRowsForFinancialTableCharts(headers, rows, seriesSettings ){
  let DATA = { groups: [], labels: []};
  let currGroup;

  let lastGroupName = '';
  let lastLabel = "";

  for(let i=0; i < rows.length; i++){
      //if(rows[i][1].qText != lastGroupName){
    let id = rows[i][0].qText;
    lastGroupName = id;//rows[i][1].qText;

    currGroup = DATA.groups.find( function(g){ return g.name == lastGroupName})
    if(!currGroup){
      currGroup = { id: id, name : lastGroupName, series: [] };
      DATA.groups.push(currGroup);
    }
      
    let seria;
    for(let j=2; j < rows[i].length; j++){
        //поиск units среди столбцов данных
      if(j > 2 && seriesSettings[j-3].type == 'units'){
        currGroup.units = currGroup.units || { axisYLeft: rows[i][j].qText};
        continue;
      }
      seria = currGroup.series.find(function(s){ return s.name == headers[j]});
      if(!seria && rows[i][j].qState == "L"){ //не измерение
        seria = { name: headers[j], data: [] };
        currGroup.series.push(seria);
      }
      if(rows[i][j].qState != "L"){
        //console.info('is dimenstion', rows[i][j].qText, "j", j)
        if(DATA.labels.indexOf(rows[i][1].qText) == -1){
          DATA.labels.push(rows[i][1].qText); //
        }
        lastLabel = rows[i][1].qText;

      } else if(rows[i][j].qState == "L"){ //мера
        //console.info('j', j)
        //приведение к числу
        seria.data.push({
          name: lastLabel,
          data: +rows[i][j].qNum,
          text: rows[i][j].qText
        });
      }
    }      
  }
  return DATA;
}

export function processChartsMainTable(reply) {
  let coppyedHeaders = [];
  reply.qHyperCube.qDimensionInfo.forEach( (dim) =>  coppyedHeaders.push(dim.qFallbackTitle) )
  reply.qHyperCube.qMeasureInfo.forEach(( measureName)=> coppyedHeaders.push(measureName.qFallbackTitle));

  let coppyedRows = _.cloneDeep(reply.qHyperCube.qDataPages[0].qMatrix);

  let seriesSettings = [
    { type: 'line', color: '#34d800', axisY: 'left'},
    { type: 'none', color: '#ffd700', axisY: 'left'},
    { type: 'none', color: '#ff2300', axisY: 'left'},
    { type: 'none', color: '#f0d700', axisY: 'left'},
    { type: 'none', color: '#1536ad', axisY: 'left'},
    { type: 'bar', color: '#8f06f9', axisY: 'rightDown'},
    { type: 'bar', color: '#8506a9', axisY: 'rightDown'},
    { type: 'units'}
  ];
  const DATA = parseRowsForFinancialTableCharts(coppyedHeaders, coppyedRows, seriesSettings);	
  return DATA;
}

async function requestChartsMainTable(app) {
  const response = await new Promise(resolve => {
    app.createCube(chartsMainTable, resolve).then(e => e.close());
  })
  return processChartsMainTable(response);
}

async function qlikRequestFormatAndRegionDeviations(app) {
  const unit2Region1 = await callApi(requestRegionDeviationsCountAbsoluteBlock1(app), "2 requestRegionDeviationsCountAbsoluteBlock1");
  const unit2Region2 = await callApi(requestRegionDeviationsCountAbsoluteBlock2(app), "2 requestRegionDeviationsCountAbsoluteBlock2");
  await app.variable.setStringValue('vAbsFlag', `1`); // % от выр.
  const unit1Format1 = await callApi(requestFormatDeviationsCountBlock1(app), "1 requestFormatDeviationsCountBlock1");
  const unit1Format2 = await callApi(requestFormatDeviationsCountBlock2(app), "1 requestFormatDeviationsCountBlock2");
  const unit1Region1 = await callApi(requestRegionDeviationsCountBlock1(app), "1 requestRegionDeviationsCountBlock1");
  const unit1Region2 = await callApi(requestRegionDeviationsCountBlock2(app), "1 requestRegionDeviationsCountBlock2");
  await app.variable.setStringValue('vAbsFlag', `2`); // % от выр.
  const unit2Format1 = await callApi(requestFormatDeviationsCountBlock1(app), "2 requestFormatDeviationsCountBlock1");
  const unit2Format2 = await callApi(requestFormatDeviationsCountBlock2(app), "2 requestFormatDeviationsCountBlock2");  

  const unit1Format1Map = Object.assign({}, ...unit1Format1.rows.map(item => ({ [item.id] : {...item}})))
  const unit1Format2Map = Object.assign({}, ...unit1Format2.rows.map(item => ({ [item.id] : {...item}})))
  const unit1Region1Map = Object.assign({}, ...unit1Region1.rows.map(item => ({ [item.id] : {...item}})))
  const unit1Region2Map = Object.assign({}, ...unit1Region2.rows.map(item => ({ [item.id] : {...item}})))
  const unit2Format1Map = Object.assign({}, ...unit2Format1.rows.map(item => ({ [item.id] : {...item}})))
  const unit2Format2Map = Object.assign({}, ...unit2Format2.rows.map(item => ({ [item.id] : {...item}})))
  const unit2Region1Map = Object.assign({}, ...unit2Region1.rows.map(item => ({ [item.id] : {...item}})))
  const unit2Region2Map = Object.assign({}, ...unit2Region2.rows.map(item => ({ [item.id] : {...item}})))

  return {
    formats: [
      unit1Format1Map,
      unit1Format2Map,
      unit2Format1Map,
      unit2Format2Map
    ],
    regions: [
      unit1Region1Map,
      unit1Region2Map,
      unit2Region1Map,
      unit2Region2Map
    ]
  } 
}

function zipFinancialOverview(data, filter, precision, dates) {
  const overviewData = {
    dates,
    filter,
    precision,
    data,
  };
  return overviewData;
}

async function qlikUpdateFilters(app, { conditions, date, datePoP, datePrecision, columnPrecision, units, dynamics, actualDatePoP }) {
  await qlikRequestDatesUpdate(app, date, actualDatePoP, datePrecision);
  await qlikRequestFiltersUpdate(app, conditions);
  await qlikRequestPrecisionsUpdate(app, [columnPrecision, dynamics, units]);
  return Promise.resolve();
}

export async function qlikRequestFinancialOverviewData(app, filters) {  
  console.log("OVERVIEW STARTED")
  const dates = await callApi(qlikRequestDates(app), "qlikRequestDates");
  const filter = await callApi(qlikRequestFilterState(app), "qlikRequestFilterState");
  const precision = await callApi(qlikRequestPrecisions(app), "qlikRequestPrecisions");
  let data = []
  if (filters && !filters.initial && !filters.noUpdate) {
    const { formats, regions } = await callApi(qlikRequestFormatAndRegionDeviations(app), "qlikRequestFormatAndRegionDeviations")
    data = await callApi(qlikRequestFinancialOverviewTableData(app, filters, formats, regions), "qlikRequestFinancialOverviewTableData")
  }
  const overview = zipFinancialOverview(data, filter, precision, dates);
  console.log("OVERVIEW FINISHED", overview)
  return overview;
}

function qlikResetIndicators(app) {
  return app.field(config.indicators).clear();
}

export async function qlikRequestFinancialOverview(app, filters) {
  await callApi(qlikResetIndicators(app), "qlikResetIndicators");
  if (filters && !filters.initial && !filters.noUpdate) await callApi(qlikUpdateFilters(app, filters), "qlikUpdateFilters");
  const overview = await qlikRequestFinancialOverviewData(app, filters);
  return overview;
}
