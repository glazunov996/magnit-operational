async function requestGetVariable(app, variableName){
  return new Promise( (resolve, reject) => {
    app.createCube({
      "qInitialDataFetch": [ {"qHeight": 20,	"qWidth": 6	}	],
      "qDimensions": [
        {
          "qDef": {
            "qFieldDefs": [
              "="+variableName
            ]
          }
        }
      ]
    }, reply => resolve({ reply, app }))
    .then(model => model.close());
  })
}

export function requestSetVariable(app, variableName, variableValue) {
  console.log("qlikRequestPrecisionUpdate", variableName, variableValue);
  return app.variable.setStringValue(variableName, `${variableValue}`);
}

export async function qlikRequestPrecisions(app) {
  const variables = [
    'vPeriod',
    'vPeriodDiagram',
    'vPeriodUnit1',
    'vMatchShop'
  ]
  const results = await Promise.all(variables.map(variable => 
    requestGetVariable(app, variable).then(({reply}) => reply.qHyperCube.qDataPages[0].qMatrix[0][0])
  ));
  return {
    columnPrecision: results[0].qNum,
    graphPrecision: results[1].qNum,
    periodUnit1: results[2].qNum,
    matchShop: results[3].qText
  }
}

export async function qlikRequestPrecisionsUpdate(app, precisions) {
  return Promise.all(['vPeriod', 'vPeriodDiagram', 'vPeriodUnit1'].map((name, index) => requestSetVariable(app, name, precisions[index])));
}