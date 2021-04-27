import indicatorsMainTable from 'configs/requests/operational/overview/indicatorsMainTable';
import chartsForIndicatorsMainTable from 'configs/requests/operational/overview/chartsForIndicatorsMainTable';
import { default as indicators } from 'configs/dashboards/operational/indicators.json';
import { default as dimensions } from 'configs/requests/operational/overview/dimensions.json';
import { qlikRequestDates, qlikRequestDatesUpdate } from './dates';
import { qlikRequestFilterState, qlikRequestFiltersUpdate } from './filter';
import { qlikRequestPrecisions, qlikRequestPrecisionsUpdate } from './precision';
import { 
  requestRTOMainTableBlock1,
  requestRTOMainTableBlock2,
  requestChartRtoIndicator,
  requestIndicatorForMainTableBlock1, 
  requestIndicatorForMainTableBlock2, 
  requestChartIndicator,
  processRowForChartIndicator
} from './overview';

const INDICATORS = indicators.reduce((result, group) => [...result, ...group.indicators], []);

function findIndicator(indicator) {
  return INDICATORS.find(option => option.url === indicator);
}

function processIndicatorSlicesBlock(rows) {
	const block = { items: []};
	rows.forEach( (row) => {
		block.items.push({
			name: row[1].qText,
			arrow: row[2],
			fact: row[3],
			factVsPp: row[4],
			factVsPpPercent: row[5],
		})
	})
	return block;
}

function formatDateString(str) {
  const parts = str.split('.');
  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return `${parts[2]}${parts[1]}`
  if (parts.length === 3) return `${parts[2]}${parts[1]}${parts[0]}`
  return "-";
}

// обработка данных для графиков на срезах
function processRowsChartIndicator(headers, rows, seriesSettings){
	let DATA = { groups: [], labels: []};
	let lastGroupName = "";
	let lastLabel = "";
	let group = {};
	for(let i=0; i < rows.length; i++){
		let seria;
		for(let j=1; j < rows[i].length; j++){
			if(j == 1 ){
				lastGroupName = rows[i][j].qText;
				group = DATA.groups.find( g => g.name == lastGroupName)
				if(!group){
					group = { name: lastGroupName, series: [] };
					DATA.groups.push(group)
				}
				continue;
			}
			
			seria = group.series.find(function(s){ return s.name == headers[j]});
			if(!seria && rows[i][j].qState == "L"){ //измерение
				seria = { name: headers[j], data: [] };
				group.series.push(seria);
			}
			if(rows[i][j].qState != "L"){
				if(!DATA.labels.includes(rows[i][2].qText)){
					DATA.labels.push(rows[i][2].qText); //
				}
				lastLabel = rows[i][2].qText;

			}else if(rows[i][j].qState == "L"){ //мера
				//console.info('j', j)
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

async function requestWithCube(app, name, dimensions, measures){
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
      }, reply => resolve( { reply, name } ) ).then(e => e.close());
    }
  )
}

//обновление обоих блоков срезов для показателя РТО
async function updateIndicatorRtoSlices(app){
	return Promise.all([
    updateIndicatorRtoSlicesBlock(app, 1),
    updateIndicatorRtoSlicesBlock(app, 2)])
}


//обновление блока для срезов для РТО
async function updateIndicatorRtoSlicesBlock(app, blockNumber){
	return Promise.all([
            updateIndicatorRtoSliceBlockFormats(app, blockNumber),
            updateIndicatorRtoSliceBlockRegions(app, blockNumber),
						updateIndicatorRtoSliceBlockGroup20(app, blockNumber)])
}

// Обновление блока срезов по регионам для РТО
async function updateIndicatorRtoSliceBlockRegions(app, blockNumber){
	const dimension = dimensions.region;
	return requestIndicatorRtoSlicesBlock(app, blockNumber, dimension)
		.then(({reply, app, name })=> {
			console.log('reply regions rto block', blockNumber, reply );
			const matrix = reply.qHyperCube.qDataPages[0].qMatrix;
			if(matrix.length == 0) throw new Error('matrix is empty for slices rto formats');
			const blockData = processIndicatorRtoSlicesBlock(matrix);
			return blockData;
		})
}
// Обновление блока срезов по форматам для РТО
async function updateIndicatorRtoSliceBlockFormats(app, blockNumber){
	const dimension = dimensions.format;
	return requestIndicatorRtoSlicesBlock(app, blockNumber, dimension)
		.then(({reply, app, name })=> {
			console.log('reply format rto block', blockNumber, reply );
			const matrix = reply.qHyperCube.qDataPages[0].qMatrix;
			if(matrix.length == 0) throw new Error('matrix is empty for slices rto formats');
			const blockData = processIndicatorRtoSlicesBlock(matrix);
			return blockData;
		})
}
// Обновление блока срезов по ГР20 для РТО
async function updateIndicatorRtoSliceBlockGroup20(app, blockNumber){
	const dimension = dimensions.group20;
	return requestIndicatorRtoSlicesBlock(app, blockNumber, dimension)
		.then(({reply, app, name })=> {
			console.log('reply group20 rto block', blockNumber, reply );
			const matrix = reply.qHyperCube.qDataPages[0].qMatrix;
			if(matrix.length == 0) throw new Error('matrix is empty for slices rto group20');
			const blockData = processIndicatorRtoSlicesBlock(matrix);
			return blockData;
		})
}
// запрос блок по срезам с учётом измерения для РТО
async function requestIndicatorRtoSlicesBlock(app, blockNumber, dimension){
	const indicatorRto = indicatorsMainTable.find(it=> it.id == 1)
	if(!indicatorRto) throw new Error('Indicator rto not found in indicatorsMainTable');
	const blockData = indicatorRto['block' + blockNumber]
	return requestWithCube(app, 
						indicatorRto.name,
						[indicatorRto.dimension, dimension],
						[blockData.arrow, blockData.fact, blockData.factVsPp, blockData.factVsPpPercent, blockData.factVsBudget, blockData.factVsBudgetPercent ])
}

// обработка блока данных срезов по показателю РТО
function processIndicatorRtoSlicesBlock(rows){
	const block = { items: []};
	rows.forEach( (row) => {
		block.items.push({
			name: row[1].qText,
			arrow: row[2],
			fact: row[3],
			factVsPp: row[4],
			factVsPpPercent: row[5],
			factVsBudget: row[6],
			factVsBudgetPercent: row[7]
		})
	})
	return block;
}

async function updateIndicatorSlices(app, idIndicator){
	return Promise.all([
      updateIndicatorSlicesBlock(app, idIndicator, 1),
      updateIndicatorSlicesBlock(app, idIndicator, 2)
    ])
}

async function updateIndicatorSlicesBlock(app, idIndicator, blockNumber){
	return Promise.all([
    updateIndicatorSliceBlockFormats(app, idIndicator, blockNumber),
    updateIndicatorSliceBlockRegions(app, idIndicator, blockNumber),    
    updateIndicatorSliceBlockGroup20(app, idIndicator, blockNumber)])
}

async function updateIndicatorSliceBlockRegions(app, idIndicator, blockNumber){
	const dimension = dimensions.region;
	return requestIndicatorSlicesBlock(app, idIndicator, blockNumber, dimension)
		.then(({reply, app, name })=> {
			console.log('reply regions for id ' + idIndicator, 'block' + blockNumber, reply );
			const matrix = reply.qHyperCube.qDataPages[0].qMatrix;
			if(matrix.length == 0) throw new Error('matrix is empty for slices regions for id' + idIndicator );
			const blockData = processIndicatorSlicesBlock(matrix);
			return blockData;
		})
}

// Обновление блока срезов по форматам для показателя по ID
async function updateIndicatorSliceBlockFormats(app, idIndicator, blockNumber){
  const dimension = dimensions.format;
  return requestIndicatorSlicesBlock(app, idIndicator, blockNumber, dimension)
    .then(({reply, app, name })=> {
      console.log('reply formats for id ' + idIndicator, 'block' + blockNumber, reply );
      const matrix = reply.qHyperCube.qDataPages[0].qMatrix;
      if(matrix.length == 0) throw new Error('matrix is empty for slices formats for id' + idIndicator );
      const blockData = processIndicatorSlicesBlock(matrix);
      return blockData;
    })
}

// Обновление блока срезов по ГР20 д для показателя по ID
async function updateIndicatorSliceBlockGroup20(app, idIndicator, blockNumber){
	const dimension = dimensions.group20;
	return requestIndicatorSlicesBlock(app, idIndicator, blockNumber, dimension)
		.then(({reply, app, name })=> {
			console.log('reply group20 for id ' + idIndicator, 'block' + blockNumber, reply );
			const matrix = reply.qHyperCube.qDataPages[0].qMatrix;
			if(matrix.length == 0) throw new Error('matrix is empty for slices group20 for id' + idIndicator );
      const blockData = processIndicatorSlicesBlock(matrix);
      return blockData;
		})
}

// запрос данных блока для срезов по ID показателя
async function requestIndicatorSlicesBlock(app, idIndicator, blockNumber, dimension) {
  const indicator = indicatorsMainTable.find(it=> it.id == idIndicator)
	if(!indicator) throw new Error('Indicator with id ' + idIndicator + ' not found in indicatorsMainTable');
	const blockData = indicator['block' + blockNumber]
	if(!blockData) throw Error('not found blockData ' + blockNumber + ' for indicatorId' + idIndicator)
	return requestWithCube(app, 
						indicator.name,
						[indicator.dimension, dimension],
						[blockData.arrow, blockData.fact, blockData.factVsPp, blockData.factVsPpPercent])
}

// Запрос на графики на срезах для показателя по ID
async function requestChartIndicatorSlices(app, dimension, idIndicator){
	const chartIndicator = chartsForIndicatorsMainTable.items.find( data => data.id == idIndicator);
	if(!chartIndicator) throw new Error('chart config slices not found for indicator ' + idIndicator);
	
	let dimensionPeriod = chartsForIndicatorsMainTable.extraDimensions.period;
	// индивидульальное измерение по периоду
	if(chartIndicator.dimensionPeriod){
		dimensionPeriod = indicatorChartConfig.dimensionPeriod;
	}
	const measuresChartIndicatorSlices = [chartIndicator.fact, chartIndicator.factPp, chartIndicator.vsFactPp];
	
	if(chartIndicator.vsFactPpAbsolute){
		measuresChartIndicatorSlices.push(chartIndicator.vsFactPpAbsolute);
	}
	return requestWithCube(app, 
    chartIndicator.name,
    [chartIndicator.dimension, dimension, dimensionPeriod],
    measuresChartIndicatorSlices,
    {suppressZero: true});
}

async function updateChartIndicatorSlices(app, idIndicator){
	return Promise.all([
    updateChartIndicatorSlicesRegions(app, idIndicator),
    updateChartIndicatorSlicesFormats(app, idIndicator),
    updateChartIndicatorSlicesGroup20(app, idIndicator)])
}

// обновление графиков на срезах по регионам для показателя по ID
async function updateChartIndicatorSlicesRegions(app, idIndicator){
	const dimension = dimensions.region;
	return requestChartIndicatorSlices(app, dimension, idIndicator)
		.then(( {reply, name })=> {
			console.log('chart slices rto regions reply', reply);
			const matrix = reply.qHyperCube.qDataPages[0].qMatrix;
			if(matrix.length == 0) throw new Error ('matrix chart slices regions is empty for id' + idIndicator);
			let coppyedHeaders = [];
			reply.qHyperCube.qDimensionInfo.forEach( (dim) =>  coppyedHeaders.push(dim.qFallbackTitle) )
			reply.qHyperCube.qMeasureInfo.forEach(( measureName)=> coppyedHeaders.push(measureName.qFallbackTitle));
			let seriesSettings = [
				{ type: 'line', color: '#34d800', axisY: 'left'},
				{ type: 'line', color: '#ffd700', axisY: 'left'},
				{ type: 'bar', color: '#ff2300', axisY: 'rightDown'}
			];
			const DATA = processRowsChartIndicator(coppyedHeaders, matrix, seriesSettings);
			return DATA;
		})
}

// обновление графиков на срезах по форматам для показателя по ID
async function updateChartIndicatorSlicesFormats(app, idIndicator){
	const dimension = dimensions.format;
	return requestChartIndicatorSlices(app, dimension, idIndicator)
		.then(( {reply, name })=> {
      console.log('chart slices rto formats reply', reply);
			const matrix = reply.qHyperCube.qDataPages[0].qMatrix;
			if(matrix.length == 0) throw new Error ('matrix chart rto slices format is empty for id' + idIndicator);
			let coppyedHeaders = [];
			reply.qHyperCube.qDimensionInfo.forEach( (dim) =>  coppyedHeaders.push(dim.qFallbackTitle) )
			reply.qHyperCube.qMeasureInfo.forEach(( measureName)=> coppyedHeaders.push(measureName.qFallbackTitle));
			let seriesSettings = [
				{ type: 'line', color: '#34d800', axisY: 'left'},
				{ type: 'line', color: '#ffd700', axisY: 'left'},
				{ type: 'bar', color: '#ff2300', axisY: 'rightDown'}
			];
      const DATA = processRowsChartIndicator(coppyedHeaders, matrix, seriesSettings);
      return DATA;
		})
}

// обновление графиков на срезах по гр20 для показателя по ID
async function updateChartIndicatorSlicesGroup20(app, idIndicator){
	const dimension = dimensions.group20;
	return requestChartIndicatorSlices(app, dimension, idIndicator)
		.then(( {reply, name })=> {
      console.log('chart slices rto group20 reply', reply);
			const matrix = reply.qHyperCube.qDataPages[0].qMatrix;
			if(matrix.length == 0) throw new Error ('matrix chart rto slices group20 is empty for id' + idIndicator);
			let coppyedHeaders = [];
			reply.qHyperCube.qDimensionInfo.forEach( (dim) =>  coppyedHeaders.push(dim.qFallbackTitle) )
			reply.qHyperCube.qMeasureInfo.forEach(( measureName)=> coppyedHeaders.push(measureName.qFallbackTitle));
			let seriesSettings = [
				{ type: 'line', color: '#34d800', axisY: 'left'},
				{ type: 'line', color: '#ffd700', axisY: 'left'},
				{ type: 'bar', color: '#ff2300', axisY: 'rightDown'}
			];
			const DATA = processRowsChartIndicator(coppyedHeaders, matrix, seriesSettings);
      return DATA;
		})
}

async function updateChartIndicatorRtoSlices(app){
	return Promise.all([updateChartIndicatorRtoSlicesRegions(app),
						updateChartIndicatorRtoSlicesFormats(app),
						updateChartIndicatorRtoSlicesGroup20(app)])
}

// обновление графиков на срезах по регионам для РТО
async function updateChartIndicatorRtoSlicesRegions(app){
	const dimension = dimensions.region;
	return requestChartIndicatorRtoSlices(app, dimension)
		.then(( {reply, name })=> {
			const matrix = reply.qHyperCube.qDataPages[0].qMatrix;
			if(matrix.length == 0) throw new Error ('matrix chart rto slices regions is empty!');
			let coppyedHeaders = [];
			reply.qHyperCube.qDimensionInfo.forEach( (dim) =>  coppyedHeaders.push(dim.qFallbackTitle) )
			reply.qHyperCube.qMeasureInfo.forEach(( measureName)=> coppyedHeaders.push(measureName.qFallbackTitle));
			let seriesSettings = [
				{ type: 'line', color: '#34d800', axisY: 'left'},
				{ type: 'line', color: '#ffd700', axisY: 'left'},
				{ type: 'bar', color: '#ff2300', axisY: 'rightDown'}
			];
			const DATA = processRowsChartIndicator(coppyedHeaders, matrix, seriesSettings);
			return DATA;
		})
}

// обновление графиков на срезах по форматам для РТО
async function updateChartIndicatorRtoSlicesFormats(app){
	const dimension = dimensions.format;
	return requestChartIndicatorRtoSlices(app, dimension)
		.then(( {reply, name })=> {
			const matrix = reply.qHyperCube.qDataPages[0].qMatrix;
			if(matrix.length == 0) throw new Error ('matrix chart rto slices format is empty!');
			let coppyedHeaders = [];
			reply.qHyperCube.qDimensionInfo.forEach( (dim) =>  coppyedHeaders.push(dim.qFallbackTitle) )
			reply.qHyperCube.qMeasureInfo.forEach(( measureName)=> coppyedHeaders.push(measureName.qFallbackTitle));
			let seriesSettings = [
				{ type: 'line', color: '#34d800', axisY: 'left'},
				{ type: 'line', color: '#ffd700', axisY: 'left'},
				{ type: 'bar', color: '#ff2300', axisY: 'rightDown'}
			];
			const DATA = processRowsChartIndicator(coppyedHeaders, matrix, seriesSettings);
      console.log('slices format rto chart', DATA)
      return DATA;
		})
}

// обновление графиков на срезах по гр20 для РТО
async function updateChartIndicatorRtoSlicesGroup20(app){
	const dimension = dimensions.group20;
	return requestChartIndicatorRtoSlices(app, dimension)
		.then(( {reply, name })=> {
			const matrix = reply.qHyperCube.qDataPages[0].qMatrix;
			if(matrix.length == 0) throw new Error ('matrix chart rto slices group20 is empty!');
			let coppyedHeaders = [];
			reply.qHyperCube.qDimensionInfo.forEach( (dim) =>  coppyedHeaders.push(dim.qFallbackTitle) )
			reply.qHyperCube.qMeasureInfo.forEach(( measureName)=> coppyedHeaders.push(measureName.qFallbackTitle));
			let seriesSettings = [
				{ type: 'line', color: '#34d800', axisY: 'left'},
				{ type: 'line', color: '#ffd700', axisY: 'left'},
				{ type: 'bar', color: '#ff2300', axisY: 'rightDown'}
			];
			const DATA = processRowsChartIndicator(coppyedHeaders, matrix, seriesSettings);
			console.log('slices group20 rto chart', DATA)
      return DATA;
		})
}

// Запрос на графики на срезах для показателя РТО
async function requestChartIndicatorRtoSlices(app, dimension){
	const rtoIndicator = chartsForIndicatorsMainTable.items.find( data => data.id == 1);
	if(!rtoIndicator) throw new Error('chart config slices no found for rto');
	return requestWithCube(app, 
    rtoIndicator.name,
    [rtoIndicator.dimension, dimension, chartsForIndicatorsMainTable.extraDimensions.period],
    [rtoIndicator.fact, rtoIndicator.factPp, rtoIndicator.vsFactPp, rtoIndicator.budget, rtoIndicator.vsBudget],
    {suppressZero: true})
}

async function updateChartIndicatorAverageCheckLFL(app){
	console.log('try update chart middle check lfl');
	return requestChartAverageCheckLFL(app)
		.then(( {reply, name}) => {
			const matrix = reply.qHyperCube.qDataPages[0].qMatrix;
			if(matrix.length == 0) throw new Error('matrix null for chart indicatorId ' + 5);
			let coppyedHeaders = [];
			reply.qHyperCube.qDimensionInfo.forEach( (dim) =>  coppyedHeaders.push(dim.qFallbackTitle) )
			reply.qHyperCube.qMeasureInfo.forEach(( measureName)=> coppyedHeaders.push(measureName.qFallbackTitle));
			let seriesSettings = [
				{ type: 'line', color: '#34d800', axisY: 'left'},
				{ type: 'line', color: '#ff230f', axisY: 'left'},
				{ type: 'line', color: '#fff300', axisY: 'left'},
				{ type: 'line', color: '#ff03f0', axisY: 'left'},
				{ type: 'bar', color: '#2506a9', axisY: 'rightDown'},
				{ type: 'bar', color: '#8506a9', axisY: 'rightDown'},
			];
      const DATA = processRowForChartIndicator(coppyedHeaders, matrix, seriesSettings);	
      return DATA;
		})
}

//запрос на данные для графика Средний Чек LFL
async function requestChartAverageCheckLFL(app){
	const chartConfig = chartsForIndicatorsMainTable.individual.averageCheckLFL;
	if(!chartConfig) throw new Error(" config for chart average check lfl id=5 in individual config not found");	
	return requestWithCube(app,
							chartConfig.name,
							[chartConfig.dimension, chartsForIndicatorsMainTable.extraDimensions.period],
							[chartConfig.commodityPriceMIX, chartConfig.complexInfluence, 
								chartConfig.dynamicUnregularPriceInflation, chartConfig.retailPriceInflationInfluence, chartConfig.loyaltyProductsInfluence  ],
							{suppressZero: true})
}

async function qlikUpdateFilters(app, { conditions, date, datePoP, columnPrecision, datePrecision, dynamics } ) {
  await qlikRequestFiltersUpdate(app, conditions);
  await qlikRequestPrecisionsUpdate(app, [columnPrecision, dynamics, datePrecision]);
  await qlikRequestDatesUpdate(app, date, datePoP, datePrecision);
  return Promise.resolve();
}

export async function qlikRequestOperationalSlicesData(app, filters, id, type) {
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
    tasks.push(id == '1' ? requestRTOMainTableBlock1(app) : requestIndicatorForMainTableBlock1(app, id));
    tasks.push(id == '1' ? requestRTOMainTableBlock2(app) : requestIndicatorForMainTableBlock2(app, id));
    tasks.push(filters.kind == '1' ? updateChartIndicatorAverageCheckLFL(app) : (id == '1' ? requestChartRtoIndicator(app) : requestChartIndicator(app, id)))
    return await Promise.all(tasks);
  } else if (type === 'slices') {
    const tasks = [];
    tasks.push(id == '1' ? updateIndicatorRtoSlices(app) : updateIndicatorSlices(app, id));
    return await Promise.all(tasks)
  } else if (type === 'charts') {
    const tasks = [];    
    tasks.push(id == '1' ? updateChartIndicatorRtoSlices(app) : updateChartIndicatorSlices(app, id));
    return await Promise.all(tasks)
  }
  return null;
}

export async function qlikRequestOperationalSlices(app, indicator, filters, type) {
  const foundIndicator = findIndicator(indicator);
  const { label, id } = foundIndicator;
  const indicatorId = parseInt(id);
  console.log("SLICES STARTED", label, indicatorId, foundIndicator, type, filters);
  if (type === 'meta') {
    if (filters && !filters.initial && !filters.noUpdate) {
      await qlikUpdateFilters(app, filters);
    }
  }  
  const slices = await qlikRequestOperationalSlicesData(app, filters, indicatorId, type)
  console.log("SLICES FINISHED", type);
  return slices;
}
