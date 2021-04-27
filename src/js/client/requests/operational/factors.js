import indicatorsMainTable from 'configs/requests/operational/overview/indicatorsMainTable';
import chartsForIndicatorsMainTable from 'configs/requests/operational/overview/chartsForIndicatorsMainTable';
import factorsOfIndicators from 'configs/requests/operational/overview/factorsOfIndicators';
import { default as indicators } from 'configs/dashboards/operational/indicators.json';
import { default as dimensions } from 'configs/requests/operational/overview/dimensions.json';
import { qlikRequestDates, qlikRequestDatesUpdate } from './dates';
import { qlikRequestFilterState, qlikRequestFiltersUpdate } from './filter';
import { qlikRequestPrecisions, qlikRequestPrecisionsUpdate } from './precision';
import {
  requestIndicatorForMainTableBlock1, 
  requestIndicatorForMainTableBlock2, 
} from './overview';

const INDICATORS = indicators.reduce((result, group) => [...result, ...group.indicators], []);

function findIndicator(indicator) {
  return INDICATORS.find(option => option.url === indicator);
}

const hierarchyIndicators = {
  indicators: [
    {	
      id: 1,
      itemsIds: [2, 26, 27, 28, 29, 30, 31]
    },
    {
      id: 24,
      itemsIds: [32, 33, 34, 35, 36, 37]
    }
  ]
}

const getHierarchyItemsIds = (indicatorId) => {
  const foundHierarchy = hierarchyIndicators.indicators.find( it=> it.id == indicatorId);
  return foundHierarchy ? foundHierarchy.itemsIds : [];
}

async function updateHyerarchyIndicator(app, idIndicator){
	return requestHyerarchyIndicator(app, idIndicator )
		.then( result => {
			const block1 = processReplyHyerarchyIndicator(result);
			return Promise.resolve({ id: idIndicator,  block1 })
		})
}

function processReplyHyerarchyIndicator( {reply, name, units} ){
	const matrix = reply.qHyperCube.qDataPages[0].qMatrix;
	const blockDataRow = matrix[0];
	return {
		id: blockDataRow[0].qNum,
    name, 
    units,
		blockData: {
      vsBudgetPercent: blockDataRow[1],
			vsFactPercent: blockDataRow[1]
		}
	};
}

function formatDateString(str) {
  const parts = str.split('.');
  if (parts.length !== 3) return '';
  return `${parts[2]}${parts[1]}${parts[0]}`
}

function processRowForChartIndicator(headers, rows, seriesSettings){
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

async function requestWithCube(app, name, units, dimensions, measures){
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
      }, reply => resolve( { reply, name, units } ) ).then(e => e.close());
    }
  )
}

async function requestHyerarchyIndicator(app, idIndicator){
	const indicator = indicatorsMainTable.find( it => it.id == idIndicator);
	if(!indicator) throw new Error('not found indicator for main table by id ', idIndicator );
	const blockData = indicator['block1'];
	if(!blockData) throw new Error('block1 not found for id:', idIndicator);
	return requestWithCube(app, 
            indicator.name,
            indicator.units,
						[indicator.dimension],
						[blockData.factVsPpPercent])
}

//запрос на график для индикатора по иерархии
async function requestHyerarchyChartIndicator(app, idIndicator){
	const indicatorChartConfig = chartsForIndicatorsMainTable.items.find( data => data.id == idIndicator);
	if(!indicatorChartConfig) throw new Error('error config for chart indicator hyerarchy: ' + idIndicator );
	return requestWithCube(app,
              indicatorChartConfig.name,
              indicatorChartConfig.units,
							[indicatorChartConfig.dimension, chartsForIndicatorsMainTable.extraDimensions.period],
							[indicatorChartConfig.vsFactPp ])
}

async function updateHyerarchyChartIndicator(app, idIndicator){
	return requestHyerarchyChartIndicator(app, idIndicator)
		.then( ( {reply, name} ) => {
			const matrix = reply.qHyperCube.qDataPages[0].qMatrix;
			if(matrix.length == 0) throw new Error('matrix null for indicatorId', idIndicator);
			let coppyedHeaders = [];
			reply.qHyperCube.qDimensionInfo.forEach( (dim) =>  coppyedHeaders.push(dim.qFallbackTitle) )
			reply.qHyperCube.qMeasureInfo.forEach(( measureName)=> coppyedHeaders.push(measureName.qFallbackTitle));
			let seriesSettings = [
				{ type: 'bar', color: '#8506a9', axisY: 'rightDown'},
			];
			const DATA = processRowForChartIndicator(coppyedHeaders, matrix, seriesSettings);	// функция из раздела "Основная Таблица"		
			return Promise.resolve({ id: idIndicator, chartData: DATA })
		})
}

async function update(app, indicatorId) {	
	const itemsIds = getHierarchyItemsIds(indicatorId);
	const hierarchyRequests = itemsIds.map( (indicator, index) => {
		return Promise.all([
			updateHyerarchyIndicator(app, itemsIds[index]),
			updateHyerarchyChartIndicator(app, itemsIds[index])
		])
	})
	return Promise.all(hierarchyRequests)		
}

// обновление факторов для Среднего чека LFL
async function updateFactorsAverageCheckLFLBridge(app){
	return await Promise.all([
		updateFactorsAverageCheckLFLBridgeBlock(app, 1),
		updateFactorsAverageCheckLFLBridgeBlock(app, 2)
	])
}

// обновление блока фактров среднего чека LFL
async function updateFactorsAverageCheckLFLBridgeBlock(app, blockNumber){
	return requestFactorsAverageCheckLFLBridgeBlock(app, blockNumber)
		.then( ({reply, units}) => {
			const factorConfig = factorsOfIndicators.find( item => item.id == 5);
			if(!factorConfig) throw new Error('not found config for factors for id ' + 5);
			const factorsNames = factorConfig.factorsNames;
			const blockData = processFactorsAverageCheckLFLBridgeBlock(reply, units, factorsNames);
			console.log('average check LFL block' + blockNumber, blockData);
			return Promise.resolve(blockData)
		})
}

// запрос факторов для блока данных мостовой диаграммы для среденего чека LFL
async function requestFactorsAverageCheckLFLBridgeBlock(app, blockNumber){
	const factorConfig = factorsOfIndicators.find( item => item.id == 5);
	if(!factorConfig) throw new Error('not found config for factors for id ' + 5);
	const blockData = factorConfig["block" + blockNumber];
	if(!blockData) throw new Error('block ' + blockNumber + " not found in config for factors with id " + 5);
	return requestWithCube(app, 
            factorConfig.name,
            "%",
						[],
						[blockData.commodityPriceMIX, blockData.complexInfluence,
						blockData.dynamicUnregularPriceInflation, blockData.retailPriceInflationInfluence, blockData.loyaltyProductsInfluence ])
}

// обработка данных для блока факторов среднего чека lfl для моста
function processFactorsAverageCheckLFLBridgeBlock(reply, units, factorsNames){
	const matrix = reply.qHyperCube.qDataPages[0].qMatrix;
	const items = [];
	for(let i=0; i < matrix[0].length; i++){
		items.push([{
      block1 : {
        name: factorsNames[i],
        units: units,
        blockData: {
          vsBudgetPercent: {
            qText: matrix[0][i].qText,
            qNum: matrix[0][i].qNum
          },
          vsFactPercent: {
            qText: matrix[0][i].qText,
            qNum: matrix[0][i].qNum
          }
        }
      }
		}])
	}
	return items;
}

// обновление факторов для Инфляции
async function updateFactorsInflationBridge(app){
	return requestFactorsInflationBridge(app)
		.then( ({ reply, units, name}) => {
			const bridgeData = processFactorsInflationBridge(reply, '%', name);
			console.log('bridge инфляция', bridgeData)
			return Promise.resolve(bridgeData);
		})
}

// запрос факторов для инфляции для диаграммы моста
async function requestFactorsInflationBridge(app){
	const factorConfig = factorsOfIndicators.find( item => item.id == 20);
	if(!factorConfig) throw new Error('not found config for factors for id ' + 20);
	return requestWithCube(app,
                  factorConfig.name,
                  "%",
									[factorConfig.dimensions.group20],
									[factorConfig.bridge.fact, factorConfig.bridge.marginalityContribution, factorConfig.bridge.inflationVsRtoLFL, factorConfig.bridge.complexityContribution ])
}

// обработка данных для факторов инфляции для диаграммы мост
function processFactorsInflationBridge(reply, units, name) {
  const matrix = reply.qHyperCube.qDataPages[0].qMatrix;
  const items1 = [];
  const items2 = [];
	for(let i=0; i < matrix.length; i++){
    items1.push([{
      block1 : {
        name: matrix[i][0].qText,
        units: units,
        blockData: {
          vsBudgetPercent: matrix[i][2],
          vsFactPercent: matrix[i][1]
        }
      }
    }])
    items2.push([{
      block1: {
        name: matrix[i][0].qText,
        units: units,
        blockData: {
          vsBudgetPercent: matrix[i][4],
          vsFactPercent: matrix[i][3]
        }
      }
    }])
	}
  return [items1, items2];
}

// обновление итоговых данных по факторам для инфляции
async function updateFactorsInflationResults(app){
	return requestFactorsInflationResults(app)
		.then( ({reply, units, name }) => {
			const resultInflation = processFactorsInflationResults(reply, '%', name);
			console.log('инфляции ИТОГ', reply, resultInflation);
			return Promise.resolve(resultInflation)
		})
}

// запрос факторов для инфляции для диаграммы моста
async function requestFactorsInflationResults(app){
  const factorConfig = factorsOfIndicators.find( item => item.id == 20);
	if(!factorConfig) throw new Error('not found config for factors for id ' + 20);
	return requestWithCube(app,
                  factorConfig.name,
                  '%',
									[],
									[factorConfig.results.factPp, factorConfig.results.fact, factorConfig.results.factVsPp, 
									factorConfig.results.marginalityContributionPp, factorConfig.results.marginalityContribution, factorConfig.results.marginalityContributionVsPp,
									factorConfig.results.inflationVsRtoLFLPp, factorConfig.results.inflationVsRtoLFL, factorConfig.results.inflationVsRtoLFLVsPp,
									factorConfig.results.complexityContributionPp, factorConfig.results.complexityContribution, factorConfig.results.complexityContributionVsPp  ])
}

// обработка итоговых данных для факторов по инфляции
function processFactorsInflationResults(reply, units, name){
	const matrix = reply.qHyperCube.qDataPages[0].qMatrix;
	return [{
    name,
    units: units,
    block: {
      factPp: matrix[0][0],
      fact: matrix[0][1],
      factVsPp: matrix[0][2],
      budgetPp: matrix[0][3],
      budget: matrix[0][4],
      factVsBudget: matrix[0][5]
    }		
  }, {
    name, 
    units: units,
    block: {
      factPp: matrix[0][6],
      fact: matrix[0][7],
      factVsPp: matrix[0][8],
      budgetPp: matrix[0][9],
      budget: matrix[0][10],
      factVsBudget: matrix[0][11]      
    }
  }]
}

async function updateFactorsRtoBridge(app){
	return await Promise.all([
		updateFactorsRtoBridgeBlock(app, 1),
		updateFactorsRtoBridgeBlock(app, 2)
  ])
}

// обновление факторов для РТО для блока для мостовой диаграммы
async function updateFactorsRtoBridgeBlock(app, blockNumber){
	const {reply, units} = await requestFactorsRtoBridgeBlock(app, blockNumber)
	const factorConfig = factorsOfIndicators.find( item => item.id == 1);
	if(!factorConfig) throw new Error('not found config for factors for id ' + 1);
	const factorsNames = factorConfig.factorsNames;
	const blockData = processFactorsRtoBridgeBlock(reply, units, factorsNames);
	//console.log('block' + blockNumber, blockData);
	
	return Promise.resolve(blockData)	
}


// запрос факторов для блока данных мостовой диаграммы для РТО
async function requestFactorsRtoBridgeBlock(app, blockNumber){
	const factorConfig = factorsOfIndicators.find( item => item.id == 1);
	if(!factorConfig) throw new Error('not found config for factors for id ' + 1);
	const blockData = factorConfig["block" + blockNumber];
	if(!blockData) throw new Error('block ' + blockNumber + " not found in config for factors with id " + 1);
	return requestWithCube(app, 
						factorConfig.name,
            'руб.',
						[],
						[blockData.bridge.promoInfluence, blockData.bridge.otherInfluence, blockData.bridge.regularInfluence, 
              blockData.bridge.lostCostInfluence, blockData.bridge.loyaltyInfluence, blockData.bridge.monitoringInfluence,
              blockData.bridge.extraPromoInfluence ])            
}

// обработка данных для блока факторов РТО для моста
function processFactorsRtoBridgeBlock(reply, units, factorsNames){
	const matrix = reply.qHyperCube.qDataPages[0].qMatrix;
	const items = [];
	for(let i=0; i < matrix[0].length; i++){
		items.push([{
      block1 : {
        name: factorsNames[i],
        units: units,
        blockData: {
          vsBudgetPercent: {
            qText: matrix[0][i].qText,
            qNum: matrix[0][i].qNum
          },
          vsFactPercent: {
            qText: matrix[0][i].qText,
            qNum: matrix[0][i].qNum
          }
        }
      }
		}])
	}
	return items;
}

function zipBridges(data1, data2) {
  return data1.map((item, index) => {
    return {
      id: item[0].block1.id,
      name: item[0].block1.name,
      units: item[0].block1.units,
      column1: {
        vsBudgetPercent: { ...item[0].block1.blockData.vsBudgetPercent, units: item[0].block1.units },
        vsFactPercent: {...item[0].block1.blockData.vsFactPercent, units: item[0].block1.units }
      },
      column2: {
        vsBudgetPercent: data2[index] ? { ...data2[index][0].block1.blockData.vsBudgetPercent, units: item[0].block1.units } : { qNum: 0, units: item[0].block1.units },
        vsFactPercent: data2[index] ? {...data2[index][0].block1.blockData.vsFactPercent, units: item[0].block1.units } : { qNum: 0, units: item[0].block1.units }
      }
    }
  })
}

function zipResults(data1, data2) {
  return {
    id: data1.id,
    name: data1.name,
    units: data1.units,
    column1: {
      factPrevYearPrecent: data1.block.factPp ? {...data1.block.factPp, units: data1.units } : { qNum: 0, units: data1.units },
      factCurrYearPercent: data1.block.fact ? {...data1.block.fact, units: data1.units } : { qNum: 0, units: data1.units },
      bridgeResultPrevYearPercent: data1.block.factVsPp ? { ...data1.block.factVsPp, units: data1.units } : { qNum: 0, units: data1.units },
      budgetPrevYearPercent: data1.block.budgetPp ? {...data1.block.budgetPp, units: data1.units } : { qNum: 0, units: data1.units },      
      budgetPercent: data1.block.budget ? {...data1.block.budget, units: data1.units } : { qNum: 0, units: data1.units },      
      bridgeResultBudgetPercent: data1.block.factVsBudget ? { ...data1.block.factVsBudget, units: data1.units } : { qNum: 0, units: data1.units },
    },
    column2: {
      factPrevYearPrecent: data2.block.factPp ? {...data2.block.factPp, units: data2.units } : { qNum: 0, units: data2.units },
      factCurrYearPercent: data2.block.fact ? {...data2.block.fact, units: data2.units } : { qNum: 0, units: data2.units },
      bridgeResultPrevYearPercent: data2.block.factVsPp ? { ...data2.block.factVsPp, units: data2.units } : { qNum: 0, units: data2.units },
      budgetPrevYearPercent: data2.block.budgetPp ? {...data2.block.budgetPp, units: data2.units } : { qNum: 0, units: data2.units },
      budgetPercent: data2.block.budget ? { ...data2.block.budget, units: data2.units } : { qNum: 0, units: data2.units },
      bridgeResultBudgetPercent: data2.block.factVsBudget ? { ...data2.block.factVsBudget, units: data2.units } : { qNum: 0, units: data2.units },
    }
  }
}

async function qlikUpdateFilters(app, { conditions, date, datePoP, columnPrecision, datePrecision, dynamics } ) {
  await qlikRequestFiltersUpdate(app, conditions);
  await qlikRequestPrecisionsUpdate(app, [columnPrecision, dynamics, datePrecision]);
  await qlikRequestDatesUpdate(app, date, datePoP, datePrecision);
  return Promise.resolve();
}

export async function qlikRequestOperationalFactorsData(app, filters, id, type) {
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
    if (id == '1') {      
      tasks.push(updateFactorsRtoBridge(app));
      tasks.push(requestIndicatorForMainTableBlock1(app, id));
      tasks.push(requestIndicatorForMainTableBlock2(app, id));
      const results = await Promise.all(tasks);
      return [[zipResults(results[1], results[2])], zipBridges(results[0][0], results[0][1])]
    } else if (id == '24') {
      tasks.push(update(app, id));
      tasks.push(requestIndicatorForMainTableBlock1(app, id));
      tasks.push(requestIndicatorForMainTableBlock2(app, id));
      const results = await Promise.all(tasks);
      return [[zipResults(results[1], results[2])], zipBridges(results[0], results[0])]
    } else if (id == '5') {
      tasks.push(updateFactorsAverageCheckLFLBridge(app))
      tasks.push(requestIndicatorForMainTableBlock1(app, id))
      tasks.push(requestIndicatorForMainTableBlock2(app, id))
      const results = await Promise.all(tasks);
      return [[zipResults(results[1], results[2])], zipBridges(results[0][0], results[0][1])]
    } else if (id == '20') {      
      tasks.push(updateFactorsInflationBridge(app))
      tasks.push(updateFactorsInflationResults(app))
      const results = await Promise.all(tasks); 
      return [[zipResults(results[1][0], results[1][1])], zipBridges(results[0][0], results[0][1])]
    }
  }
  return null;
}

export async function qlikRequestOperationalFactors(app, indicator, filters, type) {
  const foundIndicator = findIndicator(indicator);
  const { label, id } = foundIndicator;
  const indicatorId = parseInt(id);
  console.log("FACTORS STARTED", label, indicatorId, foundIndicator, type, filters);
  if (type === 'meta') {
    if (filters && !filters.initial && !filters.noUpdate) 
      await qlikUpdateFilters(app, filters);
  }
  const factors = await qlikRequestOperationalFactorsData(app, filters, indicatorId, type)
  console.log("FACTORS FINISHED", type, factors);
  return factors; 
}
