async function requestGetFilterData(app, fieldName){
  return new Promise( (resolve, reject) => {
    app.field(fieldName).getData({ rows: 10000}).OnData.bind(function listener(){
      this.OnData.unbind(listener);
      const items = [];
      this.rows.forEach( row =>{
        let selected = row.qState === 'S';
        let disabled  = row.qState === 'X';
        items.push({
          label: row.qText,
          value: row.qText,
          picked: selected,
          disabled: disabled
        });
      });
      resolve({
        key: fieldName,
        data: items
      })
    });
  })
}

//запрос на оставшие магазины
async function requestGetRemainingShops(app, countRowsInCube, countRowsInFilter ){
	//console.info(countRowsInCube, countRowsInFilter );
	// кол-во запросов
	const countRequests = Math.ceil( (countRowsInFilter - countRowsInCube) / countRowsInCube);
	//console.log('count request for remaining shops: ', countRequests);
	// массив запросов
	const requests = [];
	for(let i=1; i<=countRequests; i++  ){
		const areaConfig = {
			qTop: countRowsInCube * i
		}
		requests.push(requestGetFilterShops(app, areaConfig))
	}
	return Promise.all(requests)
}

// запрос по фильтру магазин
async function requestGetFilterShops(app, areaConfig){
	const qTop = areaConfig && areaConfig.qTop || 0;
	const qLeft = areaConfig && areaConfig.qLeft || 0;
	return new Promise(resolve => {
		app.createCube({ 
			"qInitialDataFetch": [
				{
					"qHeight": 10000 / 2,
					"qWidth": 2,
					"qTop": qTop || 0 ,
					"qLeft": qLeft || 0,
				}
			],
			"qDimensions": [
				{
					"qDef": {
						"qFieldDefs": [
							"WHS_NAME"
						],
						//СОРТИРОВКА
						"qSortCriterias": [{
							"qSortByAscii": -1,
						}],
					},
					"qNullSuppression": true,
				}
			],
			"qMeasures": [
				{
					"qLabel": "Мера_магазин",
					"qLibraryId": "dabaa953-b752-4391-b7d3-46e9a9f79726",
				}
			],
			"qSuppressZero": false,
			"qSuppressMissing": false,
			"qMode": "S",
			"qInterColumnSortOrder": [],
			"qStateName": "$"
			}, reply => resolve({reply, name}))
			.then(model => model.close());
	})
}

// обработка
function processFilterShop(reply){
	const matrix = reply.qHyperCube.qDataPages[0].qMatrix;
	const items = [];
	matrix.forEach( row => {
		let item = {
			label: row[0].qText,
      value: row[0].qText,
      picked: row[0].qState == 'S' ? true : false ,
      disable: row[0].qState == 'X' ? true: false ,
		}
		items.push(item)
	})
	return items;
}

// получение магазинов
// запрашиваем все магазины 
export async function requestFilterShop(app, fieldName) {
  return await requestGetFilterShops(app)
    .then( async ({reply}) => {
      const countRowsInFilter = reply.qHyperCube.qSize.qcy;
      const countRowsInCube = reply.qHyperCube.qDataPages[0].qArea.qHeight;
      //console.log('max count', countRowsInCube, countRowsInFilter);

      const items = processFilterShop(reply);
      //console.log('first Shops', items);

      // загружены не все данные, то дозагрузить остальные
      if(countRowsInCube < countRowsInFilter ){
        // запрос на все остальные магазины
        const results = await requestGetRemainingShops(app, countRowsInCube, countRowsInFilter );
        results.forEach( ( {reply}) => {
          let data = processFilterShop(reply);
          items.splice(0,0, ...data)
        })
      }
      return {
        key: fieldName,
        data: items
      };
  })
}

async function applyFilter(app, fieldName, filterValues, state = '$'){
  try {
    const field = app.field(fieldName, state);
    await field.clear();
    await field.selectValues(filterValues, true, true); 
  } catch (e) {
    console.error('applyFilter error', e)
  }
}

export async function qlikRequestFilterState(app) {
  const filters = [
    'FRMT', 
    'SUBFRMT', 
    'REGION', 
    'BRANCH', 
    'ART_GRP_LVL_0_NAME',
    'ТУ',
    'СВ',  
    'WHS_NAME'  
  ]
  const data = await Promise.all(filters.map(fieldName => {
    if (fieldName === 'WHS_NAME')
      return requestFilterShop(app, fieldName);
    return requestGetFilterData(app, fieldName);
  }));
  return data;
}

export async function qlikRequestFiltersUpdate(app, conditions) {
  const entries = Object.entries(conditions);
  for (const item of entries) await applyFilter(app, item[0], item[1]);
}