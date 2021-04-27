import { default as config } from 'configs/client.json';
import { default as financialIndicators } from 'configs/dashboards/financial/indicators.json';
import { default as formatSlicesBlock1 } from 'configs/requests/financial/slices/formatSlicesBlock1.json';
import { default as formatSlicesBlock2 } from 'configs/requests/financial/slices/formatSlicesBlock2.json';
import { default as regionSlicesBlock1 } from 'configs/requests/financial/slices/regionSlicesBlock1.json';
import { default as regionSlicesBlock2 } from 'configs/requests/financial/slices/regionSlicesBlock2.json';
import { default as chartRegionSlices } from 'configs/requests/financial/slices/chartRegionSlices.json';
import { default as chartFormatSlices } from 'configs/requests/financial/slices/chartFormatSlices.json';
import { qlikRequestFinancialOverviewTableData} from './overview';
import { qlikRequestDates, qlikRequestDatesUpdate } from './dates';
import { qlikRequestFilterState, qlikRequestFiltersUpdate } from './filter';
import { qlikRequestPrecisions, qlikRequestPrecisionsUpdate } from './precision';
import callApi from 'utilities/callApi'
import * as _ from 'lodash';

const INDICATORS = financialIndicators.reduce((result, group) => [...result, ...group.indicators], []);

function findIndicator(indicator) {
  return INDICATORS.find(option => option.url === indicator);
}

function processSlicesBlock(reply) {
  const matrix = reply.qHyperCube.qDataPages[0].qMatrix;
  const DATA = { rows: []};
  for(let i=0; i < matrix.length; i++){
    let row = matrix[i];
    let item = {
      name: row[0].qText,
      column:{
        factPercent: row[1],
        vsPpPercent: row[2],
        vsBudgetPercent: row[3],
        arrow: row[4],
      },
    }
    DATA.rows.push(item);
  }
  return DATA
}

function parseRowsDeviationDetailForCharts(headers, rows, seriesSettings){
  let DATA = { groups: [], labels: []};
  let currGroup;
  let lastGroupName = '';
  let lastLabel = "";
  
  for(let i=0; i < rows.length; i++){
    if(rows[i][0].qText != lastGroupName){
      lastGroupName = rows[i][0].qText;
      currGroup = { name : lastGroupName, series: [] };
      DATA.groups.push(currGroup);
    }
    //пропускаем второй столбец, 
    let seria;
    for(let j=2; j < rows[i].length; j++){
      seria = currGroup.series.find(function(s){ return s.name == headers[j]});
      if(!seria && rows[i][j].qState == "L"){ //не измерение
        seria = { name: headers[j], data: [] };
        currGroup.series.push(seria);
      }
      
      if(rows[i][j].qState != "L"){
        if(DATA.labels.indexOf(rows[i][1].qText) == -1){
          DATA.labels.push(rows[i][1].qText);
        }
        lastLabel = rows[i][1].qText;

      }else if(rows[i][j].qState == "L"){ //мера
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

function processChartsSlices(reply) {
  let coppyedHeaders = [];
  reply.qHyperCube.qDimensionInfo.forEach( (dim) =>  coppyedHeaders.push(dim.qFallbackTitle) )
  reply.qHyperCube.qMeasureInfo.forEach((measureName)=> coppyedHeaders.push(measureName.qFallbackTitle));

  let coppyedRows = _.cloneDeep(reply.qHyperCube.qDataPages[0].qMatrix);

  let seriesSettings = [
      { type: 'bar', color: '#1536ad', axisY: 'left'},
      { type: 'bar', color: '#48369d', axisY: 'left'}
  ];
  let DATA = parseRowsDeviationDetailForCharts(coppyedHeaders, coppyedRows, seriesSettings);
  return DATA
}

async function requestFormatSlicesBlock1(app) {
  const response = await new Promise(resolve => {
    app.createCube(formatSlicesBlock1, resolve).then(e => e.close());
  })
  return processSlicesBlock(response)
}

async function requestFormatSlicesBlock2(app) {
  const response = await new Promise(resolve => {
    app.createCube(formatSlicesBlock2, resolve).then(e => e.close());
  })
  return processSlicesBlock(response)
}

async function requestRegionSlicesBlock1(app) {
  const response = await new Promise(resolve => {
    app.createCube(regionSlicesBlock1, resolve).then(e => e.close());
  })
  return processSlicesBlock(response)
}

async function requestRegionSlicesBlock2(app) {
  const response = await new Promise(resolve => {
    app.createCube(regionSlicesBlock2, resolve).then(e => e.close());
  })
  return processSlicesBlock(response)
}

async function requestChartRegionSlices(app) {
  const response = await new Promise(resolve => {
    app.createCube(chartRegionSlices, resolve).then(e => e.close());
  })
  return processChartsSlices(response)
}

async function requestChartFormatSlices(app) {
  const response = await new Promise(resolve => {
    app.createCube(chartFormatSlices, resolve).then(e => e.close());
  })
  return processChartsSlices(response)
}

async function qlikRequestRegionsAndFormatsData(app) {
  console.log("qlikRequestRegionsAndFormatsData STARTED");
  await app.variable.setStringValue('vAbsFlag', `1`); // % от выр.
  const unit1FormatData1 = await callApi(requestFormatSlicesBlock1(app), "requestFormatSlicesBlock1");
  const unit1FormatData2 = await callApi(requestFormatSlicesBlock2(app), "requestFormatSlicesBlock2");
  const unit1FormatGraphs = await callApi(requestChartFormatSlices(app), "requestChartFormatSlices");
  const unit1RegionData1 = await callApi(requestRegionSlicesBlock1(app), "requestRegionSlicesBlock1");
  const unit1RegionData2 = await callApi(requestRegionSlicesBlock2(app), "requestRegionSlicesBlock2");
  const unit1RegionGraphs = await callApi(requestChartRegionSlices(app), "requestChartRegionSlices");
  await app.variable.setStringValue('vAbsFlag', `2`); // млн. руб.
  const unit2FormatData1 = await callApi(requestFormatSlicesBlock1(app), "requestFormatSlicesBlock1");
  const unit2FormatData2 = await callApi(requestFormatSlicesBlock2(app), "requestFormatSlicesBlock2");
  const unit2FormatGraphs = await callApi(requestChartFormatSlices(app), "requestChartFormatSlices");
  const unit2RegionData1 = await callApi(requestRegionSlicesBlock1(app), "requestRegionSlicesBlock1");
  const unit2RegionData2 = await callApi(requestRegionSlicesBlock2(app), "requestRegionSlicesBlock2");
  const unit2RegionGraphs = await callApi(requestChartRegionSlices(app), "requestChartRegionSlices");
  const formats = unit1FormatData1.rows.map((item, index) => {
    return {
      name: item.name,
      column1: {units1: item.column, units2: unit2FormatData1.rows[index].column },
      column2: {units1: unit1FormatData2.rows[index].column, units2: unit2FormatData2.rows[index].column },
      graphs1: unit1FormatGraphs.groups[index],
      graphs2: unit2FormatGraphs.groups[index]
    }
  })
  const regions = unit1RegionData1.rows.map((item, index) => {
    return {
      name: item.name,
      column1: {units1: item.column, units2: unit2RegionData1.rows[index].column },
      column2: {units1: unit1RegionData2.rows[index].column, units2: unit2RegionData2.rows[index].column },
      graphs1: unit1RegionGraphs.groups[index],
      graphs2: unit2RegionGraphs.groups[index]
    }
  })
  console.log("qlikRequestRegionsAndFormatsData FIINSHED");
  return { regions, formats };
}

function zipFinancialSlices(data, regionData, formatData, filter, precision, dates, id) {
  const overviewData = {
    dates,
    filter,
    precision,
    data: {
      indicator: {...data},
      regions: regionData,
      formats: formatData,
    },
  };
  return overviewData;
}

async function qlikUpdateFilters(app, { conditions, date, datePoP, datePrecision, columnPrecision, units, dynamics }) {
  await qlikRequestDatesUpdate(app, date, datePoP, datePrecision);
  await qlikRequestFiltersUpdate(app, conditions);
  await qlikRequestPrecisionsUpdate(app, [columnPrecision, dynamics, units]);
  return Promise.resolve();
}

export async function qlikRequestFinancialOverviewData(app, filters, id) {
  const dates = await callApi(qlikRequestDates(app), "qlikRequestDates");
  const filter = await callApi(qlikRequestFilterState(app), "qlikRequestFilterState");
  const precision = await callApi(qlikRequestPrecisions(app), "qlikRequestPrecisions");
  let slices = []
  if (filters && !filters.initial && !filters.noUpdate) {
    const data = await qlikRequestFinancialOverviewTableData(app, filters);
    const { regions, formats } = await qlikRequestRegionsAndFormatsData(app);
    slices = zipFinancialSlices(data[0], regions, formats, filter, precision, dates, id);
  } else {
    slices = zipFinancialSlices([], [], [], filter, precision, dates, id);
  }
  return slices;
}

function qlikSelectIndicator(app, value) {
  return app.field(config.indicators).clear().then(() => app.field(config.indicators).selectValues([value], true, true));
}

export async function qlikRequestFinancialSlices(app, indicator, filters) {
  const foundIndicator = findIndicator(indicator);
  const { label, id } = foundIndicator;
  console.log("SLICES STARTED", label, id, foundIndicator)
  if (filters && !filters.fetch) await callApi(qlikSelectIndicator(app, label), "qlikSelectIndicator");
  if (filters && !filters.initial && !filters.noUpdate) await callApi(qlikUpdateFilters(app, filters), "qlikUpdateFilters");
  const slices = await qlikRequestFinancialOverviewData(app, filters, id);
  console.log("SLICES FINISHED")
  return slices;
}
