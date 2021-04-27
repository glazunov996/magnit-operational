import { qlikRequestDates, qlikRequestDatesUpdate } from './dates';
import { qlikRequestFilterState, qlikRequestFiltersUpdate } from './filter';
import { qlikRequestPrecisions, qlikRequestPrecisionsUpdate } from './precision';

//запрос настройки для экспорта данных
async function requestExportState(app){
  return new Promise((resolve, reject) => {
    app.createCube({
      "qInitialDataFetch": [ {"qHeight": 20,	"qWidth": 1	} ],
      "qDimensions": [ { 	"qDef": {	"qFieldDefs": [	"=export_excel"	]},	"qNullSuppression": true,	}	],
      "qMeasures": [],
      "qSuppressZero": true, "qSuppressMissing": true,
      "qMode": "S",
      "qInterColumnSortOrder": [],
      "qStateName": "$"
    }, (reply, app) => resolve({reply, app}) ).then( model => model.close());
  })
}

// загрузка конфигурации для экспорта 
async function loadExportConfig(app) {
	return requestExportState(app)
		.then( ({reply}) => {
      console.log("REPLY", reply)
			const exportDataConfigStr = reply.qHyperCube.qDataPages[0].qMatrix[0][0].qText;
			processExportConfig(exportDataConfigStr);
  })
}

function processExportConfig(exportConfigStr) {
	console.log('parse exportConfig', exportConfigStr);
	return exportConfigStr && exportConfigStr.split('.') || [];
}

// применение настроек экспорта
async function applyExportConfig(app, exportConfigStr) {
  console.log("applyExportConfig", 'export_excel', exportConfigStr)
	return app.variable.setStringValue('export_excel', exportConfigStr)
}
// выгрузка в excel
async function downloadExcel(app) {
  try {
    const model = await app.getObject('QV1', 'HWYCxz')
    const reply = await model.exportData();
    return reply.qUrl;
  } catch (e) {
    console.error('error whle export to excel', e)
  }
}

function zipFinancialExport(data, filter, precision, dates) {
  const exportData = {
    dates,
    filter,
    precision,
    export: data,
  };
  return exportData;
}

export async function qlikRequestOperationalExportData(app) {
  const dates = await qlikRequestDates(app);
  const filter = await qlikRequestFilterState(app);
  const precision = await qlikRequestPrecisions(app);
  const data = await loadExportConfig(app);
  console.log("loadExportConfig", data)
  const exportData = zipFinancialExport(data, filter, precision, dates);
  console.log("EXPORT DATA", exportData);
  return exportData;
}

export async function qlikRequestOperationalExport(app, config, filters, prevFilters) {
  console.log("qlikRequestOperationalExport", config, filters, prevFilters)
  await qlikRequestFiltersUpdate(app, filters);
  await applyExportConfig(app, config);
  const data = await downloadExcel(app);
  console.log("downloadExcel", data);
  await qlikRequestFiltersUpdate(app, prevFilters);
  return Promise.resolve(data);
}
