
function dateFromString(str) {
  const parts = str.split('.');
  if (parts.length !== 3) return null;
  return new Date(parseInt(parts[2], 10), parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
}

function pad(value) {
  return value < 10 ? `0${value}` : `${value}`;
}

function dateToString(date) {
  return `${date.getFullYear()}` + pad(date.getMonth() + 1) + pad(date.getDate());
}

async function requestGetDatesCalendar1(app){
  return new Promise( (resolve, reject) => {
    app.createCube({
    "qInitialDataFetch": [ { "qHeight": 2000, "qWidth": 4	}	],
    "qDimensions": [
      {	"qDef": {	"qFieldDefs": [	"Дата"	],	"qSortCriterias": [{	"qSortByAscii": 1,	}],	},	"qNullSuppression": true, "qShowAll": true	},
      {	"qDef": {	"qFieldDefs": [	"День_факт"	] }, "qNullSuppression": false,	},
      {	"qDef": {	"qFieldDefs": [	"Неделя_факт" ]	},	"qNullSuppression": false,	},
    ],
    "qMeasures": [ 
      { "qLabel": "Мера_календарь", "qLibraryId": "tVnGjXJ" }
    ],
    "qSuppressZero": false,
    "qSuppressMissing": false,
    "qMode": "S",
    "qInterColumnSortOrder": [],
    "qStateName": "$",
    }, (reply, app) => {
      const matrix = reply.qHyperCube.qDataPages[0].qMatrix;
      const items = [];
      matrix.forEach( row => {
        let selected = row[0].qState == 'S' ? true : false ;
        let disabled  = row[0].qState == 'X' ? true: false ;
        const date = dateFromString(row[0].qText);
        if (date) {
          items.push({
            name: row[0].qText,
            label: dateToString(date),
            picked: selected,
            number: row[0].qNum,
            disabled: disabled,
            dateDataExist: !isNaN(row[1].qNum),
            weekDataExist: !isNaN(row[2].qNum),
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            day: date.getDate(),
          });
        }
      })
      resolve(items);
    }).then ( model => model.close());	
  })
}

async function requestGetDatesCalendar2(app){
  return new Promise( (resolve, reject) => {
    app.createCube({
    "qInitialDataFetch": [ { "qHeight": 2000, "qWidth": 3	}	],
    "qDimensions": [
      {	"qDef": {	"qFieldDefs": [	"Дата"	],	"qSortCriterias": [{	"qSortByAscii": 1,	}],	},	"qNullSuppression": true, "qShowAll": true	},
      {	"qDef": {	"qFieldDefs": [	"День_факт"	] }, "qNullSuppression": false,	},
      {	"qDef": {	"qFieldDefs": [	"Неделя_факт" ]	},	"qNullSuppression": false,	},
    ],
    "qMeasures": [ 
      { "qLabel": "Мера_календарь", "qLibraryId": "tVnGjXJ" }
    ],
    "qSuppressZero": false,
    "qSuppressMissing": true,
    "qMode": "S",
    "qInterColumnSortOrder": [],
    "qStateName": "State2",
    }, (reply, app) => {
      const matrix = reply.qHyperCube.qDataPages[0].qMatrix;
      const items = [];
      matrix.forEach( row => {
        let selected = row[0].qState == 'S' ? true : false ;
        let disabled  = row[0].qState == 'X' ? true: false ;
        const date = dateFromString(row[0].qText);
        if (date) {
          items.push({
            name: row[0].qText,
            label: dateToString(date),
            picked: selected,
            number: row[0].qNum,
            disabled: disabled,
            dateDataExist: !isNaN(row[1].qNum),
            weekDataExist: !isNaN(row[2].qNum),
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            day: date.getDate(),
          });
        }
      })
      resolve(items);
    }).then ( model => model.close());	
  })
}

async function applyCalendarDates(app, dateItems, state = '$'){
  try {
    console.log("applyCalendarDates", dateItems);
    const dates = dateItems.map(it => it.number)
    const field = app.field('Дата', state);
    await field.clear();
    await field.selectValues(dates, true, true)
  } catch (e) {
    console.error('applyCalendarDates error', e)
  }
}

export async function qlikRequestDates(app) {
  const data = await Promise.all([
    requestGetDatesCalendar1(app),
    requestGetDatesCalendar2(app)
  ]);
  console.log("qlikRequestDates", data)
  return data;
}

export async function qlikRequestDatesUpdate(app, date, datePoP) {
  await Promise.all([
    applyCalendarDates(app, date),
    applyCalendarDates(app, datePoP, 'State2'),
  ])
}