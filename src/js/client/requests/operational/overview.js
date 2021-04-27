import chartsForIndicatorsMainTable from 'configs/requests/operational/overview/chartsForIndicatorsMainTable';
import indicatorsMainTable from 'configs/requests/operational/overview/indicatorsMainTable';
import { qlikRequestDates, qlikRequestDatesUpdate } from './dates';
import { qlikRequestFilterState, qlikRequestFiltersUpdate } from './filter';
import { qlikRequestPrecisions, qlikRequestPrecisionsUpdate } from './precision';

export function processRTOMainTableBlock(name, units, row){
  console.log("processRTOMainTableBlock", name, row)
	return {
		id: row[0].qNum,
    name, 
    units: units,
		block: {
			arrow: row[1],
			fact: row[2],
			factPp: row[3],
			factVsPp: row[4],
			factVsPpPercent: row[5],
			budget: row[6],
			factVsBudget: row[7],
      factVsBudgetPercent: row[8],
		}
	}
}

export function processDeviationRTO(name, units, row){
	return {
		id: row[0],
    name,
    units: units,
		count: row[1],
		block1: {
			factVsPp: row[2],
			factVsBudget: row[3]
		},
		block2: {
			factVsPp: row[4],
			factVsBudget: row[5]
		}
	}
}

function formatDateString(str) {
  const parts = str.split('.');
  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return `${parts[2]}${parts[1]}`
  if (parts.length === 3) return `${parts[2]}${parts[1]}${parts[0]}`
  return "-";
}

export function processRowForChartIndicator(headers, rows, seriesSettings){
	let DATA = { series: [], labels: []};
	let lastLabel = "";
	for(let i=0; i < rows.length; i++){

		let seria;
		for(let j=1; j < rows[i].length; j++){
			seria = DATA.series.find(function(s){ return s.name == headers[j]});
			if(!seria && rows[i][j].qState == "L"){ //не измерение
				seria = { name: headers[j], data: [], ...seriesSettings[j-2] };
				DATA.series.push(seria);
			}
			if(rows[i][j].qState != "L"){
				if(DATA.labels.indexOf(rows[i][1].qText) == -1){
					DATA.labels.push(rows[i][1].qText); //
				}
				lastLabel = rows[i][1].qText;

			}else if(rows[i][j].qState == "L"){ //мера
				seria.data.push({
					name: formatDateString(lastLabel),
					data: +rows[i][j].qNum,
          text: rows[i][j].qText
				});
			}
		}

	}
	return DATA;
}

async function requestWithCube(app, name, units, dimensions, measures) {
  return new Promise( ( resolve, reject) => {
  app.createCube({
    "qInitialDataFetch": [
      {
        "qHeight": Math.floor(10000 / (dimensions.length + measures.length)),
        "qWidth": dimensions.length + measures.length
      }
    ],
    "qDimensions": dimensions,
    "qMeasures": measures,
    "qSuppressZero": false,
    "qSuppressMissing": false,
    "qMode": "S",
    "qInterColumnSortOrder": [],
    "qStateName": "$"
    }, reply => resolve( { app, reply, name, units } ) )
    .then(model => model.close());
  })
}

async function requestChartsWithCube(app, name, dimensions, measures){
  return new Promise( ( resolve, reject) => {
  app.createCube({
    "qInitialDataFetch": [
      {
        "qHeight": 300,
        "qWidth": dimensions.length + measures.length
      }
    ],
    "qDimensions": dimensions,
    "qMeasures": measures,
    "qSuppressZero": false,
    "qSuppressMissing": false,
    "qMode": "S",
    "qInterColumnSortOrder": [],
    "qStateName": "$"
    }, reply => resolve( { app, reply, name } ) )
    .then(model => model.close());    
  })
}

async function requestRTOMainTableBlock(app, blockNumber) {
	const rtoIndicator = indicatorsMainTable.find( it => it.id == 1)
	if(!rtoIndicator) throw new Error('indicator RTO by id 1 not found');
	const blockData = rtoIndicator['block'+ blockNumber];
	if(!blockData) throw new Error('block'+ blockNumber + ' not found in rto');
	console.log("RTO INDICATOR", rtoIndicator)
	return requestWithCube(app, 
            rtoIndicator.name,
            rtoIndicator.units,
						[rtoIndicator.dimension], 
						[blockData.arrow, blockData.fact, blockData.factPp, blockData.factVsPp, blockData.factVsPpPercent, blockData.budget, blockData.factVsBudget, blockData.factVsBudgetPercent])
}

export async function requestRTOMainTableBlock1(app) {
  return requestRTOMainTableBlock(app, 1).then( ( { reply, name, units } ) => {
    const matrix = reply.qHyperCube.qDataPages[0].qMatrix;
    if(matrix.length == 0) throw new Error('empty reply for RTO main table')
    const rtoData = processRTOMainTableBlock(name, units, matrix[0]);
    return rtoData;
  })
  .catch(e => console.error('Error while load results for main table RTO',e))
}

export async function requestRTOMainTableBlock2(app) {
  return requestRTOMainTableBlock(app, 2).then( ( { reply, name, units } ) => {
    const matrix = reply.qHyperCube.qDataPages[0].qMatrix;
    if(matrix.length == 0) throw new Error('empty reply for RTO main table')
    const rtoData = processRTOMainTableBlock(name, units, matrix[0]);
    return rtoData;
  })
  .catch(e => console.error('Error while load results for main table RTO',e))
}

async function requestIndicatorForMainTableBlock(app, idIndicator, blockNumber){
	const indicator = indicatorsMainTable.find( it => it.id == idIndicator);
	if(!indicator) throw new Error('not found indicator for main table by id ', idIndicator );
	const blockData = indicator['block' + blockNumber];
	if(!blockData) throw new Error('blockData not found for number ', blockNumber);
	return requestWithCube(app, 
            indicator.name,
            indicator.units,
						[indicator.dimension],
						[blockData.arrow, blockData.fact, blockData.factPp, blockData.factVsPp, blockData.factVsPpPercent])
}

export async function requestIndicatorForMainTableBlock1(app, idIndicator) {
  return requestIndicatorForMainTableBlock(app, idIndicator, 1).then( ( { reply, name, units } ) => {
    const matrix = reply.qHyperCube.qDataPages[0].qMatrix;
    if(matrix.length == 0) throw new Error('empty reply for RTO main table')
    const data = processRTOMainTableBlock(name, units, matrix[0]);
    return data;
  })
  .catch(e => console.error(`Error while load results for main table ${idIndicator}`,e))
}

export async function requestIndicatorForMainTableBlock2(app, idIndicator) {
  return requestIndicatorForMainTableBlock(app, idIndicator, 2).then( ( { reply, name, units } ) => {
    const matrix = reply.qHyperCube.qDataPages[0].qMatrix;
    if(matrix.length == 0) throw new Error('empty reply for RTO main table')
    const data = processRTOMainTableBlock(name, units, matrix[0]);
    return data;
  })
  .catch(e => console.error(`Error while load results for main table ${idIndicator}`,e))
}

async function requestDeviationRegionsRTO(app){
	const rtoIndicator = indicatorsMainTable.find( it => it.id === 1);
	if(!rtoIndicator) throw new Error('indicator RTO by id 1 not found');
  return requestWithCube(app,
              rtoIndicator.name,
              rtoIndicator.units,
							[rtoIndicator.dimension],
							[rtoIndicator.block1.deviationRegions.count, rtoIndicator.block1.deviationRegions.factVsPp, rtoIndicator.block1.deviationRegions.factVsBudget,
               rtoIndicator.block2.deviationRegions.factVsPp, rtoIndicator.block2.deviationRegions.factVsBudget ],
            )
    .then( ({reply, name, units}) => {
      const matrix = reply.qHyperCube.qDataPages[0].qMatrix;
      if(matrix.length == 0) throw new Error('empty reply for RTO main table deviation regions')
      const rtoDeviationRegions = processDeviationRTO(name, units, matrix[0])
      return rtoDeviationRegions;
    })  
}

async function requestDeviationFormatsRTO(app){
	const rtoIndicator = indicatorsMainTable.find( it => it.id === 1);
	if(!rtoIndicator) throw new Error('indicator RTO by id 1 not found');
	return requestWithCube(app,
              rtoIndicator.name,
              rtoIndicator.units,
							[rtoIndicator.dimension],
							[rtoIndicator.block1.deviationFormats.count, rtoIndicator.block1.deviationFormats.factVsPp, rtoIndicator.block1.deviationFormats.factVsBudget,
               rtoIndicator.block2.deviationFormats.factVsPp, rtoIndicator.block2.deviationFormats.factVsBudget ],
            )
    .then( ({reply, name, units}) => {
      const matrix = reply.qHyperCube.qDataPages[0].qMatrix;
      if(matrix.length == 0) throw new Error('empty reply for RTO main table deviation formats')
      const rtoDeviationFormats = processDeviationRTO(name, units, matrix[0])
      return rtoDeviationFormats;
    })
}

async function requestDeviationRegionsIndicator(app, idIndicator){
	const indicator = indicatorsMainTable.find( it => it.id == idIndicator);
	if(!indicator) throw new Error('indicator by id '+ idIndicator +' not found');
	return requestWithCube(app,
              indicator.name,
              indicator.units,
							[indicator.dimension],
							[indicator.block1.deviationRegions.count, indicator.block1.deviationRegions.factVsPp,
               indicator.block2.deviationRegions.factVsPp ])
      .then( ({reply, name, units}) => {
        const matrix = reply.qHyperCube.qDataPages[0].qMatrix;
        if(matrix.length == 0) throw new Error('empty reply for RTO main table deviation formats')
        const rtoDeviationFormats = processDeviationRTO(name, units, matrix[0])
        return rtoDeviationFormats;
      })
}

async function requestDeviationFormatsIndicator(app, idIndicator){
	const indicator = indicatorsMainTable.find( it => it.id == idIndicator);
	if(!indicator) throw new Error('indicator by id '+ idIndicator +' not found');
	return requestWithCube(app,
              indicator.name,
              indicator.units,
							[indicator.dimension],
							[indicator.block1.deviationFormats.count, indicator.block1.deviationFormats.factVsPp,
               indicator.block2.deviationFormats.factVsPp ])
      .then( ({reply, name, units}) => {
        const matrix = reply.qHyperCube.qDataPages[0].qMatrix;
        if(matrix.length == 0) throw new Error('empty reply for RTO main table deviation formats')
        const rtoDeviationFormats = processDeviationRTO(name, units, matrix[0])
        return rtoDeviationFormats;
      })
}

async function requestChartRtoIndicatorMainTable(app){
	const rtoChartConfig = chartsForIndicatorsMainTable.items.find( data => data.id == 1);
	if(!rtoChartConfig) throw new Error('config for chart rto not found');
	return requestChartsWithCube(app,
              rtoChartConfig.name,
							[rtoChartConfig.dimension, chartsForIndicatorsMainTable.extraDimensions.period],
              [rtoChartConfig.fact, rtoChartConfig.factPp, rtoChartConfig.vsFactPp, rtoChartConfig.budget, rtoChartConfig.vsBudget ],
            )
}

async function updateChartRtoIndicator(app){
	return requestChartRtoIndicatorMainTable(app)
		.then( ({reply, name}) => {
			const matrix = reply.qHyperCube.qDataPages[0].qMatrix;
			if(matrix.length == 0) throw new Error('matrix null for chart for RTO indicator ');
			let coppyedHeaders = [];
			reply.qHyperCube.qDimensionInfo.forEach( (dim) =>  coppyedHeaders.push(dim.qFallbackTitle) )
			reply.qHyperCube.qMeasureInfo.forEach(( measureName)=> coppyedHeaders.push(measureName.qFallbackTitle));
			let seriesSettings = [
				{ type: 'line', color: '#34d800', axisY: 'left'},
				{ type: 'line', color: '#ffd700', axisY: 'left'},
				{ type: 'none', color: '#8f06f9', axisY: 'left'},
				{ type: 'bar', color: '#8506a9', axisY: 'rightDown'},
				{ type: 'bar', color: '#ff2300', axisY: 'rightDown'},
			];
      const DATA = processRowForChartIndicator(coppyedHeaders, matrix, seriesSettings);	
			return DATA;
		})
}

export async function requestChartRtoIndicator(app) {
  try {
    const result = await updateChartRtoIndicator(app)
    return result;
  } catch (e) {
    console.error(e)
  }
  return []
}

export async function requestChartIndicator(app, idIndicator) {
  try {
    const result = await updateChartIndicatorMainTable(app, idIndicator)
    return result;
  } catch (e) {
    console.error(e)
  }
  return []
}

async function requestChartIndicatorMainTable(app, idIndicator){
	const indicatorChartConfig = chartsForIndicatorsMainTable.items.find( data => data.id == idIndicator);
	if(!indicatorChartConfig) throw new Error('config for chart indicator ' + idIndicator );
	return requestChartsWithCube(app,
              indicatorChartConfig.name,
							[indicatorChartConfig.dimension, chartsForIndicatorsMainTable.extraDimensions.period],
              [indicatorChartConfig.fact, indicatorChartConfig.factPp, indicatorChartConfig.vsFactPp ],
            )
}

async function updateChartIndicatorMainTable(app, idIndicator){
	return requestChartIndicatorMainTable(app, idIndicator)
		.then( ( {reply, name} ) => {
			const matrix = reply.qHyperCube.qDataPages[0].qMatrix;
			if(matrix.length == 0) throw new Error('matrix null for indicatorId', idIndicator);
			let coppyedHeaders = [];
			reply.qHyperCube.qDimensionInfo.forEach( (dim) =>  coppyedHeaders.push(dim.qFallbackTitle) )
			reply.qHyperCube.qMeasureInfo.forEach(( measureName)=> coppyedHeaders.push(measureName.qFallbackTitle));
			let seriesSettings = [
				{ type: 'line', color: '#34d800', axisY: 'left'},
				{ type: 'line', color: '#8f06f9', axisY: 'left'},
				{ type: 'bar', color: '#8506a9', axisY: 'rightDown'},
			];
			const DATA = processRowForChartIndicator(coppyedHeaders, matrix, seriesSettings);	
      return DATA;
		})
}

async function qlikUpdateFilters(app, { conditions, date, datePoP, columnPrecision, datePrecision, dynamics } ) {
  await qlikRequestFiltersUpdate(app, conditions);
  await qlikRequestPrecisionsUpdate(app, [columnPrecision, dynamics, datePrecision]);
  await qlikRequestDatesUpdate(app, date, datePoP, datePrecision);
  return Promise.resolve();
}

export async function qlikRequestOperationalOverviewData(app, type, idIndicator) {  
  console.log("OVERVIEW STARTED ", type, idIndicator)
  if (type === 'meta') {
    const tasks = [
      qlikRequestDates(app),
      qlikRequestFilterState(app),
      qlikRequestPrecisions(app)
    ]
    const results = await Promise.all(tasks);
    return { dates: results[0], filter: results[1], precision: results[2] }
  } else if (type === 'data') {
    const tasks = [];
    tasks.push(idIndicator == '1' ? requestRTOMainTableBlock1(app) : requestIndicatorForMainTableBlock1(app, idIndicator));
    tasks.push(idIndicator == '1' ? requestRTOMainTableBlock2(app) : requestIndicatorForMainTableBlock2(app, idIndicator));
    const results = await Promise.all(tasks);
    return [results[0], results[1]];
  } else if (type === 'charts') {
    const tasks = [];
    tasks.push(idIndicator == '1' ? requestChartRtoIndicator(app) : requestChartIndicator(app, idIndicator))
    const results = await Promise.all(tasks);
    return [results[0]];
  } else if (type === 'deviations') {
    const tasks = []
    tasks.push(idIndicator == '1' ? requestDeviationFormatsRTO(app) : requestDeviationFormatsIndicator(app, idIndicator));
    tasks.push(idIndicator == '1' ? requestDeviationRegionsRTO(app) : requestDeviationRegionsIndicator(app, idIndicator));    
    const results = await Promise.all(tasks)
    return [results[0], results[1]];
  }
  return null;
}

export async function qlikRequestOperationalOverview(app, filters, type, idIndicator) {
  if (type === 'meta') {
    console.log("qlikRequestOperationalOverview", filters)
    if (filters && !filters.initial && !filters.noUpdate) await qlikUpdateFilters(app, filters);
  }
  const overview = await qlikRequestOperationalOverviewData(app, type, idIndicator);
  return overview;
}
