import { default as precisionRequestConfig } from 'configs/requests/financial/precision.json';

function processPrecisionRawData(response) {
  const matrix = response.qHyperCube.qDataPages[0].qMatrix;
  const vPeriod = matrix[0][0].qNum;
  const vPeriodDiagram = matrix[0][1].qNum;
  const vAbsFlag = matrix[0][2].qNum; 
  const vPeriodUnit1 = matrix[0][3].qNum;
  const vMatchShop = matrix[0][4].qText;
  const data = { 
    columnPrecision: vPeriod, 
    graphPrecision: vPeriodDiagram, 
    absFlag: vAbsFlag,
    periodUnit1: vPeriodUnit1,
    matchShop: vMatchShop
  };
  return data;
}

function qlikRequestPrecisionData(app) {
  return new Promise((resolve) => { app.createCube(precisionRequestConfig, resolve).then(e => e.close()); });
}

export async function qlikRequestPrecisions(app) {
  const data = await qlikRequestPrecisionData(app)
    .then(processPrecisionRawData);
  return data;
}

export function qlikRequestPrecisionUpdate(name, app, value) {
  return app.variable.setStringValue(name, `${value}`);
}

export function qlikRequestPrecisionsUpdate(app, precisions) {
  return Promise.all(['vPeriod', 'vPeriodDiagram'].map((name, index) => qlikRequestPrecisionUpdate(name, app, precisions[index])));
}
