(function () {
  'use strict';

  const id = "8677b8be-b9f4-479f-8e1d-0727bda5ee75";
  const connection = {
  	host: "qsense.corp.tander.ru",
  	isSecure: true,
  	prefix: "/dev/",
  	port: 443
  };
  const indicators = "DESCRIPTION7";
  var config = {
  	id: id,
  	connection: connection,
  	indicators: indicators
  };

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
        });
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
        });
        resolve(items);
      }).then ( model => model.close());	
    })
  }

  async function applyCalendarDates(app, dateItems, state = '$'){
    try {
      console.log("applyCalendarDates", dateItems);
      const dates = dateItems.map(it => it.number);
      const field = app.field('Дата', state);
      await field.clear();
      await field.selectValues(dates, true, true);
    } catch (e) {
      console.error('applyCalendarDates error', e);
    }
  }

  async function qlikRequestDates(app) {
    const data = await Promise.all([
      requestGetDatesCalendar1(app),
      requestGetDatesCalendar2(app)
    ]);
    console.log("qlikRequestDates", data);
    return data;
  }

  async function qlikRequestDatesUpdate(app, date, datePoP) {
    await Promise.all([
      applyCalendarDates(app, date),
      applyCalendarDates(app, datePoP, 'State2'),
    ]);
  }

  // JavaScript
  const chartsForIndicatorsMainTable = {
  	extraDimensions: {
  		period: {
  			"qLabel": "График.Период",
  			"qLibraryId": "WAGyz",
  			"qNullSuppression": true,
  			//СОРТИРОВКА
  			"qDef" : {
  				"qSortCriterias": [{
  					"qSortByNumeric": 1,
  				}],
  			}
  		}
  	},
  	items: [
  		{
  			name: "РТО",
  			id: 1,
  			dimension: { 
  				"qLabel": "РТО_ID",
  				"qLibraryId": "RtPTYEw",
  			},
  			fact: {
  				"qLabel": "График.РТО_тп",
  				"qLibraryId": "VqSKVKW",
  			},
  			factPp: {
  				"qLabel": "График.РТО_пп",
  				"qLibraryId": "VBbCpq",
  			},
  			vsFactPp: {
  				"qLabel": "График.РТО_тпVSРТО_пп",
  				"qLibraryId": "mGktGX",
  			},
  			budget: {
  				"qLabel": "График.РТО_план",
  				"qLibraryId": "CMdSAMA",
  			},
  			vsBudget: {
  				"qLabel": "График.РТО_тпVSРТО_план",
  				"qLibraryId": "BAFQYkj",
  			},
  			vsFactPpAbsolute: {
  				"qLabel": "График.РТО_тпVSРТО_пп_абс",
  				"qLibraryId": "bc21e0a4-1e10-4643-8c4a-c8d58ffd625e",
  			},
  			vsBudgetAbsolute: {
  				"qLabel": "График.РТО_тпVSРТО_план_абс",
  				"qLibraryId": "649ce540-35c2-4c12-b7ac-2618687ee4ff"
  			}
  		},
  		{
  			name: "RTOLFL",
  			id: 2,
  			dimension: { 
  				"qLabel": "РТОLFL_ID",
  				"qLibraryId": "459dcf74-f021-4a5e-8cb6-d048b956bb88",
  			},
  			fact: {
  				"qLabel": "График.РТОLFL",
  				"qLibraryId": "5c39d97f-81b0-43a8-ac3e-9741576d906b",
  			},
  			factPp: {
  				"qLabel": "График.РТОLFL_пп",
  				"qLibraryId": "2db7eb36-3038-448a-80e9-e908a6198b3b",
  			},
  			vsFactPp: {
  				"qLabel": "График.РТОLFL_тпVSпп",
  				"qLibraryId": "12a13861-c87f-4da6-b1c5-a53204157071",
  			}
  		},
  		{
  			name: "Себестоимость",
  			id: 3,
  			dimension: {
  				"qLabel": "Себестоимость_ID",
  				"qLibraryId": "24a1037d-9237-4b28-ac91-0a141f574c5e",
  			},
  			fact: {
  				"qLabel": "График.РТО_себест_тп",
  				"qLibraryId": "a9032c3b-0880-412f-9476-8b9fa023da2b",
  			},
  			factPp: {
  				"qLabel": "График.РТО_себест_пп",
  				"qLibraryId": "a89e2d33-c483-40d7-bb6e-053361a14c07",
  			},
  			vsFactPp: {
  				"qLabel": "График.РТО_себест_тпVSпп",
  				"qLibraryId": "84d96776-f539-4446-ae03-802a68dc0156",
  			},
  			vsFactPpAbsolute: {
  				"qLabel": "График.РТО_себест_тпVSпп_абс",
  				"qLibraryId": "61d426a3-68d3-4312-ad09-cba72e7e5451",
  			}
  		},
  		{
  			name: "Средний Чек",
  			id: 4,
  			dimension: {
  				"qLabel": "СреднийЧек_ID",
  				"qLibraryId": "9b0d4c14-3440-4460-8d73-52dea5bcc672",
  			},
  			fact: {
  				"qLabel": "График.СреднийЧек_тп",
  				"qLibraryId": "FdLtpt",
  			},
  			factPp: {
  				"qLabel": "График.СреднийЧек_пп",
  				"qLibraryId": "17e680ef-e143-4f4f-ad71-e2af4aa5ab32",
  			},
  			vsFactPp: {
  				"qLabel": "График.СреднийЧек_тпVSСреднийЧек_пп",
  				"qLibraryId": "94e8c5c3-8f8d-4acf-84a2-4c1e6b5fcd79",
  			},
  			vsFactPpAbsolute: {
  				"qLabel": "График.СреднийЧек_тпVSСреднийЧек_пп_абс",
  				"qLibraryId": "a21be5fe-3d33-4d0b-8ff2-724c4302b4db",
  			}
  		},
  		{
  			name: "Средний чек LFL",
  			id: 5,
  			dimension: {
  				"qLabel": "СреднийЧекLFL_ID",
  				"qLibraryId": "433f93fb-9972-4c3a-8a53-32e46d46dd01",
  			},
  			fact: {
  				"qLabel": "График.СреднийЧекLFL",
  				"qLibraryId": "BKEtGjA",
  			},
  			factPp: {
  				"qLabel": "График.СреднийЧекLFL_пп",
  				"qLibraryId": "9b852ab5-8d0d-4df8-a9dc-934087382e59",
  			},
  			vsFactPp: {
  				"qLabel": "График.СреднийЧекLFL_тпVSпп",
  				"qLibraryId": "a71bbf3d-32b6-4b9e-a7ba-64f3cf2e916d",
  			}
  		},
  		{
  			name: "Комплексность",
  			id: 6,
  			dimension: {
  				"qLabel": "Комплексность",
  				"qLibraryId": "f9a79df6-a794-4375-b512-e65228f4e28c",
  			},
  			fact: {
  				"qLabel": "График.СреднееКоличествоТоваровВЧеке",
  				"qLibraryId": "f4eced8e-0858-47e4-a143-28f752c77564",
  			},
  			factPp: {
  				"qLabel": "График.СреднееКоличествоТоваровВЧеке_пп",
  				"qLibraryId": "91b9e982-924b-43dd-b7e0-e15b4d266bea",
  			},
  			vsFactPp: {
  				"qLabel": "График.СреднееКоличествоТоваровВЧеке_тпVSпп",
  				"qLibraryId": "55b32bb3-2fb8-4254-b091-07f7e9bfa1b7",
  			},
  			vsFactPpAbsolute: {
  				"qLabel": "График.СреднееКоличествоТоваровВЧеке_тпVSпп_абс",
  				"qLibraryId": "a727db21-0bc2-4bcf-b00c-4300fdbf48bd",
  			}
  		},
  		{
  			name: "Трафик",
  			id: 7,
  			dimension: {
  				"qLabel": "Траффик_ID",
  				"qLibraryId": "f0f34b78-3091-472d-9f74-79d8e15bb535",
  			},
  			fact: {
  				"qLabel": "График.Трафик_тп",
  				"qLibraryId": "5a2c90df-0a4f-41a1-9632-133fedfdbd52",
  			},
  			factPp: {
  				"qLabel": "График.Трафик_пп",
  				"qLibraryId": "127ed1ef-2bf3-4ce5-9191-6eb86a1dc1bc",
  			},
  			vsFactPp: {
  				"qLabel": "График.Трафик_тпVSТрафик_пп",
  				"qLibraryId": "3bcc8aee-bcc1-4524-9dff-cb6283055042",
  			},
  			vsFactPpAbsolute: {
  				"qLabel": "График.Трафик_тпVSТрафик_пп_абс",
  				"qLibraryId": "2b00fb8f-6a6f-4a85-9e93-88fada2f6355",
  			}
  		},
  		{
  			name: "Трафик LFL",
  			id: 8,
  			dimension: {
  				"qLabel": "ТрафикLFL_ID",
  				"qLibraryId": "c74b9950-9d5c-4f1d-8479-45174cd186d1",
  			},
  			fact: {
  				"qLabel": "График.ТрафикLFL",
  				"qLibraryId": "35ae3406-f19a-431d-a9e2-a4fd1aff7518",
  			},
  			factPp: {
  				"qLabel": "График.ТрафикLFL_пп",
  				"qLibraryId": "605a0bd6-316a-41eb-b2e4-06e1123d3c36",
  			},
  			vsFactPp: {
  				"qLabel": "График.ТрафикLFL_тпVSпп",
  				"qLibraryId": "89ee1194-9d41-4710-ad13-8b7852bfed3e",
  			}
  		},
  		{
  			name: "Колич объектов",
  			id: 9,
  			dimension: {
  				"qLabel": "КоличОбъектов_ID",
  				"qLibraryId": "3959a379-5ab4-4954-afdc-bc81ba136bf2",
  			},
  			fact: {
  				"qLabel": "График.КоличОбъектов_тп",
  				"qLibraryId": "adfad6b2-1abe-482a-9666-5c3c098e294b",
  			},
  			factPp: {
  				"qLabel": "График.КоличОбъектов_пп",
  				"qLibraryId": "8ec5b91e-ed75-4873-a54a-45f3f7b29f53",
  			},
  			vsFactPp: {
  				"qLabel": "График.КоличОбъектов_тпVSпп",
  				"qLibraryId": "d4406829-fafb-4d9a-b7b7-f7d10ecfac9c",
  			},
  			vsFactPpAbsolute: {
  				"qLabel": "График.КоличОбъектов_тпVSпп_абс",
  				"qLibraryId": "8f1af9f8-e894-4fd3-bcca-ca23881632f4",
  			}
  		},
  		{
  			name: "Колич закрытых объектов",
  			id: 10,
  			dimension: {
  				"qLabel": "КоличЗакрытыхОбъектов_ID",
  				"qLibraryId": "eebf57bb-1932-4e35-9450-fb0b2c1496a6",
  			},
  			fact: {
  				"qLabel": "График.КолЗакрТО_тп",
  				"qLibraryId": "fb94303f-a15d-49d9-b076-56cd6f8147de",
  			},
  			factPp: {
  				"qLabel": "График.КолЗакрТО_пп",
  				"qLibraryId": "cccdf94c-5167-472d-812d-cb447f3fa478",
  			},
  			vsFactPp: {
  				"qLabel": "График.КолЗакрТО_тпVSпп",
  				"qLibraryId": "1dcab009-a0c6-44c3-ac04-5e727f23bebb",
  			},
  			vsFactPpAbsolute: {
  				"qLabel": "График.КолЗакрТО_тпVSпп_абс",
  				"qLibraryId": "4b053d02-7bf9-484e-b1b6-07243c05a78a",
  			}
  		},
  		{	
  			name: "ТЗ",
  			id: 11,
  			dimension: {
  				"qLabel": "ТЗ_ID",
  				"qLibraryId": "72049865-d9cd-4750-abf9-f43b4bc1f4e5",
  			},
  			fact: {
  				"qLabel": "График.Остатки_тп",
  				"qLibraryId": "42a020c8-fd21-466f-9023-6e889ed739fa",
  			},
  			factPp: {
  				"qLabel": "График.Остатки_пп",
  				"qLibraryId": "6ecca231-a456-499d-94fc-33d700c5b027",
  			},
  			vsFactPp: {
  				"qLabel": "График.Остатки_тпVSпп",
  				"qLibraryId": "874bbf79-c159-4980-9406-47bbb7a7ede3",
  			},
  			vsFactPpAbsolute: {
  				"qLabel": "График.Остатки_тпVSпп_абс",
  				"qLibraryId": "068af5de-af3e-4601-bbb8-70eb79062ae7",
  			}
  		},
  		{
  			name: "Оборачиваемость",
  			id: 12,
  			dimension: {
  				"qLabel": "Оборачиваемость_ID",
  				"qLibraryId": "b84a7ff7-0d4b-42ae-8401-dd8924fa0734",
  			},
  			fact: {
  				"qLabel": "График.Оборачиваемость_тп",
  				"qLibraryId": "3c479269-d87d-4c23-aa8d-85d6333665d3",
  			},
  			factPp: {
  				"qLabel": "График.Оборачиваемость_пп",
  				"qLibraryId": "4018f5f8-da62-43a8-831c-2a7efeb0131c",
  			},
  			vsFactPp: {
  				"qLabel": "График.Оборачиваемость_тпVSпп",
  				"qLibraryId": "cb535bda-31a5-401b-bd85-72300d25ce01",
  			},
  			vsFactPpAbsolute: {
  				"qLabel": "График.Оборачиваемость_тпVSпп_абс",
  				"qLibraryId": "a376fb8d-8b6c-43b2-8dec-54d6a85e6a87",
  			}
  		},
  		{
  			name: "Уровень сервиса РЦ",
  			id: 13,
  			dimension: {
  				"qLabel": "УСРЦ_ID",
  				"qLibraryId": "71f10a9d-c667-4750-9ad7-5eaf358678db",
  			},
  			fact: {
  				"qLabel": "График.УСРЦ_тп",
  				"qLibraryId": "1799557d-134a-4d1e-bb3d-d9b4e87b779a",
  			},
  			factPp: {
  				"qLabel": "График.УСРЦ_пп",
  				"qLibraryId": "c58cd475-9671-43d4-9e33-dbd61af4646b",
  			},
  			vsFactPp: {
  				"qLabel": "График.УСРЦ_тпVSУСРЦ_пп",
  				"qLibraryId": "e37b81b1-12a6-4c6d-b17d-5afce235d607",
  			}
  		},
  		{
  			name: "Уровень сервиса поставщиков",
  			id: 14,
  			dimension: {
  				"qLabel": "УСПоставщиков_ID",
  				"qLibraryId": "34b6eb40-7a42-49cd-a1c2-be530a7c94fd",
  			},
  			fact: {
  				"qLabel": "График.УровеньСервисаПоставщиков_тп",
  				"qLibraryId": "e7e29b5a-e5dd-4f20-87b5-0fe0238b9fb7",
  			},
  			factPp: {
  				"qLabel": "График.УровеньСервисаПоставщиков_пп",
  				"qLibraryId": "ec1ca8d4-545e-4c61-99be-11da1e5fc121",
  			},
  			vsFactPp: {
  				"qLabel": "График.УровеньСервисаПоставщиков_тпVSпп",
  				"qLibraryId": "e5d1fb41-6e66-4ca9-bf77-c6db7fe7d7b6",
  			}
  		},
  		{
  			name: "Потери к выручке",
  			id: 15,
  			dimension: {
  				"qLabel": "ПотериКВыручке_ID",
  				"qLibraryId": "89f410b6-c001-45ee-9eaa-cb5165a7ffd6",
  			},
  			fact: {
  				"qLabel": "График.ПотериКВыручке_тп",
  				"qLibraryId": "2e73b37d-e73f-40a3-bded-f86331f0644f",
  			},
  			factPp: {
  				"qLabel": "График.ПотериКВыручке_пп",
  				"qLibraryId": "7b6f6846-0dcf-409a-9e36-93959a58c8b3",
  			},
  			vsFactPp: {
  				"qLabel": "График.ПотериКВыручке_тпVSПотериКВыручке_пп",
  				"qLibraryId": "3f312b58-0542-4754-b63a-0759c204f950"
  			}
  		},
  		{
  			name: "Потери к себестоимости",
  			id: 16,
  			dimension: {
  				"qLabel": "ПотериКСебестоимости_ID",
  				"qLibraryId": "902649c5-029f-428a-9d43-50004903bf8d",
  			},
  			fact: {
  				"qLabel": "График.ПотериКСебестоимости_тп",
  				"qLibraryId": "df7215eb-69ba-4b82-8776-5aaae80a55e0",
  			},
  			factPp: {
  				"qLabel": "График.ПотериКСебестоимости_пп",
  				"qLibraryId": "915a300f-7e30-493f-b65c-8b299e87159c",
  			},
  			vsFactPp: {
  				"qLabel": "График.ПотериКСебестоимости_тпVSПотериКСебестоимости_пп",
  				"qLibraryId": "1b0303f8-4d01-4ee2-b275-0e99b62fda55",
  			}
  		},
  		{
  			name: "Потери АБС",
  			id: 17,
  			dimension: {
  				"qLabel": "ПотериАБС_ID",
  				"qLibraryId": "d493215d-547f-4229-8936-75d5e7b46692",
  			},	
  			fact: {
  				"qLabel": "График.ПотериАбс_тп",
  				"qLibraryId": "970f1159-e3d1-4569-9d9f-059a7f780957",
  			},
  			factPp: {
  				"qLabel": "График.ПотериАбс_пп",
  				"qLibraryId": "8e445466-6b92-4fa2-be17-f155d1efb823",
  			},
  			vsFactPp: {
  				"qLabel": "График.ПотериАбс_тпVSПотериАбс_пп",
  				"qLibraryId": "6edfadbd-4ac4-4bd8-b5e9-05b6fff6aa99",
  			},
  			vsFactPpAbsolute: {
  				"qLabel": "График.ПотериАбс_тпVSПотериАбс_пп_абс",
  				"qLibraryId": "6be2888b-c190-4510-a8fc-302b458c8bf9",
  			}
  		},
  		{
  			name: "Потери ШТ",
  			id: 18,
  			dimension: {
  				"qLabel": "ПотериШт_ID",
  				"qLibraryId": "0fe72fe1-4868-4a7f-a370-66b0cd5c3652",
  			},
  			fact: {
  				"qLabel": "График.ПотериШт_тп",
  				"qLibraryId": "3fac39b2-4556-4abf-aab9-c2fdfade28ff",
  			},
  			factPp: {
  				"qLabel": "График.ПотериШт_пп",
  				"qLibraryId": "e7d6d407-e75a-41f6-a08d-0167c831f2a8",
  			},
  			vsFactPp: {
  				"qLabel": "График.ПотериШт_тпVSПотериШт_пп",
  				"qLibraryId": "8cf52c98-392c-447e-abd1-d96ccea5b63d",
  			},
  			vsFactPpAbsolute: {
  				"qLabel": "График.ПотериШт_тпVSПотериШт_пп_абс",
  				"qLibraryId": "83fef2fd-2776-4f62-b15e-3dc13f7373d3",
  			}
  		},
  		{
  			name: "Ассортимент",
  			id: 19,
  			dimension: {
  				"qLabel": "Ассортимент_ID",
  				"qLibraryId": "e6cc53a5-fd91-431e-8ddd-52703d0a728d",
  			},
  			fact: {
  				"qLabel": "График.Кол-воСКЮВАссортименте_тп",
  				"qLibraryId": "e7998f34-c017-4f7e-917a-235a8cebcb57",
  			},
  			factPp: {
  				"qLabel": "График.Кол-воСКЮВАссортименте_пп",
  				"qLibraryId": "b62d5dbc-e6b8-4ba7-9f62-0dde06793b61",
  			},
  			vsFactPp: {
  				"qLabel": "График.Кол-воСКЮВАссортименте_тпVSпп",
  				"qLibraryId": "625cfea5-fa16-4abf-825e-603e82c9a282",
  			},
  			vsFactPpAbsolute: {
  				"qLabel": "График.Кол-воСКЮВАссортименте_тпVSпп_абс",
  				"qLibraryId": "d7e0e177-8c14-41f8-a325-d723a43e1c6c",
  			}
  		},
  		{
  			name: "Инфляция",
  			id: 20,
  			dimension: {
  				"qLabel": "Инфляция_ID",
  				"qLibraryId": "b5c2c683-13d9-4047-8220-e07f6b555afd",
  			},
  			fact: {
  				"qLabel": "График.Инфляция",
  				"qLibraryId": "ba517da2-85ea-404f-97b6-e77bba226ea9",
  			},
  			factPp: {
  				"qLabel": "График.Инфляция_пп",
  				"qLibraryId": "96959888-5f1d-4259-8444-6a870c262f49",
  			},
  			vsFactPp: {
  				"qLabel": "График.Инфляция_тпVSпп",
  				"qLibraryId": "e4700a7c-a180-43b9-826a-9c0a0f208c34",
  			}
  		},
  		{
  			name: "Доступ по остаткам",
  			id: 21,
  			dimension: {
  				"qLabel": "ДоступПоОстаткам_ID",
  				"qLibraryId": "4edaaa7c-baad-4046-98c1-edcfdd67622f",
  			},
  			fact: {
  				"qLabel": "График.ДоступностьПоОстаткам_тп",
  				"qLibraryId": "ba5840fb-fdff-4972-88c1-e6f2cb1ed2ba",
  			},
  			factPp: {
  				"qLabel": "График.ДоступностьПоОстаткам_пп",
  				"qLibraryId": "bc887ae5-a074-48e0-9ac1-8b8e0bba41b7",
  			},
  			vsFactPp: {
  				"qLabel": "График.ДоступностьПоОстаткам_тпVSпп",
  				"qLibraryId": "f6566b78-ade4-4751-94c7-6fd682eed670",
  			}
  		},
  		{
  			name: "Доступ по продажам",
  			id: 22,
  			dimension: {
  				"qLabel": "ДоступПоПродажам_ID",
  				"qLibraryId": "66741b46-868c-446a-a63c-e10031a94d53",
  			},
  			fact: {
  				"qLabel": "График.ДоступностьПоПродажам_тп",
  				"qLibraryId": "14497088-13c8-4204-b188-e72bac0d9f99",
  			},
  			factPp: {
  				"qLabel": "График.ДоступностьПоПродажам_пп",
  				"qLibraryId": "c13200fe-c836-4f8a-90df-7071c48fb5f8",
  			},
  			vsFactPp: {
  				"qLabel": "График.ДоступностьПоПродажам_тпVSпп",
  				"qLibraryId": "10d0b0ca-0e13-43a9-8e0e-73dc7157da4a",
  			}
  		},
  		{
  			name: "Промо",
  			id: 23,
  			dimension: {
  				"qLabel": "Промо_ID",
  				"qLibraryId": "112b0ff8-2ad4-42be-b53d-88a946d0a57c",
  			},
  			fact: {
  				"qLabel": "График.ПродажиПромо_тп",
  				"qLibraryId": "0ad53857-a738-452e-a17d-31484b86225d",
  			},
  			factPp: {
  				"qLabel": "График.ПродажиПромо_пп",
  				"qLibraryId": "614d1c9b-e973-4e34-bebf-d237ba60ccde",
  			},
  			vsFactPp : {
  				"qLabel": "График.ПродажиПромо_тпVSПродажиПромо_пп",
  				"qLibraryId": "3b680d74-2391-40aa-a239-609ce5d46d3f",
  			}
  		},
  		{
  			name: "Front margin",
  			id: 24,
  			dimension: {
  				"qLabel": "FrontMargin_ID",
  				"qLibraryId": "AgMURp",
  			},
  			fact: {
  				"qLabel": "График.FrontMargin_тп",
  				"qLibraryId": "521e2ea2-963a-4f07-a680-5e5dc533c50f",
  			},
  			factPp: {
  				"qLabel": "График.FrontMargin_пп",
  				"qLibraryId": "f8946b83-55ed-4da7-8c64-a83f42fe7417",
  			},
  			vsFactPp: {
  				"qLabel": "График.FrontMargin_тпVSFrontMargin_пп",
  				"qLibraryId": "0e5a0ae4-24f1-4fa3-8f26-9db7733bfdbd",
  			}
  		},
  		{	
  			name: "Коммерческая маржа",
  			id: 25,
  			dimension: {
  				"qLabel": "КомМаржа_ID",
  				"qLibraryId": "435c1fe2-4c20-4c24-bfa8-2587fd9e1928",
  			},
  			fact: {
  				"qLabel": "График.КомМаржа_тп",
  				"qLibraryId": "94d09e34-d3f9-4662-a46e-5bc45a1cd4c1",
  			},
  			factPp: {
  				"qLabel": "График.КомМаржа_пп",
  				"qLibraryId": "f318d57a-ef8f-4f70-9ffc-0f85e1c6e6a2",
  			},
  			vsFactPp: {
  				"qLabel": "График.КомМаржа_тпVSКомМаржа_пп",
  				"qLibraryId": "88ece30b-a080-4a33-b03d-ee39ded8d59f",
  			}
  		},
  		{	
  			name: "РТОVSМониторинг",
  			id: 26,
  			dimension: {
  				"qLabel": "РТОVSМониторингу_ID",
  				"qLibraryId": "ff0b83e2-6cd3-481e-a799-dcb451e77454",
  			},
  			fact: {
  				"qLabel": "График.ДоляРТОПоМониторингу_тп",
  				"qLibraryId": "0922e98f-a21b-43e1-8184-c379c10c4553",
  			},
  			factPp: {
  				"qLabel": "График.ДоляРТОПоМониторингу_пп",
  				"qLibraryId": "11fe5e20-48db-41c9-9469-e77fce79b9f0",
  			},
  			vsFactPp: {
  				"qLabel": "График.ДоляРТОПоМониторингу_тпVSпп",
  				"qLibraryId": "4a98194e-eb14-490a-8ef4-dabf06326a36",
  			}
  		},
  		{
  			name: "РТОVSЛояльность",
  			id: 27,
  			dimension: {
  				"qLabel": "РТОVSЛояльность_ID",
  				"qLibraryId": "37cc4f2b-5700-4754-89ec-36ea188112ef",
  			},
  			fact: {
  				"qLabel": "График.ДоляРТОПоКартамЛояльности_тп",
  				"qLibraryId": "88cb5b41-1912-4203-b3e8-0028547622d0",
  			},
  			factPp: {
  				"qLabel": "График.ДоляРТОПоКартамЛояльности_пп",
  				"qLibraryId": "bf227f1e-3cb0-476b-b2e0-8b35f6edc095",
  			},
  			vsFactPp: {
  				"qLabel": "График.ДоляРТОПоКартамЛояльности_тпVSпп",
  				"qLibraryId": "93055f1c-85ff-4f6d-b6ff-943d159c083b",
  			}
  		},
  		{
  			name: "РТОVSУценка",
  			id: 28,
  			dimension: {
  				"qLabel": "РТОVSУценка_ID",
  				"qLibraryId": "pRpqjh",
  			},
  			fact: {
  				"qLabel": "График.ДоляРТОПоУценке_тп",
  				"qLibraryId": "16cf21b9-2346-4536-ae0a-b5562278e27c",
  			},
  			factPp: {
  				"qLabel": "График.ДоляРТОПоУценке_пп",
  				"qLibraryId": "dae693f9-f3ac-4789-8fc6-edd925e6d5b1",
  			},
  			vsFactPp: {
  				"qLabel": "График.ДоляРТОПоУценке_тпVSпп",
  				"qLibraryId": "267d5c19-ad75-4f80-ba3f-a957c58fa6e1",
  			}
  		},
  		{
  			name: "РТОVSПромо",
  			id: 29,
  			dimension: {
  				"qLabel": "РТОVSПромо_ID",
  				"qLibraryId": "a558b69a-a201-49b2-9b16-296964529e62",
  			},
  			fact: {
  				"qLabel": "График.ДоляРТОПоОснПромо_тп",
  				"qLibraryId": "21a7b94c-6d92-4f7d-9fe7-e02b49049a25",
  			},
  			factPp: {
  				"qLabel": "График.ДоляРТОПоОснПромо_пп",
  				"qLibraryId": "263aeeba-4e0d-426f-afd8-0928463605ad",
  			},
  			vsFactPp: {
  				"qLabel": "График.ДоляРТОПоОснПромо_тпVSпп",
  				"qLibraryId": "27f3e6db-e029-461f-ae0f-7d451d1dcd33",
  			}
  		},
  		{
  			name: "РТОVSРегулярная",
  			id: 30,
  			dimension: {
  				"qLabel": "РТОVSРегулярная_ID",
  				"qLibraryId": "b720fea3-d86b-460b-9cc4-02d95b3dc146",
  			},
  			fact: {
  				"qLabel": "График.ДоляРТОПоРегулярная_тп",
  				"qLibraryId": "2d19c3df-8262-4d6f-abc2-31e242d042df",
  			},
  			factPp: {
  				"qLabel": "График.ДоляРТОПоРегулярная_пп",
  				"qLibraryId": "6b1ffb74-0fe2-49a5-b3c6-e313bcd8c439",
  			},
  			vsFactPp: {
  				"qLabel": "График.ДоляРТОПоРегулярная_тпVSпп",
  				"qLibraryId": "a91ece15-23db-43d0-ad19-b6964900a86b",
  			}
  		},
  		{
  			name: "РТОVSПрочее",
  			id: 31,
  			dimension: {
  				"qLabel": "РТОVSПрочее_ID",
  				"qLibraryId": "eaa470fb-b87d-4e99-bddc-e39dca484848",
  			},
  			fact: {
  				"qLabel": "График.ДоляРТОПоПрочее_тп",
  				"qLibraryId": "0583faa7-f67a-4879-ad1d-f8c2186ca866",
  			},
  			factPp: {
  				"qLabel": "График.ДоляРТОПоПрочее_пп",
  				"qLibraryId": "0aa6ef73-be4b-42c2-8580-6cd92b4030dc",
  			},
  			vsFactPp: {
  				"qLabel": "График.ДоляРТОПоПрочее_тпVSпп",
  				"qLibraryId": "157646c9-3951-4a91-bc5f-63bb05dd792a",
  			}
  		},
  		{
  			name: "ВлияниеМониторинг",
  			id: 32,
  			dimension: {
  				"qLabel": "ВлияниеМониторинг_ID",
  				"qLibraryId": "576af43b-3362-4d01-a3a9-6b486f46bdc0",
  			},
  			fact: {
  				"qLabel": "График.ВлияниеМониторинг_тп",
  				"qLibraryId": "7fba831b-e97b-4fb2-a3a4-a3fb7e851d26",
  			},
  			factPp: {
  				"qLabel": "График.ВлияниеМониторинг_пп",
  				"qLibraryId": "c3ee1539-f0c4-4b9f-8e02-3fafff84f9f3",
  			},
  			vsFactPp: {
  				"qLabel": "График.ВлияниеМониторинг_тпVSпп",
  				"qLibraryId": "5db8e69b-0948-455b-9049-1be794119649",
  			}
  		},
  		{
  			name: "ВлияниеVSЛояльность",
  			id: 33,
  			dimension: {
  				"qLabel": "ВлияниеVSЛояльность_ID",
  				"qLibraryId": "4e94ef6e-0273-40d2-b2f0-63581f626b3b",
  			},
  			fact: {
  				"qLabel": "График.ВлияниеЛояльность_тп",
  				"qLibraryId": "ee0e09ab-d645-42a1-9728-6618e8b6d8bf",
  			},
  			factPp: {
  				"qLabel": "График.ВлияниеЛояльность_пп",
  				"qLibraryId": "52d1882f-a419-460e-8840-32ef156317fd",
  			},
  			vsFactPp: {
  				"qLabel": "График.ВлияниеЛояльность_тпVSпп",
  				"qLibraryId": "1bed437b-0e46-41c1-a160-183ab1968143",
  			}
  		},
  		{
  			name: "ВлияниеVSУценка",
  			id: 34,
  			dimension: {
  				"qLabel": "ВлияниеVSУценка_ID",
  				"qLibraryId": "30f0c8bf-017c-4b58-b040-3aa68b637607",
  			},
  			fact: {
  				"qLabel": "График.ВлияниеУценка_тп",
  				"qLibraryId": "d6aae6fb-28b6-4402-96e1-d1edfa87840f",
  			},
  			factPp: {
  				"qLabel": "График.ВлияниеУценка_пп",
  				"qLibraryId": "20381228-0c93-4f49-ae55-a0e0881320d7",
  			},
  			vsFactPp: {
  				"qLabel": "График.ВлияниеУценка_тпVSпп",
  				"qLibraryId": "abb65ce9-5fb9-4afd-ade7-314d663e6ccc",
  			}
  		},
  		{
  			name: "ВлияниеVSПромо",
  			id: 35,
  			dimension: {
  				"qLabel": "ВлияниеVSПромо_ID",
  				"qLibraryId": "68206c64-8b27-466f-8708-2e060d60b365",
  			},
  			fact: {
  				"qLabel": "График.ВлияниеОснПромо_тп",
  				"qLibraryId": "a7de9111-fa46-401b-9b24-f32eb0ce8cdc",
  			},
  			factPp: {
  				"qLabel": "График.ВлияниеОснПромо_пп",
  				"qLibraryId": "45381aa5-8454-498c-88ba-4ca2d2686a61",
  			},
  			vsFactPp: {
  				"qLabel": "График.ВлияниеОснПромо_тпVSпп",
  				"qLibraryId": "1bbb40b6-017f-47d0-87e7-7f9cf87c99c5",
  			}
  		},
  		{
  			name: "ВлияниеVSРегулярная",
  			id: 36,
  			dimension: {
  				"qLabel": "ВлияниеVSРегулярная_ID",
  				"qLibraryId": "5861a6c1-b658-435e-a5ba-38b7f7c6b6d7",
  			},
  			fact: {
  				"qLabel": "График.ВлияниеРегулярная_тп",
  				"qLibraryId": "ba78bd66-ebb1-42ce-bb89-d69156097028",
  			},
  			factPp: {
  				"qLabel": "График.ВлияниеРегулярная_пп",
  				"qLibraryId": "10411be0-a27c-446f-b5a5-c0ef74fe48bf",
  			},
  			vsFactPp: {
  				"qLabel": "График.ВлияниеРегулярная_тпVSпп",
  				"qLibraryId": "ad26cdce-93a6-4248-ad90-6f6246a72dcb",
  			}
  		},
  		{
  			name: "ВлияниеVSПрочее",
  			id: 37,
  			dimension: {
  				"qLabel": "ВлияниеVSПрочее_ID",
  				"qLibraryId": "XjyDMxn",
  			},
  			fact: {
  				"qLabel": "График.ВлияниеПрочее_тп",
  				"qLibraryId": "d0d063c4-8f11-4cdd-952b-bb9f5a5c7c9c",
  			},
  			factPp: {
  				"qLabel": "График.ВлияниеПрочее_пп",
  				"qLibraryId": "30df4905-d2ef-42c3-ba96-dd350b0cbdb5",
  			},
  			vsFactPp: {
  				"qLabel": "График.ВлияниеПрочее_тпVSпп",
  				"qLibraryId": "0fe5ab77-2876-4138-82ae-a1be03092f8e",
  			}
  		},
  		{
  			name: "ШтатнаяЧисленность",
  			id: 38,
  			dimension: {
  				"qLabel": "ШтатнаяЧисленность_ID",
  				"qLibraryId": "ad972d9c-1b37-43e5-8ea0-92439408f34c",
  			},
  			dimensionPeriod: {
  				"qLabel": "График.ПериодПерсонал",
  				"qLibraryId": "855d8342-82cd-4ae7-ab6d-41e2e8e4ef80",
  				"qNullSuppression": true,
  				//СОРТИРОВКА
  				"qDef" : {
  					"qSortCriterias": [{
  						"qSortByNumeric": 1,
  					}],
  				}
  			},
  			fact: {
  				"qLabel": "График.ШтатнаяЧисленность_тп",
  				"qLibraryId": "8c038df6-1e6b-432d-9101-7bd989301819",
  			},
  			factPp: {
  				"qLabel": "График.ШтатнаяЧисленность_пп",
  				"qLibraryId": "2f31038f-9206-4dee-8b7f-f5a0b81e8880",
  			},
  			vsFactPp: {
  				"qLabel": "График.ШтатнаяЧисленность_тпVSпп",
  				"qLibraryId": "1aeb9dbd-8786-438f-b101-91164c97ed95",
  			}, 
  			vsFactPpAbsolute: {
  				"qLabel": "График.ШтатнаяЧисленность_тпVSпп_абс",
  				"qLibraryId": "7cc039f7-895b-489b-9be3-d063aa6e0951",
  			}
  		},{
  			name: "ФактическаяЧисленность",
  			id: 39,
  			dimension: {
  				"qLabel": "ФактическаяЧисленность_ID",
  				"qLibraryId": "650eb754-3b73-40f9-86da-75fbc85b5f0c",
  			},
  			dimensionPeriod: {
  				"qLabel": "График.ПериодПерсонал",
  				"qLibraryId": "855d8342-82cd-4ae7-ab6d-41e2e8e4ef80",
  				"qNullSuppression": true,
  				//СОРТИРОВКА
  				"qDef" : {
  					"qSortCriterias": [{
  						"qSortByNumeric": 1,
  					}],
  				}
  			},
  			fact: {
  				"qLabel": "График.ФактическаяЧисленность_тп",
  				"qLibraryId": "bd0871b4-3288-4a25-b4e8-fb2e701b8a18",
  			},
  			factPp: {
  				"qLabel": "График.ФактическаяЧисленность_пп",
  				"qLibraryId": "af77a3dc-bcc0-40be-b26a-d8dacbf003d1",
  			},
  			vsFactPp: {
  				"qLabel": "График.ФактическаяЧисленность_тпVSпп",
  				"qLibraryId": "b552fe9b-1fa2-4937-98fc-9aa2bb1c7405",
  			},
  			vsFactPpAbsolute: {
  				"qLabel": "График.ФактическаяЧисленность_тпVSпп_абс",
  				"qLibraryId": "0914c54b-2288-40f5-9a9d-3874801d28de",
  			},
  		},
  		{
  			name: "Перештат",
  			id: 40,
  			dimension: {
  				"qLabel": "Перештат_ID",
  				"qLibraryId": "214b4adf-ac79-48f6-b8bd-821c7c964166",
  			},
  			dimensionPeriod: {
  				"qLabel": "График.ПериодПерсонал",
  				"qLibraryId": "855d8342-82cd-4ae7-ab6d-41e2e8e4ef80",
  				"qNullSuppression": true,
  				//СОРТИРОВКА
  				"qDef" : {
  					"qSortCriterias": [{
  						"qSortByNumeric": 1,
  					}],
  				}
  			},
  			fact: {
  				"qLabel": "График.Перештат_тп",
  				"qLibraryId": "e866765a-4360-4260-919e-c8b8f46f6e0b",
  			},
  			factPp: {
  				"qLabel": "График.Перештат_пп",
  				"qLibraryId": "f502dc82-11ae-402f-89c7-d4a1e2c9268e",
  			},
  			vsFactPp: {
  				"qLabel": "График.Перештат_тпVSпп",
  				"qLibraryId": "24fe32a5-c84e-4d76-a4fe-c5d1615569e5",
  			},
  			vsFactPpAbsolute: {
  				"qLabel": "График.Перештат_тпVSпп_абс",
  				"qLibraryId": "67c059ea-9847-47d5-bb32-68a7d32b9c27",
  			},
  		},
  		{
  			name: "Укомплектованность",
  			id: 41,
  			dimension: {
  				"qLabel": "Укомплектованность_ID",
  				"qLibraryId": "4250ff80-9909-4365-8497-45aa897cca3f",
  			},
  			dimensionPeriod: {
  				"qLabel": "График.ПериодПерсонал",
  				"qLibraryId": "855d8342-82cd-4ae7-ab6d-41e2e8e4ef80",
  				"qNullSuppression": true,
  				//СОРТИРОВКА
  				"qDef" : {
  					"qSortCriterias": [{
  						"qSortByNumeric": 1,
  					}],
  				}
  			},
  			fact: {
  				"qLabel": "График.Укомплектованность_тп",
  				"qLibraryId": "2b61412d-ca93-4c37-ab7f-b16ef8eded8a",
  			},
  			factPp: {
  				"qLabel": "График.Укомплектованность_пп",
  				"qLibraryId": "27ed0828-3a6c-4322-bb7e-83f01b3bc781",
  			},
  			vsFactPp: {
  				"qLabel": "График.Укомплектованность_тпVSпп",
  				"qLibraryId": "0a424a67-3713-4abc-a3b5-76ecd095139e",
  			}
  		},
  		{
  			name: "Текучесть",
  			id: 42,
  			dimension: {
  				"qLabel": "Текучесть_ID",
  				"qLibraryId": "f3bc05b2-53ce-4b26-ad81-17e79836f252",
  			},
  			dimensionPeriod: {
  				"qLabel": "График.ПериодПерсонал",
  				"qLibraryId": "855d8342-82cd-4ae7-ab6d-41e2e8e4ef80",
  				"qNullSuppression": true,
  				//СОРТИРОВКА
  				"qDef" : {
  					"qSortCriterias": [{
  						"qSortByNumeric": 1,
  					}],
  				}
  			},
  			fact: {
  				"qLabel": "График.Текучесть_тп",
  				"qLibraryId": "d6a12ddb-7b3e-49e4-a5ca-737f16bc05f3",
  			},
  			factPp: {
  				"qLabel": "График.Текучесть_пп",
  				"qLibraryId": "57cfd8a5-bca1-40dd-ac35-752a659de5b1",
  			},
  			vsFactPp: {
  				"qLabel": "График.Текучесть_тпVSпп",
  				"qLibraryId": "89f2e1b2-30dc-4d8b-b0c5-1e7678f86f2b",
  			}
  		}
  	],
  	individual: {
  		averageCheckLFL: {
  			name: "Средний чек LFL",
  			id: 5,
  			dimension: {
  				"qLabel": "СреднийЧекLFL_ID",
  				"qLibraryId": "433f93fb-9972-4c3a-8a53-32e46d46dd01",
  			},
  			commodityPriceMIX: {
  				"qLabel": "Товарно-ценовой MIX",
  				"qLibraryId": "SJngL",
  			},
  			complexInfluence: {
  				"qLabel": "Влияние комплексности",
  				"qLibraryId": "GNrqQkQ",
  			},
  			dynamicUnregularPriceInflation: {
  				"qLabel": "Влияние динамики нерегулярных цен",
  				"qLibraryId": "HAVgbV",
  			},
  			retailPriceInflationInfluence: {
  				"qLabel": "Влияние инфляции розничных цен, %",
  				"qLibraryId": "xmtRQNP",
  			},
  			loyaltyProductsInfluence: {
  				"qLabel": "Влияние товаров лояльности, %",
  				"qLibraryId": "xKmTvz",
  			}
  		}
  	}
  };

  const indicatorsMainTable = [
  	{	
  		name: "РТО",
  		id: 1,
  		units: 'руб.',
  		dimension: { 
  			"qLabel": "РТО_ID",
  			"qLibraryId": "RtPTYEw",
  		},
  		block1: {
  			arrow: {
  				"qLabel": "Стрелка.РТО_день",
  				"qLibraryId": "1c3b06d2-d6be-40f0-ac61-beec3ffb9511",
  			},
  			fact: {
  				"qLabel": "ОсновнаяТаблица.РТО_день_тп",
  				"qLibraryId": "63705185-448c-4ab5-8256-77a9e3643d21",
  			},
  			factPp: {
  				"qLabel": "ОсновнаяТаблица.РТО_день_пп",
  				"qLibraryId": "df457a1b-8a05-4fe1-b91a-af14504b4b66",
  			},
  			factVsPp: {
  				"qLabel": "ОсновнаяТаблица.РТО_день_тпVSпп",
  				"qLibraryId": "03f3c143-22ea-401c-a02e-bcd308269a19",
  			},
  			factVsPpPercent: {
  				"qLabel": "ОсновнаяТаблица.РТО_день_тпVSпп%",
  				"qLibraryId": "16abfc3c-d17e-40d6-bf1f-26e481779b96",
  			},
  			budget:	{
  				"qLabel": "ОсновнаяТаблица.РТО_день_план",
  				"qLibraryId": "0b3c7eed-c495-43e8-85fb-aa0c0f5a3196",
  			},
  			factVsBudget:	{
  				"qLabel": "ОсновнаяТаблица.РТО_день_тпVSплан",
  				"qLibraryId": "1ac9d176-432b-478d-928a-6d6f880930ec",
  			},
  			factVsBudgetPercent:	{
  				"qLabel": "ОсновнаяТаблица.РТО_день_тпVSплан%",
  				"qLibraryId": "aee32167-30e3-454f-b746-e8aa1ae06e2e",
  			},
  			deviationRegions: {
  				count: {
  					"qLabel": "КоличОтклОкруг.РТО_день",
  					"qLibraryId": "f8694e70-37bb-4693-9ce2-ed732a398c96",
  				},
  				factVsPp: {
  					"qLabel": "КоличОтклОкруг.РТОVSпп_день",
  					"qLibraryId": "b04d73ac-b19b-4395-8df7-8f79cfee9ac0",
  				},
  				factVsBudget: {
  					"qLabel": "КоличОтклОкруг.РТОVSПлан_день",
  					"qLibraryId": "2569a80f-8fc2-4bdf-aaea-633810618919",
  				}
  			},
  			deviationFormats: {
  				count: {
  					"qLabel": "КоличОтклФормат.РТО_день",
  					"qLibraryId": "9ddb8b17-4a0f-46c9-ac25-fdcde3af7597",
  				},
  				factVsPp: {
  					"qLabel": "КоличОтклФормат.РТОVSпп_день",
  					"qLibraryId": "610a9076-ee62-449d-bdc9-1c4a4e728654",
  				},
  				factVsBudget: {
  					"qLabel": "КоличОтклФормат.РТОVSПлан_день",
  					"qLibraryId": "88becff6-877d-4b4d-a4ef-2d446b0d5f18",
  				}
  			}
  		},
  		block2: {
  			arrow: {
  				"qLabel": "Стрелка.РТО",
  				"qLibraryId": "4eedca9f-9dae-4e0f-ad8b-833f27406a1b",
  			},
  			fact: {
  				"qLabel": "ОсновнаяТаблица.РТО_тп",
  					"qLibraryId": "evxjV",
  			},
  			factPp: {
  				"qLabel": "ОсновнаяТаблица.РТО_пп",
  				"qLibraryId": "c2e254c7-4bc3-43ed-9d2c-1718eb6fd23e",
  			},
  			factVsPp: {
  				"qLabel": "ОсновнаяТаблица.РТО_тпVSпп",
  				"qLibraryId": "7a79eb28-48e6-497d-8797-87e3502d840e",
  			},
  			factVsPpPercent: {
  				"qLabel": "ОсновнаяТаблица.РТО_тпVSпп%",
  				"qLibraryId": "9ca077d4-a4a2-4889-b538-0315c09ea47a",
  			},
  			budget:	{
  				"qLabel": "ОсновнаяТаблица.РТО_план",
  				"qLibraryId": "b069d06f-2c0d-47e0-8d90-d7c9984cdcdb",
  			},
  			factVsBudget:	{
  				"qLabel": "ОсновнаяТаблица.РТО_тпVSплан",
  				"qLibraryId": "54ceb1a5-4c1d-4f8d-a63b-e7dcf0a05b8a",
  			},
  			factVsBudgetPercent:	{
  				"qLabel": "ОсновнаяТаблица.РТО_тпVSплан%",
  				"qLibraryId": "c48ec730-cfd9-43bb-97b2-6cf3e012c78a",
  			},
  			deviationRegions: {
  				factVsPp: {
  					"qLabel": "КоличОтклОкруг.РТОVSпп",
  					"qLibraryId": "382f41ed-2270-40fa-8f15-83ae1b7a8149",
  				},
  				factVsBudget: {
  					"qLabel": "КоличОтклОкруг.РТОVSПлан",
  					"qLibraryId": "TxNJbk",
  				}
  			},
  			deviationFormats: {
  				factVsPp: {
  					"qLabel": "КоличОтклФормат.РТОVSпп",
  					"qLibraryId": "00686f5e-7627-427e-b9f4-48ad2551f55c",
  				},
  				factVsBudget: {
  					"qLabel": "КоличОтклФормат.РТОVSПлан",
  					"qLibraryId": "47cc97c2-8b4c-49f0-9c43-2effe5694726",
  				}
  			}
  		}
  	},
  	{
  		name: "RTOLFL",
  		id: 2,
  		units: '%',
  		dimension: { 
  			"qLabel": "РТОLFL_ID",
  			"qLibraryId": "459dcf74-f021-4a5e-8cb6-d048b956bb88",
  		},
  		block1:{
  			arrow: {
  				"qLabel": "Стрелка.РТОLFL_день",
  				"qLibraryId": "77402dbb-2423-47b2-950a-ef2d7a8000ba",
  			},
  			fact: {
  				"qLabel": "ОсновнаяТаблица.РТОLFL_день_тп",
  				"qLibraryId": "dfcdb4a4-3aeb-45f2-95eb-11f04f50cb70",
  			},
  			factPp: {
  				"qLabel": "ОсновнаяТаблица.РТОLFL_день_пп",
  				"qLibraryId": "5d082d7c-cf12-41a1-9b0b-777d4f72d8cf",
  			},
  			factVsPp: {
  				"qLabel": "ОсновнаяТаблица.РТОLFL_день_тпVSпп",
  				"qLibraryId": "d5ed9f04-ab5a-4863-9021-8bdb5fa7ce28",
  			},
  			factVsPpPercent: {
  				"qLabel": "ОсновнаяТаблица.РТОLFL_день_тпVSпп%",
  				"qLibraryId": "683ab1f3-145f-4709-bc5b-b2e65942c93c",
  			},
  			deviationRegions: {
  				count: {
  					"qLabel": "КоличОтклОкруг.РТОLFL_день",
  					"qLibraryId": "ec900435-91e4-4580-9564-9be111757e4f",
  				},
  				factVsPp: {
  					"qLabel": "КоличОтклОкруг.РТОLFLVSпп_день",
  					"qLibraryId": "7cc12787-fdd4-4ee8-9ab4-04a3dc3102e9",
  				}
  			},
  			deviationFormats: {
  				count: {
  					"qLabel": "КоличОтклФормат.РТОLFL_день",
  					"qLibraryId": "bc2349bb-84c9-44bb-9cd5-ccf93d78e1a2",
  				},
  				factVsPp: {
  					"qLabel": "КоличОтклФормат.РТОLFLVSпп_день",
  					"qLibraryId": "afb3ced9-0dd2-4413-a3ae-455bf847d90c",
  				}
  			}
  		},
  		block2:{
  			arrow: {
  				"qLabel": "Стрелка.РТОLFL",
  				"qLibraryId": "6ec6a37b-1b17-4292-bac1-c2debc56f19b",
  			},
  			fact: {
  				"qLabel": "ОсновнаяТаблица.РТОLFL_тп",
  				"qLibraryId": "1ed0abde-2569-4377-84fc-28d8183369c7",
  			},
  			factPp: {
  				"qLabel": "ОсновнаяТаблица.РТОLFL_пп",
  				"qLibraryId": "f1f3d522-cfdd-4ed3-8b3a-023086c83eec",
  			},
  			factVsPp: {
  				"qLabel": "ОсновнаяТаблица.РТОLFL_тпVSпп",
  				"qLibraryId": "18ef7899-94e7-4466-bea7-5cb991372eb2",
  			},
  			factVsPpPercent: {
  				"qLabel": "ОсновнаяТаблица.РТОLFL_тпVSпп%",
  				"qLibraryId": "72411741-7578-413f-99d0-7ce0a47b8417",
  			},
  			deviationRegions: {
  				factVsPp: {
  					"qLabel": "КоличОтклОкруг.РТОLFLVSпп",
  					"qLibraryId": "e24338f7-b034-4f27-9dbd-d6b8969a0722",
  				}
  			},
  			deviationFormats: {
  				factVsPp: {
  					"qLabel": "КоличОтклФормат.РТОLFLVSпп",
  					"qLibraryId": "55a353a6-622e-40eb-a3fd-5aa2c1495191",
  				}
  			}
  		}
  	},
  	{
  		name: "Себестоимость",
  		id: 3,
  		dimension: {
  			"qLabel": "Себестоимость_ID",
  			"qLibraryId": "24a1037d-9237-4b28-ac91-0a141f574c5e",
  		},
  		units: 'руб.',
  		block1: {
  			arrow: {
  				"qLabel": "Стрелка.Себестоимость_день",
  				"qLibraryId": "92aab870-0a20-49b1-ab98-266d650dc912",
  			},
  			fact: {
  				"qLabel": "ОсновнаяТаблица.Себестоимость_день_тп",
  				"qLibraryId": "88a388c5-6b21-4e52-bb70-05d91c8893ae",
  			},
  			factPp: {
  				"qLabel": "ОсновнаяТаблица.Себестоимость_день_пп",
  				"qLibraryId": "18d4c9bd-b5af-4b8e-99cd-7b75db9e95a3",
  			},
  			factVsPp: {
  				"qLabel": "ОсновнаяТаблица.Себестоимость_день_тпVSпп",
  				"qLibraryId": "7df92cc1-98bf-4cf2-9393-4548017837a2",
  			},
  			factVsPpPercent: {
  				"qLabel": "ОсновнаяТаблица.Себестоимость_день_тпVSпп%",
  				"qLibraryId": "3ff627a3-186a-425f-a3ed-28498d3d54e2",
  			},
  			deviationRegions: {
  				count: {
  					"qLabel": "КоличОтклОкруг.Себестоимость_день",
  					"qLibraryId": "0957f2a4-6d66-4af9-ba6c-5a2767864ccf",
  				},
  				factVsPp: {
  					"qLabel": "КоличОтклОкруг.СебестоимостьVSпп_день",
  					"qLibraryId": "f1c9122e-c4cb-49e2-a7d1-6f149347c58f",
  				}
  			},
  			deviationFormats: {
  				count: {
  					"qLabel": "КоличОтклФормат.Себестоимость_день",
  					"qLibraryId": "8ed2db41-6488-467e-a608-3857c0ec4651",
  				},
  				factVsPp: {
  					"qLabel": "КоличОтклФормат.СебестоимостьVSпп_день",
  					"qLibraryId": "0ac1924f-d35c-4a05-9e09-03ac85c60fbb",
  				}
  			}
  		},
  		block2: {
  			arrow: {
  				"qLabel": "Стрелка.Себестоимость",
  				"qLibraryId": "cd431e0f-a72d-4989-9231-0eccc72f9890",
  			},
  			fact: {
  				"qLabel": "ОсновнаяТаблица.Себестоимость_тп",
  				"qLibraryId": "7107ccb1-97ba-417a-bf3c-9a5b67037fce",
  			},
  			factPp: {
  				"qLabel": "ОсновнаяТаблица.Себестоимость_пп",
  				"qLibraryId": "13e703e8-241e-46d0-91a9-8a8ad88ae1c3",
  			},
  			factVsPp: {
  				"qLabel": "ОсновнаяТаблица.Себестоимость_тпVSпп",
  				"qLibraryId": "cfe00072-d1d6-4017-bcaa-7f5dc9b8febd",
  			},
  			factVsPpPercent: {
  				"qLabel": "ОсновнаяТаблица.Себестоимость_тпVSпп%",
  				"qLibraryId": "99f68b61-1ee8-4e53-9dc9-c9eb36bfbac2",
  			},
  			deviationRegions: {
  				factVsPp: {
  					"qLabel": "КоличОтклОкруг.СебестоимостьVSпп",
  					"qLibraryId": "3219d334-a2f2-4683-b56c-2b926e8659b2",
  				}
  			},
  			deviationFormats: {
  				factVsPp: {
  					"qLabel": "КоличОтклФормат.СебестоимостьVSпп",
  					"qLibraryId": "7555652a-87da-4a26-ae46-ca14bbb71ad5",
  				}
  			}
  		}
  	},
  	{
  		name: "Средний Чек",
  		id: 4,
  		units: 'руб.',
  		dimension: {
  			"qLabel": "СреднийЧек_ID",
  			"qLibraryId": "9b0d4c14-3440-4460-8d73-52dea5bcc672",
  		},
  		block1: {
  			arrow: {
  				"qLabel": "Стрелка.СрЧек_день",
  				"qLibraryId": "9aefa745-9fda-45e0-bf35-06cb85e58111",
  			},
  			fact: {
  				"qLabel": "ОсновнаяТаблица.СрЧек_день_тп",
  				"qLibraryId": "030ce159-38a4-42aa-921a-8d5d6f9e06a7",
  			},
  			factPp: {
  				"qLabel": "ОсновнаяТаблица.СрЧек_день_пп",
  				"qLibraryId": "02e40846-e68b-4316-a094-602caba841d7",
  			},
  			factVsPp: {
  				"qLabel": "ОсновнаяТаблица.СрЧек_день_тпVSпп",
  				"qLibraryId": "35c721a3-c0cf-42df-9357-7729c5980431",
  			},
  			factVsPpPercent: {
  				"qLabel": "ОсновнаяТаблица.СрЧек_день_тпVSпп%",
  				"qLibraryId": "d09cbed8-a224-46ce-8de1-7bcf16e4e85f",
  			},
  			deviationRegions: {
  				count: {
  					"qLabel": "КоличОтклОкруг.СреднийЧек_день",
  					"qLibraryId": "fe92d8b3-d855-411f-b0f8-7e82e02f4b95",
  				},
  				factVsPp: {
  					"qLabel": "КоличОтклОкруг.СреднийЧекVSпп_день",
  					"qLibraryId": "d550b7c4-261d-4028-b366-b4a356ab102f",
  				}
  			},
  			deviationFormats: {
  				count: {
  					"qLabel": "КоличОтклФормат.СреднийЧек_день",
  					"qLibraryId": "dd497c33-6e11-4213-876b-bfad81a1e3ae",
  				},
  				factVsPp: {
  					"qLabel": "КоличОтклФормат.СреднийЧекVSпп_день",
  					"qLibraryId": "b2f9d3ca-36f6-4ad1-9d85-75d01bd15b02",
  				}
  			}
  		},
  		block2: {
  			arrow: {
  				"qLabel": "Стрелка.СрЧек",
  				"qLibraryId": "d461fffe-7e4a-4ca0-a84d-9ff1feba4352",
  			},
  			fact: {
  				"qLabel": "ОсновнаяТаблица.СрЧек_тп",
  				"qLibraryId": "808a5a24-f54d-4cda-b1c7-2e123c91964e",
  			},
  			factPp: {
  				"qLabel": "ОсновнаяТаблица.СрЧек_пп",
  				"qLibraryId": "8e8fe006-9f8b-4ca8-82b3-0c37eca1a7c8",
  			},
  			factVsPp: {
  				"qLabel": "ОсновнаяТаблица.СрЧек_тпVSпп",
  				"qLibraryId": "1a69337d-767f-44b3-ba7a-4926cebca6ed",
  			},
  			factVsPpPercent: {
  				"qLabel": "ОсновнаяТаблица.СрЧек_тпVSпп%",
  				"qLibraryId": "282f3622-407f-4eb3-9df6-245c41c77cbe",
  			},
  			deviationRegions: {
  				factVsPp: {
  					"qLabel": "КоличОтклОкруг.СреднийЧекVSпп",
  					"qLibraryId": "8728e04c-d901-4444-9911-9c2f355778ca",
  				}
  			},
  			deviationFormats: {
  				factVsPp: {
  					"qLabel": "КоличОтклФормат.СреднийЧекVSпп",
  					"qLibraryId": "ba6c2ea4-d043-48f1-85e5-6df0e9070518",
  				}
  			}
  		}
  	},
  	{
  		name: "Средний чек LFL",
  		id: 5,
  		units: '%',
  		dimension: {
  			"qLabel": "СреднийЧекLFL_ID",
  			"qLibraryId": "433f93fb-9972-4c3a-8a53-32e46d46dd01",
  		},
  		block1: {
  			arrow: {
  				"qLabel": "Стрелка.СрЧекLFL_день",
  				"qLibraryId": "b03907d4-1256-4e50-84d0-f4a7f4a5b074",
  			},
  			fact: {
  				"qLabel": "ОсновнаяТаблица.СрЧекLFL_день_тп",
  				"qLibraryId": "eb315456-aa2c-484c-8dd7-1ee696d400dd",
  			},
  			factPp: {
  				"qLabel": "ОсновнаяТаблица.СрЧекLFL_день_пп",
  				"qLibraryId": "0b92cab3-4a3b-4fcb-b707-ae1d27935bfa",
  			},
  			factVsPp: {
  				"qLabel": "ОсновнаяТаблица.СрЧекLFL_день_тпVSпп",
  				"qLibraryId": "997703d8-8e40-47a5-a249-9cba6009baf8",
  			},
  			factVsPpPercent: {
  				"qLabel": "ОсновнаяТаблица.СрЧекLFL_день_тпVSпп%",
  				"qLibraryId": "e5c21140-e06b-46e6-b2ee-def30105a442",
  			},
  			deviationRegions: {
  				count: {
  					"qLabel": "КоличОтклОкруг.СрЧекLFL_день",
  					"qLibraryId": "b81f285f-c61f-4d4c-946b-8a8759ecacd4",
  				},
  				factVsPp: {
  					"qLabel": "КоличОтклОкруг.СрЧекLFLVSпп_день",
  					"qLibraryId": "95718ff6-d310-4f6f-965c-bfd5a991f108",
  				}
  			},
  			deviationFormats: {
  				count: {
  					"qLabel": "КоличОтклФормат.СрЧекLFL_день",
  					"qLibraryId": "e96ed4f7-3257-4690-8a8e-806a1797f7f5",
  				},
  				factVsPp: {
  					"qLabel": "КоличОтклФормат.СрЧекLFLVSпп_день",
  					"qLibraryId": "87cbed11-7c7d-4bf7-950b-a302bbc688e9",
  				}
  			}
  		},
  		block2: {
  			arrow: {
  				"qLabel": "Стрелка.СрЧекLFL",
  				"qLibraryId": "d82ec9d5-f3d5-4c58-904a-e7c17eb41272",
  			},
  			fact: {
  				"qLabel": "ОсновнаяТаблица.СрЧекLFL_тп",
  				"qLibraryId": "77f03bc8-221e-4167-b306-618c10b1a3d5",
  			},
  			factPp: {
  				"qLabel": "ОсновнаяТаблица.СрЧекLFL_пп",
  				"qLibraryId": "9375e402-4cf4-4c90-840b-5519c7265894",
  			},
  			factVsPp: {
  				"qLabel": "ОсновнаяТаблица.СрЧекLFL_тпVSпп",
  				"qLibraryId": "b87d725a-8870-447c-bb01-d4c1c60e7904",
  			},
  			factVsPpPercent: {
  				"qLabel": "ОсновнаяТаблица.СрЧекLFL_тпVSпп%",
  				"qLibraryId": "683a26af-94aa-44fc-880a-e248522a2428",
  			},
  			deviationRegions: {
  				factVsPp: {
  					"qLabel": "КоличОтклОкруг.СрЧекLFLVSпп",
  					"qLibraryId": "58143960-5956-4054-9a58-1f7a70930ee4",
  				}
  			},
  			deviationFormats: {
  				factVsPp: {
  					"qLabel": "КоличОтклФормат.СрЧекLFLVSпп",
  					"qLibraryId": "fb6b60d3-b637-420a-aecd-5dddec2993e3",
  				}
  			}
  		}
  	},
  	{
  		name: "Комплексность",
  		id: 6,
  		units: 'шт.',
  		dimension: {
  			"qLabel": "Комплексность",
  			"qLibraryId": "f9a79df6-a794-4375-b512-e65228f4e28c",
  		},
  		block1: {
  			arrow: {
  				"qLabel": "Стрелка.Комплексность_день",
  				"qLibraryId": "198cef4d-c715-4346-b6ec-7845f6c06631",
  			},
  			fact: {
  				"qLabel": "ОсновнаяТаблица.Комплексность_день_т",
  				"qLibraryId": "ac2b4991-0ffb-4d10-8456-77612d05c46b",
  			},
  			factPp: {
  				"qLabel": "ОсновнаяТаблица.Комплексность_день_пп",
  				"qLibraryId": "2897ca17-8a6b-4173-bd98-cd29cff55b0b",
  			},
  			factVsPp: {
  				"qLabel": "ОсновнаяТаблица.Комплексность_день_тпVSпп",
  				"qLibraryId": "6d343e15-821c-4f38-b5ac-a35400af89ae",
  			},
  			factVsPpPercent: {
  				"qLabel": "ОсновнаяТаблица.Комплексность_день_тпVSпп%",
  				"qLibraryId": "4cd21408-b4aa-4cc3-8598-525c4df56299",
  			},
  			deviationRegions: {
  				count: {
  					"qLabel": "КоличОтклОкруг.Комплексность_день",
  					"qLibraryId": "482a8352-4f4f-4a7f-9574-970fac56b324",
  				},
  				factVsPp: {
  					"qLabel": "КоличОтклОкруг.КомплексностьVSпп_день",
  					"qLibraryId": "2efe4c6f-8119-4739-abdb-acc8947676a3",
  				}				
  			},
  			deviationFormats: {
  				count: {
  					"qLabel": "КоличОтклФормат.Комплексность_день",
  					"qLibraryId": "4f6488b4-b049-40d3-a7d4-f6e1cdf29f42",
  				},
  				factVsPp: {
  					"qLabel": "КоличОтклФормат.КомплексностьVSпп_день",
  					"qLibraryId": "b8da33db-3c92-4ff6-a1e5-aecd919ba668",
  				}
  			}
  		},
  		block2: {
  			arrow: {
  				"qLabel": "Стрелка.Комплексность",
  				"qLibraryId": "965644f1-766f-4375-b47f-979f19ef7d34",
  			},
  			fact: {
  				"qLabel": "ОсновнаяТаблица.Комплексность_тп",
  				"qLibraryId": "5fa8d3c6-1376-499e-9805-433ffd6f149a",
  			},
  			factPp: {
  				"qLabel": "ОсновнаяТаблица.Комплексность_пп",
  				"qLibraryId": "91e92d0f-ec65-4d51-a278-b3cd2ecc966d",
  			},
  			factVsPp: {
  				"qLabel": "ОсновнаяТаблица.Комплексность_тпVSпп",
  				"qLibraryId": "a01c2fc7-2a07-436c-8cf2-cfbaf86f9cf1",
  			},
  			factVsPpPercent: {
  				"qLabel": "ОсновнаяТаблица.Комплексность_тпVSпп%",
  				"qLibraryId": "5939ff58-b454-4ad9-b07c-bb1b7b4c860e",
  			},
  			deviationRegions: {
  				factVsPp: {
  					"qLabel": "КоличОтклОкруг.КомплексностьVSпп",
  					"qLibraryId": "76eee585-de16-43a1-bb22-c066c73e44ce",
  				}
  			},
  			deviationFormats: {
  				factVsPp: {
  					"qLabel": "КоличОтклФормат.КомплексностьVSпп",
  					"qLibraryId": "b719def1-0a91-4355-a928-405841b3fa2e",
  				}
  			}
  		}
  	},
  	{
  		name: "Трафик",
  		id: 7,
  		units: 'шт.',
  		dimension: {
  			"qLabel": "Траффик_ID",
  			"qLibraryId": "f0f34b78-3091-472d-9f74-79d8e15bb535",
  		},
  		block1: {
  			arrow: {
  				"qLabel": "Стрелка.Трафик_день",
  				"qLibraryId": "f06baefc-2ef1-435a-abbe-ba633a2d0d55",
  			},
  			fact: {
  				"qLabel": "ОсновнаяТаблица.Трафик_день_тп",
  				"qLibraryId": "bf39ca2b-8473-4d70-8f01-f496673c0f4c",
  			},
  			factPp: {
  				"qLabel": "ОсновнаяТаблица.Трафик_день_пп",
  				"qLibraryId": "c96875e0-a0fd-4f89-8b23-27dffcb8757b",
  			},
  			factVsPp: {
  				"qLabel": "ОсновнаяТаблица.Трафик_день_тпVSпп",
  				"qLibraryId": "bac54a84-dbb1-4e1b-ade1-924657a85da9",
  			},
  			factVsPpPercent: {
  				"qLabel": "ОсновнаяТаблица.Трафик_день_тпVSпп%",
  				"qLibraryId": "559f554d-a9cc-4c81-839b-9c16ca768dba",
  			},
  			deviationRegions: {
  				count: {
  					"qLabel": "КоличОтклОкруг.Трафик_день",
  					"qLibraryId": "b563868d-1b48-4853-8956-75f855d9c0e1",
  				},
  				factVsPp: {
  					"qLabel": "КоличОтклОкруг.ТрафикVSпп_день",
  					"qLibraryId": "8f5e3789-6adf-4ea9-8e3d-afaa41e15d5c",
  				}
  			},
  			deviationFormats: {
  				count: {
  					"qLabel": "КоличОтклФормат.Трафик_день",
  					"qLibraryId": "2ddee64e-8736-44dc-8515-bb05f2920540",
  				},
  				factVsPp: {
  					"qLabel": "КоличОтклФормат.ТрафикVSпп_день",
  					"qLibraryId": "6f85ae7a-aed2-4067-ac7c-f3dc0e8bdcec",
  				}
  			}
  		},
  		block2: {
  			arrow: {
  				"qLabel": "Стрелка.Трафик",
  				"qLibraryId": "7739f053-fa84-4fbb-8475-f7d524f69dd8",
  			},
  			fact: {
  				"qLabel": "ОсновнаяТаблица.Трафик_тп",
  				"qLibraryId": "7eb0b544-0efa-4619-8e30-7c43f027c191",
  			},
  			factPp: {
  				"qLabel": "ОсновнаяТаблица.Трафик_пп",
  				"qLibraryId": "f50b653d-fcf6-4dc2-a914-0fbe0b3df67e",
  			},
  			factVsPp: {
  				"qLabel": "ОсновнаяТаблица.Трафик_тпVSпп",
  				"qLibraryId": "c322c535-c27e-4915-88f5-ca8bd68d2cd3",
  			},
  			factVsPpPercent: {
  				"qLabel": "ОсновнаяТаблица.Трафик_тпVSпп%",
  				"qLibraryId": "8de0246a-71b7-4ca3-b873-e6bb03898577",
  			},
  			deviationRegions: {
  				factVsPp: {
  					"qLabel": "КоличОтклОкруг.ТрафикVSпп",
  					"qLibraryId": "7fe9da92-1262-4682-bcd5-46eb9b5b8b8c",
  				}
  			},
  			deviationFormats: {
  				factVsPp: {
  					"qLabel": "КоличОтклФормат.ТрафикVSпп",
  					"qLibraryId": "b06581ec-93a2-4839-b001-0876e735feb8",
  				}
  			}
  		}
  	},
  	{
  		name: "Трафик LFL",
  		id: 8,
  		dimension: {
  			"qLabel": "ТрафикLFL_ID",
  			"qLibraryId": "c74b9950-9d5c-4f1d-8479-45174cd186d1",
  		},
  		units: '%',
  		block1: {
  			arrow: {
  				"qLabel": "Стрелка.ТрафикLFL_день",
  				"qLibraryId": "f272c646-e471-43ca-a4e6-d4b1014aa03e",
  			},
  			fact: {
  				"qLabel": "ОсновнаяТаблица.ТрафикLFL_день_тп",
  				"qLibraryId": "b3fb0578-d529-4af8-9094-4f5a4b7260f6",
  			},
  			factPp: {
  				"qLabel": "ОсновнаяТаблица.ТрафикLFL_день_пп",
  				"qLibraryId": "b2788a40-b9c0-42c6-8d6e-151faa85007c",
  			},
  			factVsPp: {
  				"qLabel": "ОсновнаяТаблица.ТрафикLFL_день_тпVSпп",
  				"qLibraryId": "88933144-73df-4bb6-9e91-6053c75f8dbb",
  			},
  			factVsPpPercent: {
  				"qLabel": "ОсновнаяТаблица.ТрафикLFL_день_тпVSпп%",
  				"qLibraryId": "7fd95a17-2a20-451d-8ad8-566feb632ab0",
  			},
  			deviationRegions: {
  				count: {
  					"qLabel": "КоличОтклОкруг.ТрафикLFL_день",
  					"qLibraryId": "ce903361-4f49-45dc-ad91-b65cced0b416",
  				},
  				factVsPp: {
  					"qLabel": "КоличОтклОкруг.ТрафикLFLVSпп_день",
  					"qLibraryId": "ddbbdfe3-0241-4b78-a234-b10dd64bf4db",
  				}
  			},
  			deviationFormats: {
  				count: {
  					"qLabel": "КоличОтклФормат.ТрафикLFL_день",
  					"qLibraryId": "8f624724-de3c-4430-821b-ca2438c4f6e5",
  				},
  				factVsPp: {
  					"qLabel": "КоличОтклФормат.ТрафикLFLVSпп_день",
  					"qLibraryId": "1b1aa1da-b677-47e3-9230-71a4703c7a7e",
  				}
  			}
  		},
  		block2: {
  			arrow: {
  				"qLabel": "Стрелка.ТрафикLFL",
  				"qLibraryId": "fb730088-f39a-46ea-9029-f81b29b78f23",
  			},
  			fact: {
  				"qLabel": "ОсновнаяТаблица.ТрафикLFL_тп",
  				"qLibraryId": "d9072aa3-4437-4f0a-8337-c60574944da6",
  			},
  			factPp: {
  				"qLabel": "ОсновнаяТаблица.ТрафикLFL_пп",
  				"qLibraryId": "2dfe6518-7dd6-4200-9499-0d1e903cab1d",
  			},
  			factVsPp: {
  				"qLabel": "ОсновнаяТаблица.ТрафикLFL_тпVSпп",
  				"qLibraryId": "be0921d4-a348-4718-b86f-39efb50bda21",
  			},
  			factVsPpPercent: {
  				"qLabel": "ОсновнаяТаблица.ТрафикLFL_тпVSпп%",
  				"qLibraryId": "66f62e71-e223-4a5c-aca2-473c8bd661c3",
  			},
  			deviationRegions: {
  				factVsPp: {
  					"qLabel": "КоличОтклОкруг.ТрафикLFLVSпп",
  					"qLibraryId": "05bc9f0e-8683-4308-b94d-e8319b66e4ad",
  				}
  			},
  			deviationFormats: {
  				factVsPp: {
  					"qLabel": "КоличОтклФормат.ТрафикLFLVSпп",
  					"qLibraryId": "4b698b7c-6e06-442b-bdb5-5f26b67ecb2b",
  				}
  			}
  		}
  	},
  	{
  		name: "Колич объектов",
  		id: 9,
  		units: 'шт.',
  		dimension: {
  			"qLabel": "КоличОбъектов_ID",
  			"qLibraryId": "3959a379-5ab4-4954-afdc-bc81ba136bf2",
  		},
  		block1: {
  			arrow: {
  				"qLabel": "Стрелка.КолРабТО_день",
  				"qLibraryId": "4022f73b-41f6-4260-b5cb-e00b79c1ddce",
  			},
  			fact: {
  				"qLabel": "ОсновнаяТаблица.КолРабТО_день_тп",
  				"qLibraryId": "0d01e854-afb9-4983-8501-89248072ee33",
  			},
  			factPp: {
  				"qLabel": "ОсновнаяТаблица.КолРабТО_день_пп",
  				"qLibraryId": "b581d853-2a95-4cd1-a074-022df53371e3",
  			},
  			factVsPp: {
  				"qLabel": "ОсновнаяТаблица.КолРабТО_день_тпVSпп",
  				"qLibraryId": "26e2640a-c116-47a0-b827-3fc3da52f199",
  			},
  			factVsPpPercent: {
  				"qLabel": "ОсновнаяТаблица.КолРабТО_день_тпVSпп%",
  				"qLibraryId": "d673b456-c47a-48bb-84c5-7ccbcd44726b",
  			},
  			deviationRegions: {
  				count: {
  					"qLabel": "КоличОтклОкруг.КолРабТО_день",
  					"qLibraryId": "048dc18d-2ab3-48d0-a9c2-434ddd4f9296",
  				},
  				factVsPp: {
  					"qLabel": "КоличОтклОкруг.КолРабТОVSпп_день",
  					"qLibraryId": "f4afc97d-0dec-4d52-a85a-f03a681cd5b2",
  				}
  			},
  			deviationFormats: {
  				count: {
  					"qLabel": "КоличОтклФормат.КолРабТО_день",
  					"qLibraryId": "d81e5e81-b452-4fbd-a183-e03bc9a67bf6",
  				},
  				factVsPp: {
  					"qLabel": "КоличОтклФормат.КолРабТОVSпп_день",
  					"qLibraryId": "b2422837-2c87-42a5-b747-fcb2dd5beb59",
  				}
  			}
  		},
  		block2: {
  			arrow: {
  				"qLabel": "Стрелка.КолРабТО",
  				"qLibraryId": "30574fa4-9082-4ea4-a27e-13782da86fdb",
  			},
  			fact: {
  				"qLabel": "ОсновнаяТаблица.КолРабТО_тп",
  				"qLibraryId": "890cea4f-1a8e-484d-a801-2c05fe0bad97",
  			},
  			factPp: {
  				"qLabel": "ОсновнаяТаблица.КолРабТО_пп",
  				"qLibraryId": "7505f60a-a24e-4742-8571-1910a008d884",
  			},
  			factVsPp: {
  				"qLabel": "ОсновнаяТаблица.КолРабТО_тпVSпп",
  				"qLibraryId": "a64b7f55-06b2-410b-b900-6e53bfe16c2c",
  			},
  			factVsPpPercent: {
  				"qLabel": "ОсновнаяТаблица.КолРабТО_тпVSпп%",
  				"qLibraryId": "21aab47b-5b85-4d26-9b4c-fb7a66441bbb",
  			},
  			deviationRegions: {
  				factVsPp: {
  					"qLabel": "КоличОтклОкруг.КолРабТОVSпп",
  					"qLibraryId": "e0966ca1-d426-44ba-876b-b3aa278b15f6",
  				}
  			},
  			deviationFormats: {
  				factVsPp: {
  					"qLabel": "КоличОтклФормат.КолРабТОVSпп",
  					"qLibraryId": "18f13b7e-7b11-4441-af48-8540295e728f",
  				}
  			}
  		}
  	},
  	{
  		name: "Колич закрытых объектов",
  		id: 10,
  		units: 'шт.',
  		dimension: {
  			"qLabel": "КоличЗакрытыхОбъектов_ID",
  			"qLibraryId": "eebf57bb-1932-4e35-9450-fb0b2c1496a6",
  		},
  		block1: {
  			arrow: {
  				"qLabel": "Стрелка.КолЗакрТО_день",
  				"qLibraryId": "11c12034-677f-4dff-baad-e98ad47f8f5f",
  			},
  			fact: {
  				"qLabel": "ОсновнаяТаблица.КолЗакрТО_день_тп",
  				"qLibraryId": "b47bbeeb-a1fa-4814-a968-f0d280e24b41",
  			},
  			factPp: {
  				"qLabel": "ОсновнаяТаблица.КолЗакрТО_день_пп",
  				"qLibraryId": "e4c6a8e6-4c97-4fd0-9236-daa51cd79187",
  			},
  			factVsPp: {
  				"qLabel": "ОсновнаяТаблица.КолЗакрТО_день_тпVSпп",
  				"qLibraryId": "cacbd03e-7f2c-49cc-96de-0e0c72f5c4d7",
  			},
  			factVsPpPercent: {
  				"qLabel": "ОсновнаяТаблица.КолЗакрТО_день_тпVSпп%",
  				"qLibraryId": "f1992d18-a194-4d43-9f1b-ad4635296646",
  			},
  			deviationRegions: {
  				count: {
  					"qLabel": "КоличОтклОкруг.КоличЗакрытыхОбъектов_день",
  					"qLibraryId": "67f1a17b-d0f2-4b20-b1e5-8769d49be830",
  				},
  				factVsPp: {
  					"qLabel": "КоличОтклОкруг.КоличЗакрытыхОбъектовVSпп_день",
  					"qLibraryId": "96fa9c23-8609-4ca5-a2ab-43a76e0e9201",
  				}
  			},
  			deviationFormats: {
  				count: {
  					"qLabel": "КоличОтклФормат.КоличЗакрытыхОбъектов_день",
  					"qLibraryId": "27814832-bd32-484e-ae3b-ae95a2de82bd",
  				},
  				factVsPp: {
  					"qLabel": "КоличОтклФормат.КоличЗакрытыхОбъектовVSпп_день",
  					"qLibraryId": "433cbfa6-8978-42f0-89be-ba753f360bf6",
  				}
  			}
  		},
  		block2: {
  			arrow: {
  				"qLabel": "Стрелка.КолЗакрТО",
  				"qLibraryId": "562067ac-770c-4563-a3fd-bc1a36b75b81",
  			},
  			fact: {
  				"qLabel": "ОсновнаяТаблица.КолЗакрТО_тп",
  				"qLibraryId": "f3ef0f96-b8c1-4492-a020-015e3e24faf9",
  			},
  			factPp: {
  				"qLabel": "ОсновнаяТаблица.КолЗакрТО_пп",
  				"qLibraryId": "310ca809-e5b6-433b-a1f2-dddf2279ca87",
  			},
  			factVsPp: {
  				"qLabel": "ОсновнаяТаблица.КолЗакрТО_тпVSпп",
  				"qLibraryId": "04fa2df0-4bb4-47ec-b78f-7eb30711a68d",
  			},
  			factVsPpPercent: {
  				"qLabel": "ОсновнаяТаблица.КолЗакрТО_тпVSпп%",
  				"qLibraryId": "648b22bc-324a-4c7d-8087-418ff7041e10",
  			},
  			deviationRegions: {
  				factVsPp: {
  					"qLabel": "КоличОтклОкруг.КоличЗакрытыхОбъектовVSпп",
  					"qLibraryId": "f259f637-4bc4-4072-815f-3f12ceef1863",
  				}
  			},
  			deviationFormats: {
  				factVsPp: {
  					"qLabel": "КоличОтклФормат.КоличЗакрытыхОбъектовVSпп",
  					"qLibraryId": "c39f337c-702b-493f-b022-e1977d241929",
  				}
  			}
  		}
  	},
  	{
  		name: "ТЗ",
  		id: 11,
  		units: 'руб.',
  		dimension: {
  			"qLabel": "ТЗ_ID",
  			"qLibraryId": "72049865-d9cd-4750-abf9-f43b4bc1f4e5",
  		},
  		block1: {
  			arrow: {
  				"qLabel": "Стрелка.ТЗ_день",
  				"qLibraryId": "12e4745e-2e2d-46da-89e0-2f757c4037a7",
  			},
  			fact: {
  				"qLabel": "ОсновнаяТаблица.ТЗ_день_тп",
  				"qLibraryId": "8864ed7a-8c8d-4d79-82ce-9b96d108b271",
  			},
  			factPp: {
  				"qLabel": "ОсновнаяТаблица.ТЗ_день_пп",
  				"qLibraryId": "137e1e9d-2bdf-42b5-8b89-e3726c2d3cb5",
  			},
  			factVsPp: {
  				"qLabel": "ОсновнаяТаблица.ТЗ_день_тпVSпп",
  				"qLibraryId": "e45b1902-7624-49c8-b50d-e117f260f8e8",
  			},
  			factVsPpPercent: {
  				"qLabel": "ОсновнаяТаблица.ТЗ_день_тпVSпп%",
  				"qLibraryId": "3047b825-90ad-43ab-bc26-c5f82b7c8a3e",
  			},
  			deviationRegions: {
  				count: {
  					"qLabel": "КоличОтклОкруг.Остатки_день",
  					"qLibraryId": "e745e4ea-6b4f-4e25-a317-7fa80efb05b2",
  				},
  				factVsPp: {
  					"qLabel": "КоличОтклОкруг.ОстаткиVSпп_день",
  					"qLibraryId": "f2a96f85-e75a-4bd9-85dc-0109ec03e428",
  				}
  			},
  			deviationFormats: {
  				count: {
  					"qLabel": "КоличОтклФормат.Остатки_день",
  					"qLibraryId": "598bd735-6e19-4243-882f-c3802c654dd2",
  				},
  				factVsPp: {
  					"qLabel": "КоличОтклФормат.ОстаткиVSпп_день",
  					"qLibraryId": "738f5e19-cded-438d-ba1a-04eb612b0fe8",
  				}
  			}
  		},
  		block2: {
  			arrow: {
  				"qLabel": "Стрелка.ТЗ",
  				"qLibraryId": "08967a01-1482-48c2-9b8d-c85d09077731",
  			},
  			fact: {
  				"qLabel": "ОсновнаяТаблица.ТЗ_тп",
  				"qLibraryId": "0365ea54-725d-4837-9c0d-fc8f15f08659",
  			},
  			factPp: {
  				"qLabel": "ОсновнаяТаблица.ТЗ_пп",
  				"qLibraryId": "71c68b5a-6887-4cd4-8a4b-3c2a3df1c93f",
  			},
  			factVsPp: {
  				"qLabel": "ОсновнаяТаблица.ТЗ_тпVSпп",
  				"qLibraryId": "12df3b37-0fc3-4040-b059-cb552751dad0",
  			},
  			factVsPpPercent: {
  				"qLabel": "ОсновнаяТаблица.ТЗ_тпVSпп%",
  				"qLibraryId": "882f35f4-e98d-4976-a79f-d87c388d0e5d",
  			},
  			deviationRegions: {
  				factVsPp: {
  					"qLabel": "КоличОтклОкруг.ОстаткиVSпп",
  					"qLibraryId": "e8e7d9f5-80e3-4a4e-8ff3-fea8ddfcbed0",
  				}
  			},
  			deviationFormats: {
  				factVsPp: {
  					"qLabel": "КоличОтклФормат.ОстаткиVSпп",
  					"qLibraryId": "455b825a-a538-44bc-8559-58a9a4c2db04",
  				}
  			}
  		}
  	},
  	{
  		name: "Оборачиваемость",
  		id: 12,
  		units: 'дн.',
  		dimension: {
  			"qLabel": "Оборачиваемость_ID",
  			"qLibraryId": "b84a7ff7-0d4b-42ae-8401-dd8924fa0734",
  		},
  		block1: {
  			arrow: {
  				"qLabel": "Стрелка.Оборачиваемость_день",
  				"qLibraryId": "13956349-7424-43c3-876a-57240e5c40fc",
  			},
  			fact: {
  				"qLabel": "ОсновнаяТаблица.Оборачиваемость_день_тп",
  				"qLibraryId": "657ee025-f392-4253-9186-40e9a52fd73e",
  			},
  			factPp: {
  				"qLabel": "ОсновнаяТаблица.Оборачиваемость_день_пп",
  				"qLibraryId": "898c0e8d-7bdd-4c54-9ca4-27d456fc5f35",
  			},
  			factVsPp: {
  				"qLabel": "ОсновнаяТаблица.Оборачиваемость_день_тпVSпп",
  				"qLibraryId": "43ba1a6a-be58-4897-9dbb-8299d7a5f37f",
  			},
  			factVsPpPercent: {
  				"qLabel": "ОсновнаяТаблица.Оборачиваемость_день_тпVSпп%",
  				"qLibraryId": "fe8bea46-c342-4ef8-bb28-3625d292339d",
  			},
  			deviationRegions: {
  				count: {
  					"qLabel": "КоличОтклОкруг.Оборачиваемость_день",
  					"qLibraryId": "8b7035a9-acb5-4436-a2d7-4dc7f242f88c",
  				},
  				factVsPp: {
  					"qLabel": "КоличОтклОкруг.ОборачиваемостьVSпп_день",
  					"qLibraryId": "38d19d81-f40b-45d5-b57a-e63994afea52",
  				}
  			},
  			deviationFormats: {
  				count: {
  					"qLabel": "КоличОтклФормат.Оборачиваемость_день",
  					"qLibraryId": "800a3e7d-733f-4ff9-bd29-447b38021f79",
  				},
  				factVsPp: {
  					"qLabel": "КоличОтклФормат.ОборачиваемостьVSпп_день",
  					"qLibraryId": "62cea592-7661-452a-886f-a143c593b704",
  				}
  			}
  		},
  		block2: {
  			arrow: {
  				"qLabel": "Стрелка.Оборачиваемость",
  				"qLibraryId": "b3a2f381-46b0-4114-9ea0-ea019655d78a",
  			},
  			fact: {
  				"qLabel": "ОсновнаяТаблица.Оборачиваемость_тп",
  				"qLibraryId": "9846c49e-bc23-4f6a-93df-0cac26bc57b5",
  			},
  			factPp: {
  				"qLabel": "ОсновнаяТаблица.Оборачиваемость_пп",
  				"qLibraryId": "84809370-74df-4d77-a6bc-46f346e2080b",
  			},
  			factVsPp: {
  				"qLabel": "ОсновнаяТаблица.Оборачиваемость_тпVSпп",
  				"qLibraryId": "4a3c6ea8-0728-46c8-8d7c-07dff0875f34",
  			},
  			factVsPpPercent: {
  				"qLabel": "ОсновнаяТаблица.Оборачиваемость_тпVSпп%",
  				"qLibraryId": "98b5583b-01ce-4ef8-b937-2bbe148e4eef",
  			},
  			deviationRegions: {
  				factVsPp: {
  					"qLabel": "КоличОтклОкруг.ОборачиваемостьVSпп",
  					"qLibraryId": "ac97b112-ec31-47ea-a365-af8d2adaccf9",
  				}
  			},
  			deviationFormats: {
  				factVsPp: {
  					"qLabel": "КоличОтклФормат.ОборачиваемостьVSпп",
  					"qLibraryId": "0aca75b3-d644-4b83-a52f-107eeb53d57f",
  				}
  			}
  		}
  	},
  	{
  		name: "Уровень сервиса РЦ",
  		id: 13,
  		units: '%',
  		dimension: {
  			"qLabel": "УСРЦ_ID",
  			"qLibraryId": "71f10a9d-c667-4750-9ad7-5eaf358678db",
  		},
  		block1: {
  			arrow: {
  				"qLabel": "Стрелка.УСРЦ_день",
  				"qLibraryId": "876c52e5-58cd-4f7e-b877-659addbab84d",
  			},
  			fact: {
  				"qLabel": "ОсновнаяТаблица.УСРЦ_день_тп",
  				"qLibraryId": "a6e3056c-3365-4d6d-bf85-60eea3f38b56",
  			},
  			factPp: {
  				"qLabel": "ОсновнаяТаблица.УСРЦ_день_пп",
  				"qLibraryId": "6d8dedbe-cd84-4702-abe3-1413977fad6e",
  			},
  			factVsPp: {
  				"qLabel": "ОсновнаяТаблица.УСРЦ_день_тпVSпп",
  				"qLibraryId": "51740c1d-6cc3-41e1-aab5-8aadded731cc",
  			},
  			factVsPpPercent: {
  				"qLabel": "ОсновнаяТаблица.УСРЦ_день_тпVSпп%",
  				"qLibraryId": "f8196255-9e77-4332-9475-f3b19871d1b1",
  			},
  			deviationRegions: {
  				count: {
  					"qLabel": "КоличОтклОкруг.УСРЦ_день",
  					"qLibraryId": "f8df30c7-8080-4d3c-a27f-f25395a2d997",
  				},
  				factVsPp: {
  					"qLabel": "КоличОтклОкруг.УСРЦVSпп_день",
  					"qLibraryId": "96536b1a-fc95-4567-b518-a4ad9d898f68",
  				}
  			},
  			deviationFormats: {
  				count: {
  					"qLabel": "КоличОтклФормат.УСРЦ_день",
  					"qLibraryId": "ef2bd6d2-63c6-4581-bcd1-bc773e13726f",
  				},
  				factVsPp: {
  					"qLabel": "КоличОтклФормат.УСРЦVSпп_день",
  					"qLibraryId": "2dddc78d-49ea-4b5d-a237-86cc1d30b7fb",
  				}
  			}
  		},
  		block2: {
  			arrow: {
  				"qLabel": "Стрелка.УСРЦ",
  				"qLibraryId": "7c357dd4-7d6a-416b-b5bd-d9f2fef590f8",
  			},
  			fact: {
  				"qLabel": "ОсновнаяТаблица.УСРЦ_тп",
  				"qLibraryId": "6da08121-61b9-4791-97e1-19d40b842028",

  			},
  			factPp: {
  				"qLabel": "ОсновнаяТаблица.УСРЦ_пп",
  				"qLibraryId": "8d3b5309-ffba-4cc8-8fd9-547b12afc8df",
  			},
  			factVsPp: {
  				"qLabel": "ОсновнаяТаблица.УСРЦ_тпVSпп",
  				"qLibraryId": "562f578d-c470-4a22-958b-64b72155629c",
  			},
  			factVsPpPercent: {
  				"qLabel": "ОсновнаяТаблица.УСРЦ_тпVSпп%",
  				"qLibraryId": "e382bcb1-4737-47ce-bc1d-40315e714c37",
  			},
  			deviationRegions: {
  				factVsPp: {
  					"qLabel": "КоличОтклОкруг.УСРЦVSпп",
  					"qLibraryId": "af5a1b54-8c94-4e75-9037-d49ed0982fee",
  				},
  			},
  			deviationFormats: {
  				factVsPp: {
  					"qLabel": "КоличОтклФормат.УСРЦVSпп",
  					"qLibraryId": "e40bcce2-c5da-4771-8a18-c3b041bc2e86",
  				}
  			}
  		}
  	},
  	{
  		name: "Уровень сервиса поставщиков",
  		id: 14,
  		units: '%',
  		dimension: {
  			"qLabel": "УСПоставщиков_ID",
  			"qLibraryId": "34b6eb40-7a42-49cd-a1c2-be530a7c94fd",
  		},
  		block1: {
  			arrow: {
  				"qLabel": "Стрелка.УСПоставщика_день",
  				"qLibraryId": "7a523ea5-f2d1-4bbe-af9a-8a3eff040360",
  			},
  			fact: {
  				"qLabel": "ОсновнаяТаблица.УСПоставщика_день_тп",
  				"qLibraryId": "e6a8a29d-8fdc-4aa4-b12e-9293c86fcfb3",
  			},
  			factPp: {
  				"qLabel": "ОсновнаяТаблица.УСПоставщика_день_пп",
  				"qLibraryId": "227ae8c2-844b-48bb-aa15-10326fcb631f",
  			},
  			factVsPp: {
  				"qLabel": "ОсновнаяТаблица.УСПоставщика_день_тпVSпп",
  				"qLibraryId": "70672463-dc51-458b-9315-d46fc9e89009",
  			},
  			factVsPpPercent: {
  				"qLabel": "ОсновнаяТаблица.УСПоставщика_день_тпVSпп%",
  				"qLibraryId": "86026719-dfe9-4bfd-af51-8ce3a684e8a2",
  			},
  			deviationRegions: {
  				count: {
  					"qLabel": "КоличОтклОкруг.УСПоставщика_день",
  					"qLibraryId": "7ae10f06-33c7-41bf-ae18-aa1608120f06",
  				},
  				factVsPp: {
  					"qLabel": "КоличОтклОкруг.УСПоставщикаVSпп_день",
  					"qLibraryId": "5fbce0b2-8c56-4a86-bbb1-9c4cec2448da",
  				}
  			},
  			deviationFormats: {
  				count: {
  					"qLabel": "КоличОтклФормат.УСПоставщика_день",
  					"qLibraryId": "202976ad-c8bd-4fd8-a23d-35ebb1b97bb8",
  				},
  				factVsPp: {
  					"qLabel": "КоличОтклФормат.УСПоставщикаVSпп_день",
  					"qLibraryId": "d1906ef9-61c8-416d-9242-ce32439b3728",
  				}
  			}
  		},
  		block2: {
  			arrow: {
  				"qLabel": "Стрелка.УСПоставщика",
  				"qLibraryId": "a6f3e948-52b6-47ce-a7a4-2f19b4098ae4",
  			},
  			fact: {
  				"qLabel": "ОсновнаяТаблица.УСПоставщика_тп",
  				"qLibraryId": "b47cfd93-c580-48df-aabe-07603112211c",
  			},
  			factPp: {
  				"qLabel": "ОсновнаяТаблица.УСПоставщика_пп",
  				"qLibraryId": "7ca2cc7f-d6d9-4ed3-bb9e-71361caab9bd",
  			},
  			factVsPp: {
  				"qLabel": "ОсновнаяТаблица.УСПоставщика_тпVSпп",
  				"qLibraryId": "1bb1169d-8e8d-4027-b546-46bb48a01856",
  			},
  			factVsPpPercent: {
  				"qLabel": "ОсновнаяТаблица.УСПоставщика_тпVSпп%",
  				"qLibraryId": "37122b62-4784-496e-a651-aefaf80a3be8",
  			},
  			deviationRegions: {
  				factVsPp: {
  					"qLabel": "КоличОтклОкруг.УСПоставщикаVSпп",
  					"qLibraryId": "4c3f5970-b675-4d69-823d-db9a1521d30d",
  				}
  			},
  			deviationFormats: {
  				factVsPp: {
  					"qLabel": "КоличОтклФормат.УСПоставщикаVSпп",
  					"qLibraryId": "1ce467d0-d7e9-420d-8d7a-6deaa817bd69",
  				}
  			}
  		}
  	},
  	{
  		name: "Потери к выручке",
  		id: 15,
  		units: '%',
  		dimension: {
  			"qLabel": "ПотериКВыручке_ID",
  			"qLibraryId": "89f410b6-c001-45ee-9eaa-cb5165a7ffd6",
  		},
  		block1: {
  			arrow: {
  				"qLabel": "Стрелка.ПотериКВыручке_день",
  				"qLibraryId": "8340570c-2970-401e-ae34-e42b8fa4d455",
  			},
  			fact: {
  				"qLabel": "ОсновнаяТаблица.ПотериКВыручке_день_тп",
  				"qLibraryId": "6e15a7e4-4d5d-40ea-91b9-6c717b6f0203",
  			},
  			factPp: {
  				"qLabel": "ОсновнаяТаблица.ПотериКВыручке_день_пп",
  				"qLibraryId": "6b26e96e-55f2-49a9-a516-0cfb758fdc81",
  			},
  			factVsPp: {
  				"qLabel": "ОсновнаяТаблица.ПотериКВыручке_день_тпVSпп",
  				"qLibraryId": "f65776fe-e3b4-4cfc-bb2d-ab280b076cc2",
  			},
  			factVsPpPercent: {
  				"qLabel": "ОсновнаяТаблица.ПотериКВыручке_день_тпVSпп% (1)",
  				"qLibraryId": "af5865b5-213a-4b97-9dfb-7d0e724326ec",
  			},
  			deviationRegions: {
  				count: {
  					"qLabel": "КоличОтклОкруг.ПотериКВыручке_день",
  					"qLibraryId": "ba628319-f23b-4992-a528-67ad709f8e67",
  				},
  				factVsPp: {
  					"qLabel": "КоличОтклОкруг.ПотериКВыручкеVSпп_день",
  					"qLibraryId": "54e7e516-9410-4dbd-baab-38bfe9a0278b",
  				}
  			},
  			deviationFormats: {
  				count: {
  					"qLabel": "КоличОтклФормат.ПотериКВыручке_день",
  					"qLibraryId": "95c4f7f7-555c-4b85-a7b7-739abdc2785d",
  				},
  				factVsPp: {
  					"qLabel": "КоличОтклФормат.ПотериКВыручкеVSпп_день",
  					"qLibraryId": "cfce7aa3-484b-4c83-8a4f-32ee2a7b7c33",
  				}
  			}
  		},
  		block2: {
  			arrow: {
  				"qLabel": "Стрелка.ПотериКВыручке",
  				"qLibraryId": "e669f52a-a47b-456e-b8ae-8decbfe3645e",
  			},
  			fact: {
  				"qLabel": "ОсновнаяТаблица.ПотериКВыручке_тп",
  				"qLibraryId": "1b033b4b-f3fe-4597-945c-cefb90a59132",
  			},
  			factPp: {
  				"qLabel": "ОсновнаяТаблица.ПотериКВыручке_пп",
  				"qLibraryId": "e1dbc458-f834-4ac3-a5f7-5d0bdf58d17c",
  			},
  			factVsPp: {
  				"qLabel": "ОсновнаяТаблица.ПотериКВыручке_тпVSпп",
  				"qLibraryId": "1c1afaa1-ad3f-4711-925b-16424ee02a58",
  			},
  			factVsPpPercent: {
  				"qLabel": "ОсновнаяТаблица.ПотериКВыручке_тпVSпп%",
  				"qLibraryId": "16717fde-7cd6-495d-8c76-7558b087c4c9",
  			},
  			deviationRegions: {
  				factVsPp: {
  					"qLabel": "КоличОтклОкруг.ПотериКВыручкеVSпп",
  					"qLibraryId": "5849ef8a-5007-4d8b-ac8a-8b2ce72a0f7c",
  				}
  			},
  			deviationFormats: {
  				factVsPp: {
  					"qLabel": "КоличОтклФормат.ПотериКВыручкеVSпп",
  					"qLibraryId": "9c0273c3-6b1f-438d-9438-608f8d083b1d",
  				}
  			}
  		}
  	},
  	{
  		name: "Потери к себестоимости",
  		id: 16,
  		units: '%',
  		dimension: {
  			"qLabel": "ПотериКСебестоимости_ID",
  			"qLibraryId": "902649c5-029f-428a-9d43-50004903bf8d",
  		},
  		block1: {
  			arrow: {
  				"qLabel": "Стрелка.ПотериКСебест_день",
  				"qLibraryId": "c29ffd91-892f-4271-82ef-2c14c391daff",
  			},
  			fact: {
  				"qLabel": "ОсновнаяТаблица.ПотериКСебест_день_тп",
  				"qLibraryId": "8a03da5a-95a2-409a-8641-a089f4c3d8a6",
  			},
  			factPp: {
  				"qLabel": "ОсновнаяТаблица.ПотериКСебест_день_пп",
  				"qLibraryId": "43756e8a-67e3-405d-9a29-e9bb3d1bf731",
  			},
  			factVsPp: {
  				"qLabel": "ОсновнаяТаблица.ПотериКСебест_день_тпVSпп",
  				"qLibraryId": "94ea8ec6-12b7-4779-a958-27f23a7aff33",
  			},
  			factVsPpPercent: {
  				"qLabel": "ОсновнаяТаблица.ПотериКСебест_день_тпVSпп%",
  				"qLibraryId": "06ce2108-f403-40d7-80f1-f1008b7ff187",
  			},
  			deviationRegions: {
  				count: {
  					"qLabel": "КоличОтклОкруг.ПотериКСебест_день",
  					"qLibraryId": "c49a77b1-ff05-427b-808b-25b22bd7b5de",
  				},
  				factVsPp: {
  					"qLabel": "КоличОтклОкруг.ПотериКСебестVSпп_день",
  					"qLibraryId": "729851b7-97c1-4c54-b2d5-7428d1d3cdf2",
  				}
  			},
  			deviationFormats: {
  				count: {
  					"qLabel": "КоличОтклФормат.ПотериКСебест_день",
  					"qLibraryId": "b15d40cb-a122-4252-be8d-9fa1c82660a6",
  				},
  				factVsPp: {
  					"qLabel": "КоличОтклФормат.ПотериКСебестVSпп_день",
  					"qLibraryId": "aeda8432-dfdf-4001-aaeb-b419eb755850",
  				}
  			}
  		},
  		block2: {
  			arrow: {
  				"qLabel": "Стрелка.ПотериКСебест",
  				"qLibraryId": "b1c66f16-7adb-4465-9e9b-637ba1e3c534",
  			},
  			fact: {
  				"qLabel": "ОсновнаяТаблица.ПотериКСебест_тп",
  				"qLibraryId": "1c053d45-bb61-4311-abd9-0316624713b2",
  			},
  			factPp: {
  				"qLabel": "ОсновнаяТаблица.ПотериКСебест_пп",
  				"qLibraryId": "ffc9d1d7-7efb-4d52-881b-a6e806625208",
  			},
  			factVsPp: {
  				"qLabel": "ОсновнаяТаблица.ПотериКСебест_тпVSпп",
  				"qLibraryId": "c60470cc-a4e5-4697-bb5a-377f30f3835f",
  			},
  			factVsPpPercent: {
  				"qLabel": "ОсновнаяТаблица.ПотериКСебест_тпVSпп%",
  				"qLibraryId": "a354f9f2-090f-48fb-95a4-7ba0e52b2636",
  			},
  			deviationRegions: {
  				factVsPp: {
  					"qLabel": "КоличОтклОкруг.ПотериКСебестVSпп",
  					"qLibraryId": "45e696d1-2c54-4f89-a321-1c327224bea6",
  				}
  			},
  			deviationFormats: {
  				factVsPp: {
  					"qLabel": "КоличОтклФормат.ПотериКСебестVSпп",
  					"qLibraryId": "ff536748-e951-4c26-98e2-84c7958f7b6f",
  				}
  			}
  		}
  	},
  	{
  		name: "Потери АБС",
  		id: 17,
  		units: 'руб.',
  		dimension: {
  			"qLabel": "ПотериАБС_ID",
  			"qLibraryId": "d493215d-547f-4229-8936-75d5e7b46692",
  		},
  		block1: {
  			arrow: {
  				"qLabel": "Стрелка.ПотериАБС_день",
  				"qLibraryId": "373e521b-6bff-49dc-a171-687ba5214811",
  			},
  			fact: {
  				"qLabel": "ОсновнаяТаблица.ПотериАБС_день_тп",
  				"qLibraryId": "0c7d491c-0904-4bd7-93ba-845b9e68323d",
  			},
  			factPp: {
  				"qLabel": "ОсновнаяТаблица.ПотериАБС_день_пп",
  				"qLibraryId": "32993127-0020-438a-a6e2-5e14eb9142bc",
  			},
  			factVsPp: {
  				"qLabel": "ОсновнаяТаблица.ПотериАБС_день_тпVSпп",
  				"qLibraryId": "8f6636a4-0c54-49c8-9127-c02898b193d3",
  			},
  			factVsPpPercent: {
  				"qLabel": "ОсновнаяТаблица.ПотериАБС_день_тпVSпп%",
  				"qLibraryId": "574d20fc-8607-4143-8ba1-f6fd9a8a7638",
  			},
  			deviationRegions: {
  				count: {
  					"qLabel": "КоличОтклОкруг.Потери_день",
  					"qLibraryId": "a748e0f1-4f20-4c23-9e3f-a58a10a224c0",
  				},
  				factVsPp: {
  					"qLabel": "КоличОтклОкруг.ПотериVSпп_день",
  					"qLibraryId": "1eeba66e-5033-4686-8780-001224c0c207",
  				}
  			},
  			deviationFormats: {
  				count: {
  					"qLabel": "КоличОтклФормат.Потери_день",
  					"qLibraryId": "9d71d713-79cb-47c3-b80c-1e303969b273",
  				},
  				factVsPp: {
  					"qLabel": "КоличОтклФормат.ПотериVSпп_день",
  					"qLibraryId": "c5c24314-abd8-4e26-b712-61376dd9b292",
  				}
  			}
  		},
  		block2: {
  			arrow: {
  				"qLabel": "Стрелка.ПотериАБС",
  				"qLibraryId": "a0991ca2-5f4c-48b8-9e1a-f2a73e713751",
  			},
  			fact: {
  				"qLabel": "ОсновнаяТаблица.ПотериАбс_тп",
  				"qLibraryId": "bece4979-adfb-4af6-be26-45f2a5e0fe20",
  			},
  			factPp: {
  				"qLabel": "ОсновнаяТаблица.ПотериАбс_пп",
  				"qLibraryId": "ed0a967e-0c0a-4c3e-b889-d42bca90440a",
  			},
  			factVsPp: {
  				"qLabel": "ОсновнаяТаблица.ПотериАбс_тпVSпп",
  				"qLibraryId": "b2bf8cc4-e1d8-4209-913e-2ffb121a96ec",
  			},
  			factVsPpPercent: {
  				"qLabel": "ОсновнаяТаблица.ПотериАбс_тпVSпп%",
  				"qLibraryId": "a5099156-925f-43ed-b53c-6b34bf302c4a",
  			},
  			deviationRegions: {
  				factVsPp: {
  					"qLabel": "КоличОтклОкруг.ПотериVSпп",
  					"qLibraryId": "09d68b28-ec5e-4853-969a-bc220fc5236a",
  				}
  			},
  			deviationFormats: {
  				factVsPp: {
  					"qLabel": "КоличОтклФормат.ПотериVSпп",
  					"qLibraryId": "d070bebb-9e31-4a87-a73f-af881f32ad1b",
  				}
  			}
  		}
  	},
  	{
  		name: "Потери ШТ",
  		id: 18,
  		units: 'шт.',
  		dimension: {
  			"qLabel": "ПотериШт_ID",
  			"qLibraryId": "0fe72fe1-4868-4a7f-a370-66b0cd5c3652",
  		},
  		block1: {
  			arrow: {
  				"qLabel": "Стрелка.ПотериШт_день",
  				"qLibraryId": "49277d8b-6597-4970-b456-256e746162cd",
  			},
  			fact: {
  				"qLabel": "ОсновнаяТаблица.ПотериШт_день_тп",
  				"qLibraryId": "7f9d7a3c-207c-416b-873a-b770468ba046",
  			},
  			factPp: {
  				"qLabel": "ОсновнаяТаблица.ПотериШт_день_пп",
  				"qLibraryId": "ab98504b-e5a1-482e-9e67-a916594f1f4c",
  			},
  			factVsPp: {
  				"qLabel": "ОсновнаяТаблица.ПотериШт_день_тпVSпп",
  				"qLibraryId": "cd6929ca-eb2e-4a68-95e8-7edfb44babc6",
  			},
  			factVsPpPercent: {
  				"qLabel": "ОсновнаяТаблица.ПотериШт_день_тпVSпп%",
  				"qLibraryId": "134b7de5-fbb9-4f70-8ce8-abbc8ff38bd4",
  			},
  			deviationRegions: {
  				count: {
  					"qLabel": "КоличОтклОкруг.ПотериШт_день",
  					"qLibraryId": "b2f958e6-3c92-4808-909e-9b0d1c262ba1",
  				},
  				factVsPp: {
  					"qLabel": "КоличОтклОкруг.ПотериШтVSпп_день",
  					"qLibraryId": "17b32fc6-23dc-4e88-903a-d7c292593337",
  				}
  			},
  			deviationFormats: {
  				count: {
  					"qLabel": "КоличОтклФормат.ПотериШт_день",
  					"qLibraryId": "e94bc7e6-8332-479c-8918-1d1678d15422",
  				},
  				factVsPp: {
  					"qLabel": "КоличОтклФормат.ПотериШтVSпп_день",
  					"qLibraryId": "c959eb6a-fb76-4162-b991-6db2c388bb76",
  				}
  			}
  		},
  		block2: {
  			arrow: {
  				"qLabel": "Стрелка.ПотериШт",
  				"qLibraryId": "d0923fa8-b0d5-41e9-88f9-3179eebb68e7",
  			},
  			fact: {
  				"qLabel": "ОсновнаяТаблица.ПотериШт_тп",
  				"qLibraryId": "23cf8cf6-1430-47ba-b1d8-b9f9bb4d13e4",
  			},
  			factPp: {
  				"qLabel": "ОсновнаяТаблица.ПотериШт_пп",
  				"qLibraryId": "69b46621-d9c7-4e0f-b873-3134b08951eb",
  			},
  			factVsPp: {
  				"qLabel": "ОсновнаяТаблица.ПотериШт_тпVSпп",
  				"qLibraryId": "a2bb09a2-adcb-4487-9396-e6d7e7a75d8b",
  			},
  			factVsPpPercent: {
  				"qLabel": "ОсновнаяТаблица.ПотериШт_тпVSпп%",
  				"qLibraryId": "c5f8dfbd-34a8-4e6b-b3f4-e3c1053b0ffc",
  			},
  			deviationRegions: {
  				factVsPp: {
  					"qLabel": "КоличОтклОкруг.ПотериШтVSпп",
  					"qLibraryId": "d92098cc-4d24-460f-b656-c63930f6e114",
  				}
  			},
  			deviationFormats: {
  				factVsPp: {
  					"qLabel": "КоличОтклФормат.ПотериШтVSпп",
  					"qLibraryId": "2d41a6b9-1fbb-44c2-a971-ada2d72e16e3",
  				}
  			}
  		}
  	},
  	{
  		name: "Ассортимент",
  		id: 19,
  		units: 'шт.',
  		dimension: {
  			"qLabel": "Ассортимент_ID",
  			"qLibraryId": "e6cc53a5-fd91-431e-8ddd-52703d0a728d",
  		},
  		block1: {
  			arrow: {
  				"qLabel": "Стрелка.Ассортимент_день",
  				"qLibraryId": "6564dc23-2493-49c4-8317-70eb9ea3c23b",
  			},
  			fact: {
  				"qLabel": "ОсновнаяТаблица.Ассортимент_день_тп",
  				"qLibraryId": "d5a2469a-7260-4f6a-a17e-973bd1769ef2",
  			},
  			factPp: {
  				"qLabel": "ОсновнаяТаблица.Ассортимент_день_пп",
  				"qLibraryId": "8f7fb6da-c3f6-466c-bd26-365e2291495e",
  			},
  			factVsPp: {
  				"qLabel": "ОсновнаяТаблица.Ассортимент_день_тпVSпп",
  				"qLibraryId": "928668f9-dc24-4874-a4e8-5576f1029ea9",
  			},
  			factVsPpPercent: {
  				"qLabel": "ОсновнаяТаблица.Ассортимент_день_тпVSпп%",
  				"qLibraryId": "7efe29eb-77b7-4ca4-874c-0f877721da8a",
  			},
  			deviationRegions: {
  				count: {
  					"qLabel": "КоличОтклОкруг.Ассорт_день",
  					"qLibraryId": "16319c6b-67d3-4f51-960b-16ef5bef162b",
  				},
  				factVsPp: {
  					"qLabel": "КоличОтклОкруг.АссортVSпп_день",
  					"qLibraryId": "62fda3db-7596-4163-bef9-225327b0520c",
  				}
  			},
  			deviationFormats: {
  				count: {
  					"qLabel": "КоличОтклФормат.Ассорт_день",
  					"qLibraryId": "4dee53ce-822d-469a-9745-edeb2bc5529c",
  				},
  				factVsPp: {
  					"qLabel": "КоличОтклФормат.АссортVSпп_день",
  					"qLibraryId": "79b26516-44ca-40eb-9ceb-88324ea94bff",
  				}
  			}
  		},
  		block2: {
  			arrow: {
  				"qLabel": "Стрелка.Ассортимент",
  				"qLibraryId": "7a84aaed-5fe2-44c4-86a9-e59e5771127a",
  			},
  			fact: {
  				"qLabel": "ОсновнаяТаблица.Ассортимент_тп",
  				"qLibraryId": "de270a9d-ed48-4efd-a06d-fdbc6319c3a2",
  			},
  			factPp: {
  				"qLabel": "ОсновнаяТаблица.Ассортимент_пп",
  				"qLibraryId": "5ea8c2d1-df00-4ea4-9889-98d2827fe06e",
  			},
  			factVsPp: {
  				"qLabel": "ОсновнаяТаблица.Ассортимент_тпVSпп",
  				"qLibraryId": "2bd20e9e-05eb-4713-98cb-8205173d33eb",
  			},
  			factVsPpPercent: {
  				"qLabel": "ОсновнаяТаблица.Ассортимент_тпVSпп%",
  				"qLibraryId": "6a696181-cd76-4283-a2fc-31adc6fe68fc",
  			},
  			deviationRegions: {
  				factVsPp: {
  					"qLabel": "КоличОтклОкруг.АссортVSпп",
  					"qLibraryId": "e3fcf4d4-8f04-4ae9-b309-dab9995e8cd6",
  				}
  			},
  			deviationFormats: {
  				factVsPp: {
  					"qLabel": "КоличОтклФормат.АссортVSпп",
  					"qLibraryId": "f710e576-65aa-4923-a490-e709c04d1edd",
  				}
  			}
  		}
  	},
  	{
  		name: "Инфляция",
  		id: 20,
  		units: '%',
  		dimension: {
  			"qLabel": "Инфляция_ID",
  			"qLibraryId": "b5c2c683-13d9-4047-8220-e07f6b555afd",
  		},
  		block1: {
  			arrow: {
  				"qLabel": "Стрелка.Инфляция_день",
  				"qLibraryId": "2a19c712-8af7-473c-90d4-f6e926becbcc",
  			},
  			fact: {
  				"qLabel": "ОсновнаяТаблица.Инфляция_день_тп",
  				"qLibraryId": "7f0ba111-315e-4bbc-a278-eaebfb5bcef3",
  			},
  			factPp: {
  				"qLabel": "ОсновнаяТаблица.Инфляция_день_пп",
  				"qLibraryId": "9864317c-2d7c-4d9b-8df4-dd4bb0d24ab3",
  			},
  			factVsPp: {
  				"qLabel": "ОсновнаяТаблица.Инфляция_день_тпVSпп",
  				"qLibraryId": "d73d5288-bf7a-4fa4-957d-33d520663d65",
  			},
  			factVsPpPercent: {
  				"qLabel": "ОсновнаяТаблица.Инфляция_день_тпVSпп%",
  				"qLibraryId": "d1c8bd7a-e33c-4391-ab5c-aa6f17830f99",
  			},
  			deviationRegions: {
  				count: {
  					"qLabel": "КоличОтклОкруг.Инфляция_день",
  					"qLibraryId": "d62bcfc0-0046-4e9f-877d-66bc4d2bafeb",
  				},
  				factVsPp: {
  					"qLabel": "КоличОтклОкруг.ИнфляцияVSпп_день",
  					"qLibraryId": "0393ba93-f8c3-4e78-b668-7573dc75bd79",
  				}
  			},
  			deviationFormats: {
  				count: {
  					"qLabel": "КоличОтклФормат.Инфляция_день",
  					"qLibraryId": "9d5c16b7-3e5c-4f59-8299-ab8bdfe17203",
  				},
  				factVsPp: {
  					"qLabel": "КоличОтклФормат.ИнфляцияVSпп_день",
  					"qLibraryId": "f302cce6-46c3-4b29-bfc5-c87d1a8b122e",
  				}
  			}
  		},
  		block2: {
  			arrow: {
  				"qLabel": "Стрелка.Инфляция",
  				"qLibraryId": "a847157c-a78b-4862-b704-dbf6a65d085e",
  			},
  			fact: {
  				"qLabel": "ОсновнаяТаблица.Инфляция_тп",
  				"qLibraryId": "e8b66354-7d27-455a-99fa-671545ac98c6",
  			},
  			factPp: {
  				"qLabel": "ОсновнаяТаблица.Инфляция_пп",
  				"qLibraryId": "8b32b8f4-3970-4a8e-b2bc-af661e981649",
  			},
  			factVsPp: {
  				"qLabel": "ОсновнаяТаблица.Инфляция_тпVSпп",
  				"qLibraryId": "496b1439-cc6c-42e0-b552-79fc77924962",
  			},
  			factVsPpPercent: {
  				"qLabel": "ОсновнаяТаблица.Инфляция_тпVSпп%",
  				"qLibraryId": "ed3e717b-da65-4e30-9c00-44c07aab6cab",
  			},
  			deviationRegions: {
  				factVsPp: {
  					"qLabel": "КоличОтклОкруг.ИнфляцияVSпп",
  					"qLibraryId": "45f0b905-a540-4eb8-824f-391d3d13ca08",
  				}
  			},
  			deviationFormats: {
  				factVsPp: {
  					"qLabel": "КоличОтклФормат.ИнфляцияVSпп",
  					"qLibraryId": "e5d83ecb-5231-4ed1-9928-6659e74e19d5",
  				}
  			}
  		}
  	},
  	{
  		name: "Доступ по остаткам",
  		id: 21,
  		units: '%',
  		dimension: {
  			"qLabel": "ДоступПоОстаткам_ID",
  			"qLibraryId": "4edaaa7c-baad-4046-98c1-edcfdd67622f",
  		},
  		block1: {
  			arrow: {
  				"qLabel": "Стрелка.ДоступПоОстат_день",
  				"qLibraryId": "bfcef2f3-41b3-4879-b118-7022bf62f691",
  			},
  			fact: {
  				"qLabel": "ОсновнаяТаблица.ДоступПоОстат_день_тп",
  				"qLibraryId": "87d8a7dc-1246-404e-b740-a6b6d1c1e44e",
  			},
  			factPp: {
  				"qLabel": "ОсновнаяТаблица.ДоступПоОстат_день_пп",
  				"qLibraryId": "470a2ec5-59c7-4e81-bcb3-b380fe55873e",
  			},
  			factVsPp: {
  				"qLabel": "ОсновнаяТаблица.ДоступПоОстат_день_тпVSпп",
  				"qLibraryId": "9ef39e4a-52e7-463d-81b7-c7b8ad37bccb",
  			},
  			factVsPpPercent: {
  				"qLabel": "ОсновнаяТаблица.ДоступПоОстат_день_тпVSпп%",
  				"qLibraryId": "baa5f70f-3761-409b-8f48-a55f04cabc3e",
  			},
  			deviationRegions: {
  				count: {
  					"qLabel": "КоличОтклОкруг.ДоступностьПоОстаткам_день",
  					"qLibraryId": "733f6b7f-7113-4cd7-84bf-41d8b642e5a0",
  				},
  				factVsPp: {
  					"qLabel": "КоличОтклОкруг.ДоступностьПоОстаткамVSпп_день",
  					"qLibraryId": "939365e9-7b02-421b-8c44-f7dd95e19e95",
  				}
  			},
  			deviationFormats: {
  				count: {
  					"qLabel": "КоличОтклФормат.ДоступностьПоОстаткам_день",
  					"qLibraryId": "681c9811-101a-4536-a98a-6dc933016fdd",
  				},
  				factVsPp: {
  					"qLabel": "КоличОтклФормат.ДоступностьПоОстаткамVSпп_день",
  					"qLibraryId": "a6cca7ff-841c-4679-b151-0c969a949ad0",
  				}
  			}
  		},
  		block2: {
  			arrow: {
  				"qLabel": "Стрелка.ДоступПоОстат",
  				"qLibraryId": "42cb0600-8345-4e10-a256-ae20574d25d6",
  			},
  			fact: {
  				"qLabel": "ОсновнаяТаблица.ДоступПоОстат_тп",
  				"qLibraryId": "5ee13536-79e3-4082-842b-3beddcc3a1d6",
  			},
  			factPp: {
  				"qLabel": "ОсновнаяТаблица.ДоступПоОстат_пп",
  				"qLibraryId": "e6d3c20c-242e-405d-9bf6-cd5768b8b3e6",
  			},
  			factVsPp: {
  				"qLabel": "ОсновнаяТаблица.ДоступПоОстат_тпVSпп",
  				"qLibraryId": "0c871db4-1a59-4681-88a5-d1bb01351392",
  			},
  			factVsPpPercent: {
  				"qLabel": "ОсновнаяТаблица.ДоступПоОстат_тпVSпп%",
  				"qLibraryId": "6b994f97-fd43-4b56-96ab-b2875487b4e1",
  			},
  			deviationRegions: {
  				factVsPp: {
  					"qLabel": "КоличОтклОкруг.ДоступностьПоОстаткамVSпп",
  					"qLibraryId": "cd95d56a-da65-4fba-ad00-44e1a1f6150a",
  				}
  			},
  			deviationFormats: {
  				factVsPp: {
  					"qLabel": "КоличОтклФормат.ДоступностьПоОстаткамVSпп",
  					"qLibraryId": "b8437740-922d-4343-8b04-91c5b850d413",
  				}
  			}
  		}
  	},
  	{
  		name: "Доступ по продажам",
  		id: 22,
  		units: '%',
  		dimension: {
  			"qLabel": "ДоступПоПродажам_ID",
  			"qLibraryId": "66741b46-868c-446a-a63c-e10031a94d53",
  		},
  		block1: {
  			arrow: {
  				"qLabel": "Стрелка.ДоступПоПродаж_день",
  				"qLibraryId": "aa165191-2dac-4dbe-818b-0b48fb18d2f9",
  			},
  			fact: {
  				"qLabel": "ОсновнаяТаблица.ДоступПоПродаж_день_тп",
  				"qLibraryId": "d84e10b0-3da9-4235-94d3-9271b9a3875a",
  			},
  			factPp: {
  				"qLabel": "ОсновнаяТаблица.ДоступПоПродаж_день_пп",
  				"qLibraryId": "aeae98c0-4b85-4332-ac55-539f55aebd64",
  			},
  			factVsPp: {
  				"qLabel": "ОсновнаяТаблица.ДоступПоПродаж_день_тпVSпп",
  				"qLibraryId": "18577ecd-0770-4499-9151-7a47d5415fc7",
  			},
  			factVsPpPercent: {
  				"qLabel": "ОсновнаяТаблица.ДоступПоПродаж_день_тпVSпп%",
  				"qLibraryId": "de8f7f7c-8285-459b-aaa1-fefe38b4fd51",
  			},
  			deviationRegions: {
  				count: {
  					"qLabel": "КоличОтклОкруг.ДоступностьПоПродажам_день",
  					"qLibraryId": "e663bc7d-cfe6-4d68-9490-d07c1bd7e5bd",
  				},
  				factVsPp: {
  					"qLabel": "КоличОтклОкруг.ДоступностьПоПродажамVSпп_день",
  					"qLibraryId": "30f506af-38ee-4719-bef9-974e4f0af871",
  				}	
  			},
  			deviationFormats: {
  				count: {
  					"qLabel": "КоличОтклФормат.ДоступностьПоПродажам_день",
  					"qLibraryId": "35e86aa4-f6e0-497a-bd89-8ff31d669c15",
  				},
  				factVsPp: {
  					"qLabel": "КоличОтклФормат.ДоступностьПоПродажамVSпп_день",
  					"qLibraryId": "90c7ca44-a25f-4c64-ac65-79a4bf78571a",
  				}
  			}
  		},
  		block2: {
  			arrow: {
  				"qLabel": "Стрелка.ДоступПоПродаж",
  				"qLibraryId": "a36f0b27-bbec-47b8-be48-3c7861d3cc48",
  			},
  			fact: {
  				"qLabel": "ОсновнаяТаблица.ДоступПоПродаж_тп",
  				"qLibraryId": "edbad08a-2a89-46b7-b925-d8b2d352494a",
  			},
  			factPp: {
  				"qLabel": "ОсновнаяТаблица.ДоступПоПродаж_пп",
  				"qLibraryId": "1af0d181-3234-4f8c-907e-6fc471070469",
  			},
  			factVsPp: {
  				"qLabel": "ОсновнаяТаблица.ДоступПоПродаж_тпVSпп",
  				"qLibraryId": "ba15b8bb-6c00-4c95-850d-99e6e0ad2d2c",
  			},
  			factVsPpPercent: {
  				"qLabel": "ОсновнаяТаблица.ДоступПоПродаж_тпVSпп%",
  				"qLibraryId": "14e0e6c7-3dd4-4716-b15d-a7173a48e65c",
  			},
  			deviationRegions: {
  				factVsPp: {
  					"qLabel": "КоличОтклОкруг.ДоступностьПоПродажамVSпп",
  					"qLibraryId": "d4f83468-b3f4-416e-be89-afb6ded8a4c3",
  				}		
  			},
  			deviationFormats: {
  				factVsPp: {
  					"qLabel": "КоличОтклФормат.ДоступностьПоПродажамVSпп",
  					"qLibraryId": "bae61d44-7b1d-4229-83a0-581aa7165786",
  				}
  			}
  		}
  	},
  	{
  		name: "Промо",
  		id: 23,
  		units: '%',
  		dimension: {
  			"qLabel": "Промо_ID",
  			"qLibraryId": "112b0ff8-2ad4-42be-b53d-88a946d0a57c",
  		},
  		block1: {
  			arrow: {
  				"qLabel": "Стрелка.Промо_день",
  				"qLibraryId": "bd47bfc2-1d28-4f68-b16d-f6b96b57af50",
  			},
  			fact: {
  				"qLabel": "ОсновнаяТаблица.Промо_день_тп",
  				"qLibraryId": "408338ac-5769-4691-83a9-d95468a0037f",
  			},
  			factPp: {
  				"qLabel": "ОсновнаяТаблица.Промо_день_пп",
  				"qLibraryId": "85bd44de-4182-4d1e-a8dd-95309d5f5c05",
  			},
  			factVsPp: {
  				"qLabel": "ОсновнаяТаблица.Промо_день_тпVSпп",
  				"qLibraryId": "14860b8d-597e-4379-a34a-805d360fed55",
  			},
  			factVsPpPercent: {
  				"qLabel": "ОсновнаяТаблица.Промо_день_тпVSпп%",
  				"qLibraryId": "86fcd4cf-c244-42fe-bafc-12812aae97f6",
  			},
  			deviationRegions: {
  				count: {
  					"qLabel": "КоличОтклОкруг.РТОПромо_день",
  					"qLibraryId": "a0874c5a-3342-4999-b379-5401d8d7f78b",
  				},
  				factVsPp: {
  					"qLabel": "КоличОтклОкруг.РТОПромоVSпп_день",
  					"qLibraryId": "7003650b-e876-4e52-825f-1cd908cf6662",
  				},
  			},
  			deviationFormats: {
  				count: {
  					"qLabel": "КоличОтклФормат.РТОПромо_день",
  					"qLibraryId": "0a561a1c-2471-4dce-9860-9f70b3654d57",
  				},
  				factVsPp: {
  					"qLabel": "КоличОтклФормат.РТОПромоVSпп_день",
  					"qLibraryId": "851190a2-cc36-41ee-a75b-6fb88328b333",
  				}
  			}
  		},
  		block2: {
  			arrow: {
  				"qLabel": "Стрелка.Промо",
  				"qLibraryId": "78414874-25e8-4626-a9fe-fa9f93ec99b2",
  			},
  			fact: {
  				"qLabel": "ОсновнаяТаблица.Промо_тп",
  				"qLibraryId": "e342e28a-4a44-4d01-8668-18af2ca652cc",
  			},
  			factPp: {
  				"qLabel": "ОсновнаяТаблица.Промо_пп",
  				"qLibraryId": "094d9b5c-6bf1-4855-95dd-e1a8f7c6e983",
  			},
  			factVsPp: {
  				"qLabel": "ОсновнаяТаблица.Промо_тпVSпп",
  				"qLibraryId": "8744f156-9c12-44d8-a5a1-e7141b73ac6d",
  			},
  			factVsPpPercent: {
  				"qLabel": "ОсновнаяТаблица.Промо_тпVSпп%",
  				"qLibraryId": "5163b47e-2372-426b-b668-1dca66e5bb2d",
  			},
  			deviationRegions: {
  				factVsPp: {
  					"qLabel": "КоличОтклОкруг.РТОПромоVSпп",
  					"qLibraryId": "aa8c20d8-34c5-40fe-b024-0732214f6307",
  				}
  			},
  			deviationFormats: {
  				factVsPp: {
  					"qLabel": "КоличОтклФормат.РТОПромоVSпп",
  					"qLibraryId": "e2a6252b-1139-4a6e-ae2c-6953156fbd67",
  				}
  			}
  		}
  	},
  	{
  		name: "Front margin",
  		id: 24,
  		units: '%',
  		dimension: {
  			"qLabel": "FrontMargin_ID",
  			"qLibraryId": "AgMURp",
  		},
  		block1: {
  			arrow: {
  				"qLabel": "Стрелка.FrontMargin_день",
  				"qLibraryId": "21952af2-095c-4045-8fb7-48547d150670",
  			},
  			fact: {
  				"qLabel": "ОсновнаяТаблица.FrontMargin_день_тп",
  				"qLibraryId": "96ddc54b-92c5-4dd6-b205-cdb875fa2adc",
  			},
  			factPp: {
  				"qLabel": "ОсновнаяТаблица.FrontMargin_день_пп",
  				"qLibraryId": "6f108cf4-e0d7-45e0-8f24-d3f0abc2322f",
  			},
  			factVsPp: {
  				"qLabel": "ОсновнаяТаблица.FrontMargin_день_тпVSпп",
  				"qLibraryId": "f8b950a0-8feb-4c47-b053-c74c63bf90d3",
  			},
  			factVsPpPercent: {
  				"qLabel": "ОсновнаяТаблица.FrontMargin_день_тпVSпп%",
  				"qLibraryId": "15748d98-19d4-4de6-aa68-bf187f07d3c2",
  			},
  			deviationRegions: {
  				count: {
  					"qLabel": "КоличОтклОкруг.FrontMargin_день",
  					"qLibraryId": "3ce4da69-c719-45f3-9850-e4f8cf2d72b0",
  				},
  				factVsPp: {
  					"qLabel": "КоличОтклОкруг.FrontMarginVSпп_день",
  					"qLibraryId": "7458120f-dacc-425b-b11e-839274438af8",
  				}
  			},
  			deviationFormats: {
  				count: {
  					"qLabel": "КоличОтклФормат.FrontMargin_день",
  					"qLibraryId": "f8b38174-bb3f-48cd-8848-878a36c25e5a",
  				},
  				factVsPp: {
  					"qLabel": "КоличОтклФормат.FrontMarginVSпп_день",
  					"qLibraryId": "497a2413-2532-4d6c-a4b5-ef2cda58b6bf",
  				}
  			}
  		},
  		block2: {
  			arrow: {
  				"qLabel": "Стрелка.FrontMargin",
  				"qLibraryId": "65a36911-f7fd-4f68-b84f-c525ecc2e734",
  			},
  			fact: {
  				"qLabel": "ОсновнаяТаблица.FrontMargin_тп",
  				"qLibraryId": "33e23945-5726-4b21-ad08-9896586c2fca",
  			},
  			factPp: {
  				"qLabel": "ОсновнаяТаблица.FrontMargin_пп",
  				"qLibraryId": "6da851e4-e077-4edf-9ca1-f43166a695c2",
  			},
  			factVsPp: {
  				"qLabel": "ОсновнаяТаблица.FrontMargin_тпVSпп",
  				"qLibraryId": "79ec6d67-2327-4e06-8f4a-3bf0f0a53f53",
  			},
  			factVsPpPercent: {
  				"qLabel": "ОсновнаяТаблица.FrontMargin_тпVSпп%",
  				"qLibraryId": "fa82222c-8185-4589-b8fb-1b65ab219e89",
  			},
  			deviationRegions: {
  				factVsPp: {
  					"qLabel": "КоличОтклОкруг.FrontMarginVSпп",
  					"qLibraryId": "c48ac7b1-3639-4245-9d81-c7a271f3dc06",
  				}
  			},
  			deviationFormats: {
  				factVsPp: {
  					"qLabel": "КоличОтклФормат.FrontMarginVSпп",
  					"qLibraryId": "3da9f5ed-b5de-4d0f-abc3-f0facc554a9f",
  				}
  			}
  		}
  	},
  	{
  		name: "Коммерческая маржа",
  		id: 25,
  		units: '%',
  		dimension: {
  			"qLabel": "КомМаржа_ID",
  			"qLibraryId": "435c1fe2-4c20-4c24-bfa8-2587fd9e1928",
  		},
  		block1: {
  			arrow: {
  				"qLabel": "Стрелка.КомМаржа_день",
  				"qLibraryId": "5c4f7701-3791-428d-915b-2851d9fbd3f7",
  			},
  			fact: {
  				"qLabel": "ОсновнаяТаблица.КомМаржа_день_тп",
  				"qLibraryId": "746ae931-8d90-4ccc-bfd7-913709e180be",
  			},
  			factPp: {
  				"qLabel": "ОсновнаяТаблица.КомМаржа_день_пп",
  				"qLibraryId": "cf7966b6-f30d-4248-834f-f57a7a922af7",
  			},
  			factVsPp: {
  				"qLabel": "ОсновнаяТаблица.КомМаржа_день_тпVSпп",
  				"qLibraryId": "9a69bedc-32ec-41f0-88cc-91adf21d60a4",
  			},
  			factVsPpPercent: {
  				"qLabel": "ОсновнаяТаблица.КомМаржа_день_тпVSпп%",
  				"qLibraryId": "c2c3cf97-2c4b-4585-a948-77bc56c5add9",
  			},
  			deviationRegions: {
  				count: {
  					"qLabel": "КоличОтклОкруг.КомМаржа_день",
  					"qLibraryId": "8767dbde-4541-48fc-be68-5dd5473171d1",
  				},
  				factVsPp: {
  					"qLabel": "КоличОтклОкруг.КомМаржаVSпп_день",
  					"qLibraryId": "1d6f6653-5f1a-4a12-8112-41ce4548a9f2",
  				}
  			},
  			deviationFormats: {
  				count: {
  					"qLabel": "КоличОтклФормат.КомМаржа_день",
  					"qLibraryId": "0e4909a2-cdd4-49fa-88d5-76133d30cdea",
  				},
  				factVsPp: {
  					"qLabel": "КоличОтклФормат.КомМаржаVSпп_день",
  					"qLibraryId": "4cf3aff2-2566-47ad-8edc-8bc1f707c419",
  				}
  			}
  		},
  		block2: {
  			arrow: {
  				"qLabel": "Стрелка.КомМаржа",
  				"qLibraryId": "a5eea6d0-0c6f-4b80-9429-4d3516f5c952",
  			},
  			fact: {
  				"qLabel": "ОсновнаяТаблица.КомМаржа_тп",
  				"qLibraryId": "51f00a4d-dbf6-431b-809c-4c033a8ebeef",
  			},
  			factPp: {
  				"qLabel": "ОсновнаяТаблица.КомМаржа_пп",
  				"qLibraryId": "885c69db-6894-429b-84c2-42286edcd00d",
  			},
  			factVsPp: {
  				"qLabel": "ОсновнаяТаблица.КомМаржа_тпVSпп",
  				"qLibraryId": "63ea0936-ecab-4c7e-801b-2647d633469b",
  			},
  			factVsPpPercent: {
  				"qLabel": "ОсновнаяТаблица.КомМаржа_тпVSпп%",
  				"qLibraryId": "a2449ec4-050b-4567-b8ae-e875158087a6",
  			},
  			deviationRegions: {
  				factVsPp: {
  					"qLabel": "КоличОтклОкруг.КомМаржаVSпп",
  					"qLibraryId": "b548cf36-f80c-4a31-83a5-1581ee609dc4",
  				}
  			},
  			deviationFormats: {
  				factVsPp: {
  					"qLabel": "КоличОтклФормат.КомМаржаVSпп",
  					"qLibraryId": "fe143b54-a3f9-4a1b-90c9-b0c29840f339",
  				}
  			}
  		}
  	},
  	{
  		name: "РТОVSМониторинг",
  		id: 26,
  		units: '%',
  		dimension: {
  			"qLabel": "РТОVSМониторингу_ID",
  			"qLibraryId": "ff0b83e2-6cd3-481e-a799-dcb451e77454",
  		},
  		block1: {
  			arrow: {
  				"qLabel": "Стрелка.РТОVSМониторингу_день",
  				"qLibraryId": "8c33c500-15ce-487c-ad82-4502206ca4af",
  			},
  			fact: {
  				"qLabel": "ОсновнаяТаблица.РТОVSМониторингу_день_тп",
  				"qLibraryId": "8b3a97c3-cf26-4df4-9d3e-13d372ede935",
  			},
  			factPp: {
  				"qLabel": "ОсновнаяТаблица.РТОVSМониторингу_день_пп",
  				"qLibraryId": "b33abdd1-8d1f-4724-aaa5-48e019b0a847",
  			},
  			factVsPp: {
  				"qLabel": "ОсновнаяТаблица.РТОVSМониторингу_день_тпVSпп",
  				"qLibraryId": "f011dca0-0ea5-4310-8dbe-d647e454205d",
  			},
  			factVsPpPercent: {
  				"qLabel": "ОсновнаяТаблица.РТОVSМониторингу_день_тпVSпп%",
  				"qLibraryId": "3deb7a84-88fb-4941-a7a8-aeeae29c357f",
  			},
  			deviationRegions: {
  				count: {
  					"qLabel": "КоличОтклОкруг.ДоляРТОПоМониторингу_день",
  					"qLibraryId": "32b20b83-af1f-4ef6-af0e-68fe7b004d03",
  				},
  				factVsPp: {
  					"qLabel": "КоличОтклОкруг.ДоляРТОПоМониторингуVSпп_день",
  					"qLibraryId": "0a19afc3-2d8d-4b45-98ed-75829e51fe06",
  				}
  			},
  			deviationFormats: {
  				count: {
  					"qLabel": "КоличОтклФормат.ДоляРТОПоМониторингу_день",
  					"qLibraryId": "57e6298b-d0a7-4895-b9ae-811acd239990",
  				},
  				factVsPp: {
  					"qLabel": "КоличОтклФормат.ДоляРТОПоМониторингуVSпп_день",
  					"qLibraryId": "eda2e8fd-e7c1-4e2e-bc31-56b99420453d",
  				}
  			}
  		},
  		block2: {
  			arrow: {
  				"qLabel": "Стрелка.РТОVSМониторингу",
  				"qLibraryId": "cf370cf9-73d8-471b-9d1c-666d4de07078",
  			},
  			fact: {
  				"qLabel": "ОсновнаяТаблица.РТОVSМониторингу_тп",
  				"qLibraryId": "eca4f184-5c56-4cf3-b95b-97452f128a74",
  			},
  			factPp: {
  				"qLabel": "ОсновнаяТаблица.РТОVSМониторингу_пп",
  				"qLibraryId": "b4055709-e091-493c-b52b-c985001b0f0a",
  			},
  			factVsPp: {
  				"qLabel": "ОсновнаяТаблица.РТОVSМониторингу_тпVSпп",
  				"qLibraryId": "eb06ef07-7265-4899-9377-3332579ea23c",
  			},
  			factVsPpPercent: {
  				"qLabel": "ОсновнаяТаблица.РТОVSМониторингу_тпVSпп%",
  				"qLibraryId": "b7ec6ec3-ad4c-4853-9e6e-256f9a8e210c",
  			},
  			deviationRegions: {
  				factVsPp: {
  					"qLabel": "КоличОтклОкруг.ДоляРТОПоМониторингуVSпп",
  					"qLibraryId": "d4b0b4b8-e81b-4ef3-91a8-65b2fd37e05c",
  				}
  			},
  			deviationFormats: {
  				factVsPp: {
  					"qLabel": "КоличОтклФормат.ДоляРТОПоМониторингуVSпп",
  					"qLibraryId": "7b5095c6-09ab-4f2f-9b84-16e1ddc53ad5",
  				}
  			}
  		}
  	},
  	{
  		name: "РТОVSЛояльность",
  		id: 27,
  		units: '%',
  		dimension: {
  			"qLabel": "РТОVSЛояльность_ID",
  			"qLibraryId": "37cc4f2b-5700-4754-89ec-36ea188112ef",
  		},
  		block1: {
  			arrow: {
  				"qLabel": "Стрелка.РТОVSЛояльность_день",
  				"qLibraryId": "83dc6ba8-6673-40fb-8029-54f12f4582e9",
  			},
  			fact: {
  				"qLabel": "ОсновнаяТаблица.РТОVSЛояльность_день_тп",
  				"qLibraryId": "1a4ffc29-bf51-4751-824a-82659074b432",
  			},
  			factPp: {
  				"qLabel": "ОсновнаяТаблица.РТОVSЛояльность_день_пп",
  				"qLibraryId": "2b2c45a4-fd45-4f26-be16-b37fa9da225b",
  			},
  			factVsPp: {
  				"qLabel": "ОсновнаяТаблица.РТОVSЛояльность_день_тпVSпп",
  				"qLibraryId": "1c68d706-0197-49a5-af18-b0fa2dc62f03",
  			},
  			factVsPpPercent: {
  				"qLabel": "ОсновнаяТаблица.РТОVSЛояльность_день_тпVSпп%",
  				"qLibraryId": "d61cabc1-8e84-42a4-a8d8-4b0b072298d6",
  			},
  			deviationRegions: {
  				count: {
  					"qLabel": "КоличОтклОкруг.ДоляРТОПоКартамЛояльности_день",
  					"qLibraryId": "ba4127d3-21e3-4d89-8194-9199cfa47585",
  				},
  				factVsPp: {
  					"qLabel": "КоличОтклОкруг.ДоляРТОПоКартамЛояльностиVSпп_день",
  					"qLibraryId": "92a605ec-1f01-4946-8822-812737f3080b",
  				}
  			},
  			deviationFormats: {
  				count: {
  					"qLabel": "КоличОтклФормат.ДоляРТОПоКартамЛояльности_день",
  					"qLibraryId": "0075d500-ffb0-488b-a3b5-ca45f4d07338",
  				},
  				factVsPp: {
  					"qLabel": "КоличОтклФормат.ДоляРТОПоКартамЛояльностиVSпп_день",
  					"qLibraryId": "b4a5690a-2e55-4fb2-8054-ed7c91a98328",
  				}
  			}
  		},
  		block2: {
  			arrow: {
  				"qLabel": "Стрелка.РТОVSЛояльность",
  				"qLibraryId": "6c459f0d-0b4e-4340-8550-934354a6efba",
  			},
  			fact: {
  				"qLabel": "ОсновнаяТаблица.РТОVSЛояльность_тп",
  				"qLibraryId": "c4e80c49-785c-4263-9e71-e42bf9b029c8",
  			},
  			factPp: {
  				"qLabel": "ОсновнаяТаблица.РТОVSЛояльность_пп",
  				"qLibraryId": "9ede6d03-197a-4313-a54e-e977fd6c8054",
  			},
  			factVsPp: {
  				"qLabel": "ОсновнаяТаблица.РТОVSЛояльность_тпVSпп",
  				"qLibraryId": "f8197b71-ea55-4ed4-8ace-e88bfc40fec9",
  			},
  			factVsPpPercent: {
  				"qLabel": "ОсновнаяТаблица.РТОVSЛояльность_тпVSпп%",
  				"qLibraryId": "aa3cfe66-5526-42cb-90b7-89d68209faea",
  			},
  			deviationRegions: {
  				factVsPp: {
  					"qLabel": "КоличОтклОкруг.ДоляРТОПоКартамЛояльностиVSпп",
  					"qLibraryId": "cc9c3a2f-ace2-4fd2-a4b3-c9a9bb930c33",
  				}
  			},
  			deviationFormats: {
  				factVsPp: {
  					"qLabel": "КоличОтклФормат.ДоляРТОПоКартамЛояльностиVSпп",
  					"qLibraryId": "4f0e9c75-4c0e-4cc0-9f3b-fdb11e89332c",
  				}
  			}
  		}
  	},
  	{
  		name: "РТОVSУценка",
  		id: 28,
  		units: '%',
  		dimension: {
  			"qLabel": "РТОVSУценка_ID",
  			"qLibraryId": "pRpqjh",
  		},
  		block1: {
  			arrow: {
  				"qLabel": "Стрелка.РТОVSУценка_день",
  				"qLibraryId": "6144f9e4-c78d-4897-ba05-c978b8e1104b",
  			},
  			fact: {
  				"qLabel": "ОсновнаяТаблица.РТОVSУценка_день_тп",
  				"qLibraryId": "61f5a1f0-f297-4e2f-b2bb-a98cee72ef30",
  			},
  			factPp: {
  				"qLabel": "ОсновнаяТаблица.РТОVSУценка_день_пп",
  				"qLibraryId": "66231cf3-7da0-436e-808b-b0fccb8361df",
  			},
  			factVsPp: {
  				"qLabel": "ОсновнаяТаблица.РТОVSУценка_день_тпVSпп",
  				"qLibraryId": "f647a1f9-b916-42af-b1bb-01a8d493a839",
  			},
  			factVsPpPercent: {
  				"qLabel": "ОсновнаяТаблица.РТОVSУценка_день_тпVSпп%",
  				"qLibraryId": "78d0b9fc-203f-4906-a00c-76e51240ebd9",
  			},
  			deviationRegions: {
  				count: {
  					"qLabel": "КоличОтклОкруг.ДоляРТОПоУценке_день",
  					"qLibraryId": "1797bed8-2ff6-4c4a-9944-8f32123cd095",
  				},
  				factVsPp: {
  					"qLabel": "КоличОтклОкруг.ДоляРТОПоУценкеVSпп_день",
  					"qLibraryId": "171fe0d6-5d9c-4450-8324-854d76906353",
  				}
  			},
  			deviationFormats: {
  				count: {
  					"qLabel": "КоличОтклФормат.ДоляРТОПоУценке_день",
  					"qLibraryId": "4b62d965-1cef-49ba-a370-cb8149d75de0",
  				},
  				factVsPp: {
  					"qLabel": "КоличОтклФормат.ДоляРТОПоУценкеVSпп_день (1)",
  					"qLibraryId": "1d243cc3-ee9c-4d1c-80e3-7cb7761930bd",
  				}
  			}
  		},
  		block2: {
  			arrow: {
  				"qLabel": "Стрелка.РТОVSУценка",
  				"qLibraryId": "e5094a15-c054-4ed8-9ff0-7d9c4f5ae13d",
  			},
  			fact: {
  				"qLabel": "ОсновнаяТаблица.РТОVSУценка_тп",
  				"qLibraryId": "a9b82474-4d8e-4ce4-8577-4d0b9558d5b7",
  			},
  			factPp: {
  				"qLabel": "ОсновнаяТаблица.РТОVSУценка_пп",
  				"qLibraryId": "4cd98b18-4d32-4e0e-ace0-e513a522c6fd",
  			},
  			factVsPp: {
  				"qLabel": "ОсновнаяТаблица.РТОVSУценка_тпVSпп",
  				"qLibraryId": "44cca4db-fc06-4627-87ca-6a18b8b86d86",
  			},
  			factVsPpPercent: {
  				"qLabel": "ОсновнаяТаблица.РТОVSУценка_тпVSпп%",
  				"qLibraryId": "37f33991-c517-4703-b364-5d6d5b7d55e5",
  			},
  			deviationRegions: {
  				factVsPp: {
  					"qLabel": "КоличОтклОкруг.ДоляРТОПоУценкеVSпп",
  					"qLibraryId": "094a4e79-b6a7-491a-987f-855ab14f58fb",
  				}
  			},
  			deviationFormats: {
  				factVsPp: {
  					"qLabel": "КоличОтклФормат.ДоляРТОПоУценкеVSпп",
  					"qLibraryId": "9f974c6a-ceb7-40cf-b4b1-961461ce4c31",
  				}
  			}
  		}
  	},
  	{
  		name: "РТОVSПромо",
  		id: 29,
  		units: '%',
  		dimension: {
  			"qLabel": "РТОVSПромо_ID",
  			"qLibraryId": "a558b69a-a201-49b2-9b16-296964529e62",
  		},
  		block1: {
  			arrow: {
  				"qLabel": "Стрелка.РТОVSПромо_день",
  				"qLibraryId": "9b4b9474-6520-476d-8b74-45ca0993842f",
  			},
  			fact: {
  				"qLabel": "ОсновнаяТаблица.РТОVSПромо_день_тп",
  				"qLibraryId": "c396e3bc-d6cf-41fe-a86b-c9839cd5535b",
  			},
  			factPp: {
  				"qLabel": "ОсновнаяТаблица.РТОVSПромо_день_пп",
  				"qLibraryId": "0db75cf9-6176-4c10-9ad5-5a71eb55e00b",
  			},
  			factVsPp: {
  				"qLabel": "ОсновнаяТаблица.РТОVSПромо_день_тпVSпп",
  				"qLibraryId": "fd67f193-edb0-4cad-8b0e-231a7abbe4b4",
  			},
  			factVsPpPercent: {
  				"qLabel": "ОсновнаяТаблица.РТОVSПромо_день_тпVSпп%",
  				"qLibraryId": "23120287-b951-4fa6-b250-a377e2f9c0e9",
  			},
  			deviationRegions: {
  				count: {
  					"qLabel": "КоличОтклОкруг.ДоляРТОПоОсновномуПромо_день",
  					"qLibraryId": "9dd2f9df-e6c4-4b8e-b57e-feb21c9a9db8",
  				},
  				factVsPp: {
  					"qLabel": "КоличОтклОкруг.ДоляРТОПоОсновномуПромоVSпп_день",
  					"qLibraryId": "26a37cee-dfb4-496f-8fee-68222fe23e9c",
  				}
  			},
  			deviationFormats: {
  				count: {
  					"qLabel": "КоличОтклФормат.ДоляРТОПоОсновномуПромо_день",
  					"qLibraryId": "c50889ff-f0ce-4043-8c9b-ee03991908b3",
  				},
  				factVsPp: {
  					"qLabel": "КоличОтклФормат.ДоляРТОПоОсновномуПромоVSпп_день (1)",
  					"qLibraryId": "b83cc0c6-7dc4-404a-9672-01dc00eeb2af",
  				}
  			}
  		},
  		block2: {
  			arrow: {
  				"qLabel": "Стрелка.РТОVSПромо",
  				"qLibraryId": "e58b28e5-3710-457a-9ff0-646417aee38c",
  			},
  			fact: {
  				"qLabel": "ОсновнаяТаблица.РТОVSПромо_тп",
  				"qLibraryId": "23ebe63e-b474-4e2a-8f71-f02da74c3fe5",
  			},
  			factPp: {
  				"qLabel": "ОсновнаяТаблица.РТОVSПромо_пп",
  				"qLibraryId": "acb14170-d778-4636-a78f-687b505d9098",
  			},
  			factVsPp: {
  				"qLabel": "ОсновнаяТаблица.РТОVSПромо_тпVSпп",
  				"qLibraryId": "1db87312-daa1-41dd-b3e8-dd8caf070b1e",
  			},
  			factVsPpPercent: {
  				"qLabel": "ОсновнаяТаблица.РТОVSПромо_тпVSпп%",
  				"qLibraryId": "f125e0d8-b2d8-49b2-b50c-a077f6946aad",
  			},
  			deviationRegions: {
  				factVsPp: {
  					"qLabel": "КоличОтклОкруг.ДоляРТОПоОсновномуПромоVSпп",
  					"qLibraryId": "b8ff8b5b-7bcf-43d4-b779-1ef43220ed06",
  				}
  			},
  			deviationFormats: {
  				factVsPp: {
  					"qLabel": "КоличОтклФормат.ДоляРТОПоОсновномуПромоVSпп",
  					"qLibraryId": "c9475144-dcea-4cf0-a99b-60eb863da643",
  				}
  			}
  		}
  	},
  	{
  		name: "РТОVSРегулярная",
  		id: 30,
  		units: '%',
  		dimension: {
  			"qLabel": "РТОVSРегулярная_ID",
  			"qLibraryId": "b720fea3-d86b-460b-9cc4-02d95b3dc146",
  		},
  		block1: {
  			arrow: {
  				"qLabel": "Стрелка.РТОVSРегулярная_день",
  				"qLibraryId": "f57b35ff-a7b0-45fa-8fcf-ae68f0a25046",
  			},
  			fact: {
  				"qLabel": "ОсновнаяТаблица.РТОVSРегулярная_день_тп",
  				"qLibraryId": "cb8b8960-9e66-4060-a7ed-ba9dced9dbc2",
  			},
  			factPp: {
  				"qLabel": "ОсновнаяТаблица.РТОVSРегулярная_день_пп",
  				"qLibraryId": "cc787d19-12e6-4897-854a-719332da1a74",
  			},
  			factVsPp: {
  				"qLabel": "ОсновнаяТаблица.РТОVSРегулярная_день_тпVSпп",
  				"qLibraryId": "134cd756-ec63-47b0-bd39-1bda9231cc91",
  			},
  			factVsPpPercent: {
  				"qLabel": "ОсновнаяТаблица.РТОVSРегулярная_день_тпVSпп%",
  				"qLibraryId": "16385b7b-238b-4617-acc0-497d002e0ab8",
  			},
  			deviationRegions: {
  				count: {
  					"qLabel": "КоличОтклОкруг.ДоляРТОПоРегулярная_день",
  					"qLibraryId": "1cd8a811-ca13-4929-b7ea-ac7ef3604ee8",
  				},
  				factVsPp: {
  					"qLabel": "КоличОтклОкруг.ДоляРТОПоРегулярнаяVSпп_день",
  					"qLibraryId": "5e8ee98e-c775-4963-a1ae-0d8806c45cc0",
  				}
  			},
  			deviationFormats: {
  				count: {
  					"qLabel": "КоличОтклФормат.ДоляРТОПоРегулярная_день",
  					"qLibraryId": "7759b2c4-412a-4b90-bdf0-ab58d90e5478",
  				},
  				factVsPp: {
  					"qLabel": "КоличОтклФормат.ДоляРТОПоРегулярнаяVSпп_день",
  					"qLibraryId": "4f6eb0ca-063a-48c1-91fd-eb923229d7f6",
  				}
  			}
  		},
  		block2: {
  			arrow: {
  				"qLabel": "Стрелка.РТОVSРегулярная",
  				"qLibraryId": "1d5cf18c-d2b0-490b-ba22-273b216e92cf",
  			},
  			fact: {
  				"qLabel": "ОсновнаяТаблица.РТОVSРегулярная_тп",
  				"qLibraryId": "8ab1d9b2-ccb5-4e65-b98d-b1b17ffacc29",
  			},
  			factPp: {
  				"qLabel": "ОсновнаяТаблица.РТОVSРегулярная_пп",
  				"qLibraryId": "ce5c9116-a0d0-4a2b-ae65-07fee9b07e0c",
  			},
  			factVsPp: {
  				"qLabel": "ОсновнаяТаблица.РТОVSРегулярная_тпVSпп",
  				"qLibraryId": "39bda0da-3c7a-4620-9d81-77545e3730d8",
  			},
  			factVsPpPercent: {
  				"qLabel": "ОсновнаяТаблица.РТОVSРегулярная_тпVSпп%",
  				"qLibraryId": "ff88042c-d1c5-435b-8d6b-1456613ff82e",
  			},
  			deviationRegions: {
  				factVsPp: {
  					"qLabel": "КоличОтклОкруг.ДоляРТОПоРегулярнаяVSпп",
  					"qLibraryId": "4201bfe4-0321-420a-a69a-3ed9875a6c64",
  				}
  			},
  			deviationFormats: {
  				factVsPp: {
  					"qLabel": "КоличОтклФормат.ДоляРТОПоРегулярнаяVSпп",
  					"qLibraryId": "2172e34a-b399-459a-9fdf-830f89b03678",
  				}
  			}
  		}
  	},
  	{
  		name: "РТОVSПрочее",
  		id: 31,
  		units: '%',
  		dimension: {
  			"qLabel": "РТОVSПрочее_ID",
  			"qLibraryId": "eaa470fb-b87d-4e99-bddc-e39dca484848",
  		},
  		block1: {
  			arrow: {
  				"qLabel": "Стрелка.РТОVSПрочее_день",
  				"qLibraryId": "caa487b8-49c1-4380-a245-6b5e6c10bf77",
  			},
  			fact: {
  				"qLabel": "ОсновнаяТаблица.РТОVSПрочее_день_тп",
  				"qLibraryId": "e51d30fb-c1b6-4c7f-b633-199047e78392",
  			},
  			factPp: {
  				"qLabel": "ОсновнаяТаблица.РТОVSПрочее_день_пп",
  				"qLibraryId": "be49710b-2d9d-48ed-8a73-08c48baf1584",
  			},
  			factVsPp: {
  				"qLabel": "ОсновнаяТаблица.РТОVSПрочее_день_тпVSпп",
  				"qLibraryId": "9ea4ec29-4924-4584-be22-45bcabf19837",
  			},
  			factVsPpPercent: {
  				"qLabel": "ОсновнаяТаблица.РТОVSПрочее_день_тпVSпп%",
  				"qLibraryId": "c2604ce5-880e-4c51-a49f-8adc6cfcdd1d",
  			},
  			deviationRegions: {
  				count: {
  					"qLabel": "КоличОтклОкруг.ДоляРТОПоПрочее_день",
  					"qLibraryId": "b0d2c9c6-b363-46a8-b4ed-1fcfed2c09e6",
  				},
  				factVsPp: {
  					"qLabel": "КоличОтклОкруг.ДоляРТОПоПрочееVSпп_день",
  					"qLibraryId": "3747dfd9-b77f-413f-9700-afdf6ede2360",
  				}
  			},
  			deviationFormats: {
  				count: {
  					"qLabel": "КоличОтклФормат.ДоляРТОПоПрочее_день",
  					"qLibraryId": "23f1afa0-0fdc-4a3d-8b1d-e82f8a9c9675",
  				},
  				factVsPp: {
  					"qLabel": "КоличОтклФормат.ДоляРТОПоПрочееVSпп_день",
  					"qLibraryId": "4bcbf4c9-a356-482d-ac24-f12699eb0bcb",
  				}
  			}
  		},
  		block2: {
  			arrow: {
  				"qLabel": "Стрелка.РТОVSПрочее",
  				"qLibraryId": "cdc34267-36e4-4b80-a635-720b239119cd",
  			},
  			fact: {
  				"qLabel": "ОсновнаяТаблица.РТОVSПрочее_тп",
  				"qLibraryId": "56be5f53-afe5-4922-95f7-6d2c27934148",
  			},
  			factPp: {
  				"qLabel": "ОсновнаяТаблица.РТОVSПрочее_пп",
  				"qLibraryId": "a886daf1-a6dd-4792-9974-3ad623e77d15",
  			},
  			factVsPp: {
  				"qLabel": "ОсновнаяТаблица.РТОVSПрочее_тпVSпп",
  				"qLibraryId": "b5423eb6-1c83-488f-930c-fd4fede000f0",
  			},
  			factVsPpPercent: {
  				"qLabel": "ОсновнаяТаблица.РТОVSПрочее_тпVSпп%",
  				"qLibraryId": "94da6074-88d9-44fc-9790-4952ecb3add4",
  			},
  			deviationRegions: {
  				factVsPp: {
  					"qLabel": "КоличОтклОкруг.ДоляРТОПоПрочееVSпп",
  					"qLibraryId": "efc3c120-74ae-4d65-b4ec-3ad0d92f7379",
  				}
  			},
  			deviationFormats: {
  				factVsPp: {
  					"qLabel": "КоличОтклФормат.ДоляРТОПоПрочееVSпп",
  					"qLibraryId": "e3c13202-c670-4cf2-bb9d-92c5af3d08f0",
  				}
  			}
  		}
  	},
  	{
  		name: "Влияние мониторинга на FM",
  		id: 32,
  		units: '%',
  		dimension: {
  			"qLabel": "ВлияниеМониторинг_ID",
  			"qLibraryId": "576af43b-3362-4d01-a3a9-6b486f46bdc0",
  		},
  		block1: {
  			arrow: {
  				"qLabel": "Стрелка.ВлияниеVSМониторинг_день",
  				"qLibraryId": "0c0dc1bb-6d70-45e3-8663-9fecc9c92032",
  			},
  			fact: {
  				"qLabel": "ОсновнаяТаблица.ВлияниеVSМониторинг_день_тп",
  				"qLibraryId": "5ac09dbe-7ae0-4ecc-8f03-ce5161955070",
  			},
  			factPp: {
  				"qLabel": "ОсновнаяТаблица.ВлияниеVSМониторинг_день_пп",
  				"qLibraryId": "39470231-4f0b-482a-90cb-00889576d374",
  			},
  			factVsPp: {
  				"qLabel": "ОсновнаяТаблица.ВлияниеVSМониторинг_день_тпVSпп",
  				"qLibraryId": "5ac16a5d-e2cb-4be0-b557-18ec9a9186fb",
  			},
  			factVsPpPercent: {
  				"qLabel": "ОсновнаяТаблица.ВлияниеVSМониторинг_день_тпVSпп%",
  				"qLibraryId": "457f24fc-3ee3-404b-8bd2-b6aa16a20187",
  			},
  			deviationRegions: {
  				count: {
  					"qLabel": "КоличОтклОкруг.ВлияниеМониторинг_день",
  					"qLibraryId": "11189681-6ba1-4ebf-912d-769cee345f6b",
  				},
  				factVsPp: {
  					"qLabel": "КоличОтклОкруг.ВлияниеМониторингVSпп_день",
  					"qLibraryId": "67ae6cf9-893e-4b97-a619-7e27b425f5b7",
  				}
  			},
  			deviationFormats: {
  				count: {
  					"qLabel": "КоличОтклФормат.ВлияниеМониторинг_день",
  					"qLibraryId": "25bc2f1f-8df3-4b21-bd11-fc63926f04b6",
  				},
  				factVsPp: {
  					"qLabel": "КоличОтклФормат.ВлияниеМониторингVSпп_день",
  					"qLibraryId": "0809d3ef-29de-4596-bc75-3c16fe33bf39",
  				}
  			}
  		},
  		block2: {
  			arrow: {
  				"qLabel": "Стрелка.ВлияниеVSМониторинг",
  				"qLibraryId": "f1d8bafe-fbe5-4247-85d1-c268ca4abc2c",
  			},
  			fact: {
  				"qLabel": "ОсновнаяТаблица.ВлияниеVSМониторинг_тп",
  				"qLibraryId": "96d81d83-a135-4247-943d-66d8bdc61a3b",
  			},
  			factPp: {
  				"qLabel": "ОсновнаяТаблица.ВлияниеVSМониторинг_пп",
  				"qLibraryId": "5b901f0f-3c81-40e4-8e2c-5ed1ac2de070",
  			},
  			factVsPp: {
  				"qLabel": "ОсновнаяТаблица.ВлияниеVSМониторинг_тпVSпп",
  				"qLibraryId": "56c7a850-4d2b-4a6b-aa7d-d76e03ef2817",
  			},
  			factVsPpPercent: {
  				"qLabel": "ОсновнаяТаблица.ВлияниеVSМониторинг_тпVSпп%",
  				"qLibraryId": "84652172-a34f-4ae0-b0db-e5a6faa1336e",
  			},
  			deviationRegions: {
  				factVsPp: {
  					"qLabel": "КоличОтклОкруг.ВлияниеМониторингVSпп",
  					"qLibraryId": "d6395845-3523-410e-b236-2af97c1f3718",
  				}
  			},
  			deviationFormats: {
  				factVsPp: {
  					"qLabel": "КоличОтклФормат.ВлияниеМониторингVSпп",
  					"qLibraryId": "5dda0664-9cad-4ead-b7b1-577e6e3b45d2",
  				}
  			}
  		}
  	},
  	{
  		name: "Влияние Лояльности на FM",
  		id: 33,
  		units: '%',
  		dimension: {
  			"qLabel": "ВлияниеVSЛояльность_ID",
  			"qLibraryId": "4e94ef6e-0273-40d2-b2f0-63581f626b3b",
  		},
  		block1: {
  			arrow: {
  				"qLabel": "Стрелка.ВлияниеVSЛояльность_день",
  				"qLibraryId": "8b63de5b-0e55-41a9-9d14-aa25f17d7e54",
  			},
  			fact: {
  				"qLabel": "ОсновнаяТаблица.ВлияниеVSЛояльность_день_тп",
  				"qLibraryId": "54002da3-b465-4d1f-bf8f-0d38501eb8aa",
  			},
  			factPp: {
  				"qLabel": "ОсновнаяТаблица.ВлияниеVSЛояльность_день_пп",
  				"qLibraryId": "a753b7a4-5580-40c7-8fb7-6e200b52b29c",
  			},
  			factVsPp: {
  				"qLabel": "ОсновнаяТаблица.ВлияниеVSЛояльность_день_тпVSпп",
  				"qLibraryId": "d8a17d0c-cfad-45d5-80fa-c0773916f2bc",
  			},
  			factVsPpPercent: {
  				"qLabel": "ОсновнаяТаблица.ВлияниеVSЛояльность_день_тпVSпп%",
  				"qLibraryId": "a03a42e7-e6ba-4257-8084-372c2e7b4ce1",
  			},
  			deviationRegions: {
  				count: {
  					"qLabel": "КоличОтклОкруг.ВлияниеЛояльность_день (1)",
  					"qLibraryId": "d4190df2-1621-401e-b2b6-af3bf4f6caba",
  				},
  				factVsPp: {
  					"qLabel": "КоличОтклОкруг.ВлияниеЛояльностьVSпп_день (1)",
  					"qLibraryId": "80de1564-8fef-4c19-9648-6c0e2972aa48",
  				}
  			},
  			deviationFormats: {
  				count: {
  					"qLabel": "КоличОтклФормат.ВлияниеЛояльность_день",
  					"qLibraryId": "f112b5db-708b-4e1a-b758-9ceccc534bb2",
  				},
  				factVsPp: {
  					"qLabel": "КоличОтклФормат.ВлияниеЛояльностьVSпп_день",
  					"qLibraryId": "969ca92b-e5b1-41a6-94b0-3e5142369baa",
  				}
  			}
  		},
  		block2: {
  			arrow: {
  				"qLabel": "Стрелка.ВлияниеVSЛояльность",
  				"qLibraryId": "1f106ffc-bc89-4568-a1ee-3ed1bd598308",
  			},
  			fact: {
  				"qLabel": "ОсновнаяТаблица.ВлияниеVSЛояльность_тп",
  				"qLibraryId": "8e9f4828-109b-4dd9-b1e9-db22cea25207",
  			},
  			factPp: {
  				"qLabel": "ОсновнаяТаблица.ВлияниеVSЛояльность_пп",
  				"qLibraryId": "04fd6cba-d5d2-4ada-bee6-20d3252b8f7b",
  			},
  			factVsPp: {
  				"qLabel": "ОсновнаяТаблица.ВлияниеVSЛояльность_тпVSпп (1)",
  				"qLibraryId": "7f8e7428-f58d-4d6a-a1de-f5add431fdde",
  			},
  			factVsPpPercent: {
  				"qLabel": "ОсновнаяТаблица.ВлияниеVSЛояльность_тпVSпп%",
  				"qLibraryId": "ee0dd2f5-863c-4412-a0d3-64ff64f7f26f",
  			},
  			deviationRegions: {
  				factVsPp: {
  					"qLabel": "КоличОтклОкруг.ВлияниеЛояльностьVSпп",
  					"qLibraryId": "fc1c25ef-f52b-4fb0-a489-28e2162b5dde",
  				}
  			},
  			deviationFormats: {
  				factVsPp: {
  					"qLabel": "КоличОтклФормат.ВлияниеЛояльностьVSпп",
  					"qLibraryId": "27d98dca-1a10-4f6e-8be8-2857463b8c5e",
  				}
  			}
  		}
  	},
  	{
  		name: "Влияние Уценки на FM",
  		id: 34,
  		units: '%',
  		dimension: {
  			"qLabel": "ВлияниеVSУценка_ID",
  			"qLibraryId": "30f0c8bf-017c-4b58-b040-3aa68b637607",
  		},
  		block1: {
  			arrow: {
  				"qLabel": "Стрелка.ВлияниеVSУценка_день",
  				"qLibraryId": "7070cbb4-ac81-4c45-a6dc-3d4c007a73b8",
  			},
  			fact: {
  				"qLabel": "ОсновнаяТаблица.ВлияниеVSУценка_день_тп",
  				"qLibraryId": "a6894a95-259c-4c0b-9a9e-7ada32fd621e",
  			},
  			factPp: {
  				"qLabel": "ОсновнаяТаблица.ВлияниеVSУценка_день_пп",
  				"qLibraryId": "9a1bd6a0-8129-4bfb-a04e-0b66dcf21748",
  			},
  			factVsPp: {
  				"qLabel": "ОсновнаяТаблица.ВлияниеVSУценка_день_тпVSпп",
  				"qLibraryId": "526bd4e7-ac76-4eea-a334-38f9c1dd7ebb",
  			},
  			factVsPpPercent: {
  				"qLabel": "ОсновнаяТаблица.ВлияниеVSУценка_день_тпVSпп%",
  				"qLibraryId": "b4187375-b03f-4cf9-8f78-a8eb69ba3376",
  			},
  			deviationRegions: {
  				count: {
  					"qLabel": "КоличОтклОкруг.ВлияниеУценка_день",
  					"qLibraryId": "0f50a091-d6ec-475d-99f6-e2893efcb4e8",
  				},
  				factVsPp: {
  					"qLabel": "КоличОтклОкруг.ВлияниеУценкаVSпп_день",
  					"qLibraryId": "d4063b61-d189-435b-bea0-dfa28679b56a",
  				}
  			},
  			deviationFormats: {
  				count: {
  					"qLabel": "КоличОтклФормат.ВлияниеУценка_день",
  					"qLibraryId": "27930cd1-5be7-4cfc-849e-7e0297cc25bf",
  				},
  				factVsPp: {
  					"qLabel": "КоличОтклФормат.ВлияниеУценкаVSпп_день",
  					"qLibraryId": "10e0531e-e499-4965-9395-08fdfcccf90d",
  				}
  			}
  		},
  		block2: {
  			arrow: {
  				"qLabel": "Стрелка.ВлияниеVSУценка",
  				"qLibraryId": "a94f1d48-60f1-4b40-8aa3-14aa7ed3f458",
  			},
  			fact: {
  				"qLabel": "ОсновнаяТаблица.ВлияниеVSУценка_тп",
  				"qLibraryId": "750d41c3-2841-41cb-a13b-3096483c4e25",
  			},
  			factPp: {
  				"qLabel": "ОсновнаяТаблица.ВлияниеVSУценка_пп",
  				"qLibraryId": "2d95f710-59f8-409e-b4dc-5451b6dffa54",
  			},
  			factVsPp: {
  				"qLabel": "ОсновнаяТаблица.ВлияниеVSУценка_тпVSпп",
  				"qLibraryId": "266d7665-3d4e-4b07-a36a-11f95b88e100",
  			},
  			factVsPpPercent: {
  				"qLabel": "ОсновнаяТаблица.ВлияниеVSУценка_тпVSпп%",
  				"qLibraryId": "34e654bb-ca17-4e4c-a57b-0db47fce0e0f",
  			},
  			deviationRegions: {
  				factVsPp: {
  					"qLabel": "КоличОтклОкруг.ВлияниеУценкаVSпп",
  					"qLibraryId": "1cb2b78c-f512-4706-82df-39880214ae8a",
  				}
  			},
  			deviationFormats: {
  				factVsPp: {
  					"qLabel": "КоличОтклФормат.ВлияниеУценкаVSпп",
  					"qLibraryId": "4e6c587f-6cbf-4042-ac71-0843eebf7da3",
  				}
  			}
  		}
  	},
  	{
  		name: "Влияние Промо на FM",
  		id: 35,
  		units: '%',
  		dimension: {
  			"qLabel": "ВлияниеVSПромо_ID",
  			"qLibraryId": "68206c64-8b27-466f-8708-2e060d60b365",
  		},
  		block1: {
  			arrow: {
  				"qLabel": "Стрелка.ВлияниеVSПромо_день",
  				"qLibraryId": "10cb5f62-42f2-46f7-87e5-0a51254824c2",
  			},
  			fact: {
  				"qLabel": "ОсновнаяТаблица.ВлияниеVSПромо_день_тп",
  				"qLibraryId": "92a7fd88-320f-4cd0-9d20-a172606910c0",
  			},
  			factPp: {
  				"qLabel": "ОсновнаяТаблица.ВлияниеVSПромо_день_пп",
  				"qLibraryId": "ef61eade-2e4b-40e9-b2b2-faaf59b3f9f6",
  			},
  			factVsPp: {
  				"qLabel": "ОсновнаяТаблица.ВлияниеVSПромо_день_тпVSпп",
  				"qLibraryId": "6da2d86f-d3f2-44af-84c0-f2d8a7c733b3",
  			},
  			factVsPpPercent: {
  				"qLabel": "ОсновнаяТаблица.ВлияниеVSПромо_день_тпVSпп%",
  				"qLibraryId": "7a7e50f6-8b4c-4a80-b2fb-cc85fbd93c71",
  			},
  			deviationRegions: {
  				count: {
  					"qLabel": "КоличОтклОкруг.ВлияниеПромо_день",
  					"qLibraryId": "e2ab6ed7-51ab-416f-b249-e4feaf97dfe8",
  				},
  				factVsPp: {
  					"qLabel": "КоличОтклОкруг.ВлияниеПромоVSпп_день",
  					"qLibraryId": "72b5986d-3e1e-4141-8eb7-086417669a77",
  				}
  			},
  			deviationFormats: {
  				count: {
  					"qLabel": "КоличОтклФормат.ВлияниеПромо_день",
  					"qLibraryId": "fa0247ae-9a92-4642-9438-26e376b8ba33",
  				},
  				factVsPp: {
  					"qLabel": "КоличОтклФормат.ВлияниеПромоVSпп_день",
  					"qLibraryId": "9a9f86af-bedc-4298-abaa-1ba649daf05b",
  				}
  			}
  		},
  		block2: {
  			arrow: {
  				"qLabel": "Стрелка.ВлияниеVSПромо",
  				"qLibraryId": "4d31466e-17c0-4db4-bd8f-1f9d6080b5c0",
  			},
  			fact: {
  				"qLabel": "ОсновнаяТаблица.ВлияниеVSПромо_тп",
  				"qLibraryId": "4f120af4-f9d6-477d-afb2-bc6b70a0a151",
  			},
  			factPp: {
  				"qLabel": "ОсновнаяТаблица.ВлияниеVSПромо_пп",
  				"qLibraryId": "bfd6f0d3-0325-48e8-9b4e-7be9f2ee29ad",
  			},
  			factVsPp: {
  				"qLabel": "ОсновнаяТаблица.ВлияниеVSПромо_тпVSпп",
  				"qLibraryId": "d35565ef-3c79-4300-b58f-cda2eef25567",
  			},
  			factVsPpPercent: {
  				"qLabel": "ОсновнаяТаблица.ВлияниеVSПромо_тпVSпп%",
  				"qLibraryId": "b7541e7b-2bd9-41e5-85d2-b599ef2a3c23",
  			},
  			deviationRegions: {
  				factVsPp: {
  					"qLabel": "КоличОтклОкруг.ВлияниеПромоVSпп",
  					"qLibraryId": "0bf7147a-bbf9-46ba-b1d8-8d25b84b3d6e",
  				}
  			},
  			deviationFormats: {
  				factVsPp: {
  					"qLabel": "КоличОтклФормат.ВлияниеПромоVSпп",
  					"qLibraryId": "044d982d-7199-4067-a20e-1117f70127aa",
  				}
  			}
  		}
  	},
  	{
  		name: "Влияние Регулярного на FM",
  		id: 36,
  		units: '%',
  		dimension: {
  			"qLabel": "ВлияниеVSРегулярная_ID",
  			"qLibraryId": "5861a6c1-b658-435e-a5ba-38b7f7c6b6d7",
  		},
  		block1: {
  			arrow: {
  				"qLabel": "Стрелка.ВлияниеVSРегулярная_день",
  				"qLibraryId": "823dcaa3-2092-415d-b84b-02c782de5d47",
  			},
  			fact: {
  				"qLabel": "ОсновнаяТаблица.ВлияниеVSРегулярная_день_тп",
  				"qLibraryId": "ab59720d-c51f-494f-8e61-cc6914c20e21",
  			},
  			factPp: {
  				"qLabel": "ОсновнаяТаблица.ВлияниеVSРегулярная_день_пп",
  				"qLibraryId": "bd8c423d-22f1-4b7d-a90f-95bc9b956733",
  			},
  			factVsPp: {
  				"qLabel": "ОсновнаяТаблица.ВлияниеVSРегулярная_день_тпVSпп",
  				"qLibraryId": "9d5a5f5a-0570-41f8-8070-46c260fffdad",
  			},
  			factVsPpPercent: {
  				"qLabel": "ОсновнаяТаблица.ВлияниеVSРегулярная_день_тпVSпп%",
  				"qLibraryId": "93f4c7cd-9518-49d7-bfde-9100bc32cb52",
  			},
  			deviationRegions: {
  				count: {
  					"qLabel": "КоличОтклОкруг.ВлияниеРегулярная_день",
  					"qLibraryId": "e098dd28-6d19-490c-ab67-04cfb0c50884",
  				},
  				factVsPp: {
  					"qLabel": "КоличОтклОкруг.ВлияниеРегулярнаяVSпп_день",
  					"qLibraryId": "ee0485e4-ca23-4da2-b5ef-7049b484aab6",
  				}				
  			},
  			deviationFormats: {
  				count: {
  					"qLabel": "КоличОтклФормат.ВлияниеРегулярная_день",
  					"qLibraryId": "03db074a-aa52-4d2e-b446-0e976e89fa63",
  				},
  				factVsPp: {
  					"qLabel": "КоличОтклФормат.ВлияниеРегулярнаяVSпп_день",
  					"qLibraryId": "e57a2934-c882-4eb1-8380-1042dfa9283d",
  				}
  			}
  		},
  		block2: {
  			arrow: {
  				"qLabel": "Стрелка.ВлияниеVSРегулярная",
  				"qLibraryId": "f97bc653-84d3-493c-9646-8e344fabbc8a",
  			},
  			fact: {
  				"qLabel": "ОсновнаяТаблица.ВлияниеVSРегулярная_тп",
  				"qLibraryId": "1cbde69e-a761-4e31-a84e-367ffd96ed59",
  			},
  			factPp: {
  				"qLabel": "ОсновнаяТаблица.ВлияниеVSРегулярная_пп",
  				"qLibraryId": "20103ac3-bbff-4502-9971-dd87bfa52ff0",
  			},
  			factVsPp: {
  				"qLabel": "ОсновнаяТаблица.ВлияниеVSРегулярная_тпVSпп",
  				"qLibraryId": "179b3893-8fca-40d5-9a3d-e2d7d0d30720",
  			},
  			factVsPpPercent: {
  				"qLabel": "ОсновнаяТаблица.ВлияниеVSРегулярная_тпVSпп%",
  				"qLibraryId": "6192e36b-713a-4657-a9ab-128de22e28ed",
  			},
  			deviationRegions: {
  				factVsPp: {
  					"qLabel": "КоличОтклОкруг.ВлияниеРегулярнаяVSпп",
  					"qLibraryId": "fd7a5929-ac7e-469f-932a-3d29b0cee319",
  				}
  			},
  			deviationFormats: {
  				factVsPp: {
  					"qLabel": "КоличОтклФормат.ВлияниеРегулярнаяVSпп",
  					"qLibraryId": "689625b9-54f4-4524-b67a-27c555b4a365",
  				}
  			}
  		}
  	},
  	{
  		name: "Влияние Прочее на FM",
  		id: 37,
  		units: '%',
  		dimension: {
  			"qLabel": "ВлияниеVSПрочее_ID",
  			"qLibraryId": "XjyDMxn",
  		},
  		block1: {
  			arrow: {
  				"qLabel": "Стрелка.ВлияниеVSПрочее_день",
  				"qLibraryId": "d4ed7f97-a5f4-439c-a098-a2078dc39dd7",
  			},
  			fact: {
  				"qLabel": "ОсновнаяТаблица.ВлияниеVSПрочее_день_тп",
  				"qLibraryId": "b90f82b1-af93-446d-b192-1dd6ca9e9a3e",
  			},
  			factPp: {
  				"qLabel": "ОсновнаяТаблица.ВлияниеVSПрочее_день_пп",
  				"qLibraryId": "617af2cc-bfef-4ed5-9463-f257fdfe95e4",
  			},
  			factVsPp: {
  				"qLabel": "ОсновнаяТаблица.ВлияниеVSПрочее_день_тпVSпп",
  				"qLibraryId": "888395a4-6b4c-48ad-a148-fe01a799a02e",
  			},
  			factVsPpPercent: {
  				"qLabel": "ОсновнаяТаблица.ВлияниеVSПрочее_день_тпVSпп%",
  				"qLibraryId": "06cc30d4-0743-41f1-9526-5ea3a945b500",
  			},
  			deviationRegions: {
  				count: {
  					"qLabel": "КоличОтклОкруг.ВлияниеПрочее_день",
  					"qLibraryId": "8e0f6537-3389-477c-bb3b-ec334087b6c3",
  				},
  				factVsPp: {
  					"qLabel": "КоличОтклОкруг.ВлияниеПрочееVSпп_день",
  					"qLibraryId": "16c02dc8-26b7-4f0c-aa73-e7e650d18935",
  				}
  			},
  			deviationFormats: {
  				count: {
  					"qLabel": "КоличОтклФормат.ВлияниеПрочее_день",
  					"qLibraryId": "fd3c521a-1369-4c67-b3c0-03cb7499a150",
  				},
  				factVsPp: {
  					"qLabel": "КоличОтклФормат.ВлияниеПрочееVSпп_день",
  					"qLibraryId": "81aa7d72-d0f3-4db6-acc2-0d833e862689",
  				}
  			}
  		},
  		block2: {
  			arrow: {
  				"qLabel": "Стрелка.ВлияниеVSПрочее",
  				"qLibraryId": "0f8fe09a-b886-48db-9962-c26b026b5dea",
  			},
  			fact: {
  				"qLabel": "ОсновнаяТаблица.ВлияниеVSПрочее_тп",
  				"qLibraryId": "1c7e12f6-8763-42ef-9538-4656c5a71333",
  			},
  			factPp: {
  				"qLabel": "ОсновнаяТаблица.ВлияниеVSПрочее_пп",
  				"qLibraryId": "48aa44f5-1382-4583-8667-a1d7fe88c3ac",
  			},
  			factVsPp: {
  				"qLabel": "ОсновнаяТаблица.ВлияниеVSПрочее_тпVSпп",
  				"qLibraryId": "ae87ba98-e9c2-4031-ac2f-ede7684bf129",
  			},
  			factVsPpPercent: {
  				"qLabel": "ОсновнаяТаблица.ВлияниеVSПрочее_тпVSпп%",
  				"qLibraryId": "fce37e06-fd0d-4508-a454-a97216c222d0",
  			},
  			deviationRegions: {
  				factVsPp: {
  					"qLabel": "КоличОтклОкруг.ВлияниеПрочееVSпп",
  					"qLibraryId": "db0dea10-5850-4d48-b348-c0eb24184cb5",
  				}
  			},
  			deviationFormats: {
  				factVsPp: {
  					"qLabel": "КоличОтклФормат.ВлияниеПрочееVSпп",
  					"qLibraryId": "4ae3214b-235d-4f76-a008-a7090ba5632b",
  				}
  			}
  		}
  	},
  	{
  		name: "ШтатнаяЧисленность",
  		id: 38,
  		units: 'чел',
  		dimension: {
  			"qLabel": "ШтатнаяЧисленность_ID",
  			"qLibraryId": "ad972d9c-1b37-43e5-8ea0-92439408f34c",
  		},
  		block1: {
  			arrow: {
  				"qLabel": "Стрелка.ШтатнаяЧисленность_день",
  				"qLibraryId": "3a301b1b-0136-42d7-9ffd-cf1146f5ed10",
  			},
  			fact: {
  				"qLabel": "ОсновнаяТаблица.ШтатнаяЧисленность_день_тп",
  				"qLibraryId": "1b819f3d-6298-4316-88cb-d5b42a538526",
  			},
  			factPp: {
  				"qLabel": "ОсновнаяТаблица.ШтатнаяЧисленность_день_пп",
  				"qLibraryId": "a7d6399e-ba73-477c-a1e5-d5cf5d98cd8b",
  			},
  			factVsPp: {
  				"qLabel": "ОсновнаяТаблица.ШтатнаяЧисленность_день_тпVSпп",
  				"qLibraryId": "4c5b007c-99b8-4a89-acd5-92555f8a3531",
  			},
  			factVsPpPercent: {
  				"qLabel": "ОсновнаяТаблица.ШтатнаяЧисленность_день_тпVSпп%",
  				"qLibraryId": "d7927cd2-0586-4a86-b51e-c5a9e83430b7",
  			},
  			deviationRegions: {
  				count: {
  					"qLabel": "КоличОтклОкруг.ШтатнаяЧисленность_день",
  					"qLibraryId": "VaZnSr",
  				},
  				factVsPp: {
  					"qLabel": "КоличОтклОкруг.ШтатнаяЧисленностьVSпп_день",
  					"qLibraryId": "Shtwqx",
  				}
  			},
  			deviationFormats: {
  				count: {
  					"qLabel": "КоличОтклФормат.ШтатнаяЧисленность_день (1)",
  					"qLibraryId": "3fd7a69e-446d-446b-9d4e-51731f2b0058",
  				},
  				factVsPp: {
  					"qLabel": "КоличОтклФормат.ШтатнаяЧисленностьVSпп_день",
  					"qLibraryId": "9d515e55-7300-4660-a108-c1d85961b960",
  				}
  			}
  		},
  		block2: {
  			arrow: {
  				"qLabel": "Стрелка.ШтатнаяЧисленность",
  				"qLibraryId": "34a735ab-6c8f-48b4-807c-74b7e8a60e0b",
  			},
  			fact: {
  				"qLabel": "ОсновнаяТаблица.ШтатнаяЧисленность_тп",
  				"qLibraryId": "f1823b5b-4439-4515-927a-6cdb1cabc2b3",
  			},
  			factPp: {
  				"qLabel": "ОсновнаяТаблица.ШтатнаяЧисленность_пп",
  				"qLibraryId": "dd0dcb3b-768d-409e-a985-cbce397e013f",
  			},
  			factVsPp: {
  				"qLabel": "ОсновнаяТаблица.ШтатнаяЧисленность_тпVSпп",
  				"qLibraryId": "9ca15b32-d8af-4168-b5c9-294a6baffc8b",
  			},
  			factVsPpPercent: {
  				"qLabel": "ОсновнаяТаблица.ШтатнаяЧисленность_тпVSпп%",
  				"qLibraryId": "9e075e6e-a5bc-4f5c-8ada-fd53582e6e98",
  			},
  			deviationRegions: {
  				factVsPp: {
  					"qLabel": "КоличОтклОкруг.ШтатнаяЧисленностьVSпп",
  					"qLibraryId": "d37391aa-fc7f-41a0-96e0-648eb5de4fa3",
  				}
  			},
  			deviationFormats: {
  				factVsPp: {
  					"qLabel": "КоличОтклФормат.ШтатнаяЧисленностьVSпп",
  					"qLibraryId": "2f9a364a-d4d7-4f4a-b9b2-5b3aa8c96c0c",
  				}
  			}
  		}
  	},
  	{
  		name: "ФактическаяЧисленность",
  		id: 39,
  		units: 'чел',
  		dimension: {
  			"qLabel": "ФактическаяЧисленность_ID",
  			"qLibraryId": "650eb754-3b73-40f9-86da-75fbc85b5f0c",
  		},
  		block1: {
  			arrow: {
  				"qLabel": "Стрелка.ФактическаяЧисленность_день",
  				"qLibraryId": "55be302f-eb0c-4d75-9268-662cac9264cf",
  			},
  			fact: {
  				"qLabel": "ОсновнаяТаблица.ФактическаяЧисленность_день_тп",
  				"qLibraryId": "dd1d3ed8-ad9f-4045-b893-8f1743ddc4bf",
  			},
  			factPp: {
  				"qLabel": "ОсновнаяТаблица.ФактическаяЧисленность_день_пп",
  				"qLibraryId": "251e1dd2-a7b7-40d4-8aaa-f3bff09a3701",
  			},
  			factVsPp: {
  				"qLabel": "ОсновнаяТаблица.ФактическаяЧисленность_день_тпVSпп",
  				"qLibraryId": "0ef54dfa-0f0c-44b0-982f-c3405ebe2597",
  			},
  			factVsPpPercent: {
  				"qLabel": "ОсновнаяТаблица.ФактическаяЧисленность_день_тпVSпп%",
  				"qLibraryId": "496addb5-d42a-4e93-b64e-ce4293155de3",
  			},
  			deviationRegions: {
  				count: {
  					"qLabel": "КоличОтклОкруг.ФактическаяЧисленность_день",
  					"qLibraryId": "xBC",
  				},
  				factVsPp: {
  					"qLabel": "КоличОтклОкруг.ФактическаяЧисленностьVSпп_день",
  					"qLibraryId": "xNUwmcG",
  				}
  			},
  			deviationFormats: {
  				count: {
  					"qLabel": "КоличОтклФормат.ФактическаяЧисленность_день",
  					"qLibraryId": "1a815203-2d7a-4e84-a385-6f56d68816e9",
  				},
  				factVsPp: {
  					"qLabel": "КоличОтклФормат.ФактическаяЧисленностьVSпп_день",
  					"qLibraryId": "7d008960-a9a1-4838-8e35-3a0631a5c930",
  				}
  			}
  		},
  		block2: {
  			arrow: {
  				"qLabel": "Стрелка.ФактическаяЧисленность",
  				"qLibraryId": "6403569d-5e04-49d3-95d3-fefe68bb9b55",
  			},
  			fact: {
  				"qLabel": "ОсновнаяТаблица.ФактическаяЧисленность_тп",
  				"qLibraryId": "3b113c91-4ec3-4953-b92a-01d29cd2bc80",
  			},
  			factPp: {
  				"qLabel": "ОсновнаяТаблица.ФактическаяЧисленность_пп",
  				"qLibraryId": "5762fd91-8f02-41a6-89cd-65ec44676968",
  			},
  			factVsPp: {
  				"qLabel": "ОсновнаяТаблица.ФактическаяЧисленность_тпVSпп",
  				"qLibraryId": "4084ee3b-d40f-47bc-95c9-4c8e2e883709",
  			},
  			factVsPpPercent: {
  				"qLabel": "ОсновнаяТаблица.ФактическаяЧисленность_тпVSпп%",
  				"qLibraryId": "1df91d71-6dc0-479c-bc72-19d26d39142b",
  			},
  			deviationRegions: {
  				factVsPp: {
  					"qLabel": "КоличОтклОкруг.ФактическаяЧисленностьVSпп",
  					"qLibraryId": "6ae3e452-f6be-40d9-9e39-049fc6f53b8d",
  				}
  			},
  			deviationFormats: {
  				factVsPp: {
  					"qLabel": "КоличОтклФормат.ФактическаяЧисленностьVSпп",
  					"qLibraryId": "6d1de53e-0373-404b-85b6-66dd14f3c212",
  				}
  			}
  		}
  	},
  	{
  		name: "Перештат",
  		id: 40,
  		units: 'чел',
  		dimension: {
  			"qLabel": "Перештат_ID",
  			"qLibraryId": "214b4adf-ac79-48f6-b8bd-821c7c964166",
  		},
  		block1: {
  			arrow: {
  				"qLabel": "Стрелка.Перештат_день",
  				"qLibraryId": "07668223-03be-43cb-8f4c-24b3ae8c7cc3",
  			},
  			fact: {
  				"qLabel": "ОсновнаяТаблица.Перештат_день_тп",
  				"qLibraryId": "668fe428-b61a-433a-9102-295c31f98d88",
  			},
  			factPp: {
  				"qLabel": "ОсновнаяТаблица.Перештат_день_пп",
  				"qLibraryId": "df7162f2-1f30-4d36-810b-23535d378853",
  			},
  			factVsPp: {
  				"qLabel": "ОсновнаяТаблица.Перештат_день_тпVSпп",
  				"qLibraryId": "6262e297-b60c-451c-ab61-fa446ce30162",
  			},
  			factVsPpPercent: {
  				"qLabel": "ОсновнаяТаблица.Перештат_день_тпVSпп%",
  				"qLibraryId": "5cd415f6-5bea-42b0-b223-686f3cd1aa60",
  			},
  			deviationRegions: {
  				count: {
  					"qLabel": "КоличОтклОкруг.Перештат_день",
  					"qLibraryId": "EYwJYeh",
  				},
  				factVsPp: {
  					"qLabel": "КоличОтклОкруг.ПерештатVSпп_день",
  					"qLibraryId": "njKYxC",
  				}
  			},
  			deviationFormats: {
  				count: {
  					"qLabel": "КоличОтклФормат.Перештат_день",
  					"qLibraryId": "61e42135-9d46-44b7-99e8-99edff5e7096",
  				},
  				factVsPp: {
  					"qLabel": "КоличОтклФормат.ПерештатVSпп_день",
  					"qLibraryId": "9297433c-8d60-4202-8d6e-712ef1d92488",
  				}
  			}
  		},
  		block2: {
  			arrow: {
  				"qLabel": "Стрелка.Перештат",
  				"qLibraryId": "afb36881-acf2-4d1b-b513-552b0a4f6667",
  			},
  			fact: {
  				"qLabel": "ОсновнаяТаблица.Перештат_тп",
  				"qLibraryId": "edeb06f4-db48-4071-80c0-78e2b8a18a46",
  			},
  			factPp: {
  				"qLabel": "ОсновнаяТаблица.Перештат_пп",
  				"qLibraryId": "4d97887e-2391-46ab-b1fd-c0e124299711",
  			},
  			factVsPp: {
  				"qLabel": "ОсновнаяТаблица.Перештат_тпVSпп",
  				"qLibraryId": "5defeb8f-c71d-46fb-9fc9-631863499c17",
  			},
  			factVsPpPercent: {
  				"qLabel": "ОсновнаяТаблица.Перештат_тпVSпп%",
  				"qLibraryId": "cd3177cd-cdca-4861-b218-a26b3c6ab70e",
  			},
  			deviationRegions: {
  				factVsPp: {
  					"qLabel": "КоличОтклОкруг.ПерештатVSпп",
  					"qLibraryId": "055c8ab3-0bf5-47b8-9080-e949c4162966",
  				}
  			},
  			deviationFormats: {
  				factVsPp: {
  					"qLabel": "КоличОтклФормат.ПерештатVSпп",
  					"qLibraryId": "2dab4a37-06ad-46bf-a594-b24773724479",
  				}
  			}
  		}
  	},
  	{
  		name: "Укомплектованность",
  		id: 41,
  		units: '%',
  		dimension: {
  			"qLabel": "Укомплектованность_ID",
  			"qLibraryId": "4250ff80-9909-4365-8497-45aa897cca3f",
  		},
  		block1: {
  			arrow: { 
  				"qLabel": "Стрелка.Укомплектованность_день",
  				"qLibraryId": "19d6d462-dc5d-4764-b45a-7bb37d8b0ac7",
  			},
  			fact: {
  				"qLabel": "ОсновнаяТаблица.Укомплектованность_день_тп",
  				"qLibraryId": "a525b602-c3a3-49f6-a3b1-ed1525664da3",
  			},
  			factPp: {
  				"qLabel": "ОсновнаяТаблица.Укомплектованность_день_пп",
  				"qLibraryId": "a14fa5a8-5523-40ab-8907-1ff6b852b7aa",
  			},
  			factVsPp: {
  				"qLabel": "ОсновнаяТаблица.Укомплектованность_день_тпVSпп",
  				"qLibraryId": "0e715f72-1e6c-4b0d-98bb-fec139eb99d5",
  			},
  			factVsPpPercent: {
  				"qLabel": "ОсновнаяТаблица.Укомплектованность_день_тпVSпп%",
  				"qLibraryId": "df513352-5286-4009-a144-4791721b7767",
  			},
  			deviationRegions: {
  				count: {
  					"qLabel": "КоличОтклОкруг.Укомплектованность_день",
  					"qLibraryId": "TXMetX",
  				},
  				factVsPp: {
  					"qLabel": "КоличОтклОкруг.УкомплектованностьVSпп_день",
  					"qLibraryId": "vFWFVk",
  				}
  			},
  			deviationFormats: {
  				count: {
  					"qLabel": "КоличОтклФормат.Укомплектованность_день",
  					"qLibraryId": "90b9308d-7889-4f68-b6c2-8dbbbb4d6f0a",
  				},
  				factVsPp: {
  					"qLabel": "КоличОтклФормат.УкомплектованностьVSпп_день",
  					"qLibraryId": "771c1d2b-d6dc-456d-9e13-710959c9fe79",
  				}
  			}
  		},
  		block2: {
  			arrow: {
  				"qLabel": "Стрелка.Укомплектованность",
  				"qLibraryId": "41977ca2-ee30-456e-95cd-9206516c2024",
  			},
  			fact: {
  				"qLabel": "ОсновнаяТаблица.Укомплектованность_тп",
  				"qLibraryId": "58ef3f5f-7d79-4ab5-a6a4-b92bef70871c",
  			},
  			factPp: {
  				"qLabel": "ОсновнаяТаблица.Укомплектованность_пп",
  				"qLibraryId": "48fa7975-39c1-4096-8b94-37519cd6493a",
  			},
  			factVsPp: {
  				"qLabel": "ОсновнаяТаблица.Укомплектованность_тпVSпп",
  				"qLibraryId": "c6d484d4-a067-4e0c-8151-04d58664435b",
  			},
  			factVsPpPercent: {
  				"qLabel": "ОсновнаяТаблица.Укомплектованность_тпVSпп%",
  				"qLibraryId": "ea238470-6354-45fe-ae75-e93bd48d5dc8",
  			},
  			deviationRegions: {
  				factVsPp: {
  					"qLabel": "КоличОтклОкруг.УкомплектованностьVSпп",
  					"qLibraryId": "1f774cf6-66b7-4cf9-90cf-3ee7061fd497",
  				}
  			},
  			deviationFormats: {
  				factVsPp: {
  					"qLabel": "КоличОтклФормат.УкомплектованностьVSпп",
  					"qLibraryId": "9e3c7543-c0d7-456f-93c1-109e11d02dae",
  				}
  			}
  		},
  	},
  	{
  		name: "Текучесть",
  		id: 42,
  		units: '%',
  		dimension: {
  			"qLabel": "Текучесть_ID",
  			"qLibraryId": "f3bc05b2-53ce-4b26-ad81-17e79836f252",
  		},
  		block1: {
  			arrow: {
  				"qLabel": "Стрелка.Текучесть_день",
  				"qLibraryId": "4ace69f5-7468-4315-8958-48d2b286e196",
  			},
  			fact: {
  				"qLabel": "ОсновнаяТаблица.Текучесть_день_тп",
  				"qLibraryId": "fafb7ef5-3c7b-423f-9fce-ca6e603f0180",
  			},
  			factPp: {
  				"qLabel": "ОсновнаяТаблица.Текучесть_день_пп",
  				"qLibraryId": "8381068a-ecb1-49af-a025-068a76dec490",
  			},
  			factVsPp: {
  				"qLabel": "ОсновнаяТаблица.Текучесть_день_тпVSпп",
  				"qLibraryId": "c57919cc-4d0f-46a4-867e-b98d19d2d8e1",
  			},
  			factVsPpPercent: {
  				"qLabel": "ОсновнаяТаблица.Текучесть_день_тпVSпп%",
  				"qLibraryId": "079fe77f-92f8-4ebf-a7b0-95d9dd2afaa8",
  			},
  			deviationRegions: {
  				count: {
  					"qLabel": "КоличОтклОкруг.Текучесть_день",
  					"qLibraryId": "ccZBP",
  				},
  				factVsPp: {
  					"qLabel": "КоличОтклОкруг.ТекучестьVSпп_день",
  					"qLibraryId": "VKnzSp",
  				}
  			},
  			deviationFormats: {
  				count: {
  					"qLabel": "КоличОтклФормат.Текучесть_день",
  					"qLibraryId": "f3484087-a89f-4ee6-bbad-cbe3a4ea0b2f",
  				},
  				factVsPp: {
  					"qLabel": "КоличОтклФормат.ТекучестьVSпп_день",
  					"qLibraryId": "375e0bbb-b4ee-450e-89d6-e13140c6d6bc",
  				}
  			}
  		},
  		block2: {
  			arrow: {
  				"qLabel": "Стрелка.Текучесть",
  				"qLibraryId": "bb939a6e-1eed-4deb-a451-ffebbb5eb440",
  			},
  			fact: {
  				"qLabel": "ОсновнаяТаблица.Текучесть_тп",
  				"qLibraryId": "e6403529-5aa3-4671-a88d-242216f26cfe",
  			},
  			factPp: {
  				"qLabel": "ОсновнаяТаблица.Текучесть_пп",
  				"qLibraryId": "10935b5b-d4f1-402d-a61b-eb90dbcd4495",
  			},
  			factVsPp: {
  				"qLabel": "ОсновнаяТаблица.Текучесть_тпVSпп",
  				"qLibraryId": "842610fd-a9e0-40f9-b9a6-f3387074b45f",
  			},
  			factVsPpPercent: {
  				"qLabel": "ОсновнаяТаблица.Текучесть_тпVSпп%",
  				"qLibraryId": "011d3144-cb04-42eb-a2fe-608f3abf0046",
  			},
  			deviationRegions: {
  				factVsPp: {
  					"qLabel": "КоличОтклОкруг.ТекучестьVSпп",
  					"qLibraryId": "e0e38519-9f3f-4b2d-82de-e5c7b4d82d22",
  				}
  			},
  			deviationFormats: {
  				factVsPp: {
  					"qLabel": "КоличОтклФормат.ТекучестьVSпп",
  					"qLibraryId": "39663f67-5131-476f-b55e-1fb1d49c5760",
  				}
  			}
  		}
  	}
  ];

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
        });
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
  		};
  		requests.push(requestGetFilterShops(app, areaConfig));
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
  		};
  		items.push(item);
  	});
  	return items;
  }

  // получение магазинов
  // запрашиваем все магазины 
  async function requestFilterShop(app, fieldName) {
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
            items.splice(0,0, ...data);
          });
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
      console.error('applyFilter error', e);
    }
  }

  async function qlikRequestFilterState(app) {
    const filters = [
      'FRMT', 
      'SUBFRMT', 
      'REGION', 
      'BRANCH', 
      'ART_GRP_LVL_0_NAME',
      'ТУ',
      'СВ',  
      'WHS_NAME'  
    ];
    const data = await Promise.all(filters.map(fieldName => {
      if (fieldName === 'WHS_NAME')
        return requestFilterShop(app, fieldName);
      return requestGetFilterData(app, fieldName);
    }));
    return data;
  }

  async function qlikRequestFiltersUpdate(app, conditions) {
    const entries = Object.entries(conditions);
    for (const item of entries) await applyFilter(app, item[0], item[1]);
  }

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

  function requestSetVariable(app, variableName, variableValue) {
    console.log("qlikRequestPrecisionUpdate", variableName, variableValue);
    return app.variable.setStringValue(variableName, `${variableValue}`);
  }

  async function qlikRequestPrecisions(app) {
    const variables = [
      'vPeriod',
      'vPeriodDiagram',
      'vPeriodUnit1',
      'vMatchShop'
    ];
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

  async function qlikRequestPrecisionsUpdate(app, precisions) {
    return Promise.all(['vPeriod', 'vPeriodDiagram', 'vPeriodUnit1'].map((name, index) => requestSetVariable(app, name, precisions[index])));
  }

  function processRTOMainTableBlock(name, units, row){
    console.log("processRTOMainTableBlock", name, row);
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

  function processDeviationRTO(name, units, row){
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
  	const rtoIndicator = indicatorsMainTable.find( it => it.id == 1);
  	if(!rtoIndicator) throw new Error('indicator RTO by id 1 not found');
  	const blockData = rtoIndicator['block'+ blockNumber];
  	if(!blockData) throw new Error('block'+ blockNumber + ' not found in rto');
  	console.log("RTO INDICATOR", rtoIndicator);
  	return requestWithCube(app, 
              rtoIndicator.name,
              rtoIndicator.units,
  						[rtoIndicator.dimension], 
  						[blockData.arrow, blockData.fact, blockData.factPp, blockData.factVsPp, blockData.factVsPpPercent, blockData.budget, blockData.factVsBudget, blockData.factVsBudgetPercent])
  }

  async function requestRTOMainTableBlock1(app) {
    return requestRTOMainTableBlock(app, 1).then( ( { reply, name, units } ) => {
      const matrix = reply.qHyperCube.qDataPages[0].qMatrix;
      if(matrix.length == 0) throw new Error('empty reply for RTO main table')
      const rtoData = processRTOMainTableBlock(name, units, matrix[0]);
      return rtoData;
    })
    .catch(e => console.error('Error while load results for main table RTO',e))
  }

  async function requestRTOMainTableBlock2(app) {
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

  async function requestIndicatorForMainTableBlock1(app, idIndicator) {
    return requestIndicatorForMainTableBlock(app, idIndicator, 1).then( ( { reply, name, units } ) => {
      const matrix = reply.qHyperCube.qDataPages[0].qMatrix;
      if(matrix.length == 0) throw new Error('empty reply for RTO main table')
      const data = processRTOMainTableBlock(name, units, matrix[0]);
      return data;
    })
    .catch(e => console.error(`Error while load results for main table ${idIndicator}`,e))
  }

  async function requestIndicatorForMainTableBlock2(app, idIndicator) {
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
        const rtoDeviationRegions = processDeviationRTO(name, units, matrix[0]);
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
        const rtoDeviationFormats = processDeviationRTO(name, units, matrix[0]);
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
          const rtoDeviationFormats = processDeviationRTO(name, units, matrix[0]);
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
          const rtoDeviationFormats = processDeviationRTO(name, units, matrix[0]);
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
  			reply.qHyperCube.qDimensionInfo.forEach( (dim) =>  coppyedHeaders.push(dim.qFallbackTitle) );
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

  async function requestChartRtoIndicator(app) {
    try {
      const result = await updateChartRtoIndicator(app);
      return result;
    } catch (e) {
      console.error(e);
    }
    return []
  }

  async function requestChartIndicator(app, idIndicator) {
    try {
      const result = await updateChartIndicatorMainTable(app, idIndicator);
      return result;
    } catch (e) {
      console.error(e);
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
  			reply.qHyperCube.qDimensionInfo.forEach( (dim) =>  coppyedHeaders.push(dim.qFallbackTitle) );
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
    await qlikRequestDatesUpdate(app, date, datePoP);
    return Promise.resolve();
  }

  async function qlikRequestOperationalOverviewData(app, type, idIndicator) {  
    console.log("OVERVIEW STARTED ", type, idIndicator);
    if (type === 'meta') {
      const tasks = [
        qlikRequestDates(app),
        qlikRequestFilterState(app),
        qlikRequestPrecisions(app)
      ];
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
      tasks.push(idIndicator == '1' ? requestChartRtoIndicator(app) : requestChartIndicator(app, idIndicator));
      const results = await Promise.all(tasks);
      return [results[0]];
    } else if (type === 'deviations') {
      const tasks = [];
      tasks.push(idIndicator == '1' ? requestDeviationFormatsRTO(app) : requestDeviationFormatsIndicator(app, idIndicator));
      tasks.push(idIndicator == '1' ? requestDeviationRegionsRTO(app) : requestDeviationRegionsIndicator(app, idIndicator));    
      const results = await Promise.all(tasks);
      return [results[0], results[1]];
    }
    return null;
  }

  async function qlikRequestOperationalOverview(app, filters, type, idIndicator) {
    if (type === 'meta') {
      console.log("qlikRequestOperationalOverview", filters);
      if (filters && !filters.initial && !filters.noUpdate) await qlikUpdateFilters(app, filters);
    }
    const overview = await qlikRequestOperationalOverviewData(app, type, idIndicator);
    return overview;
  }

  var indicators$1 = [
  	{
  		label: "Продажи",
  		indicators: [
  			{
  				id: "6",
  				order: 1,
  				label: "Комплексность",
  				url: "complexity",
  				configName: "Компл",
  				subLabel: "",
  				subLabelUnit: "штук в чеке",
  				status: false
  			},
  			{
  				id: "1",
  				order: 2,
  				label: "РТО",
  				url: "rto",
  				configName: "РТО",
  				subLabel: "",
  				subLabelUnit: "млн. руб.",
  				status: true
  			},
  			{
  				id: "4",
  				order: 4,
  				label: "Средний Чек",
  				url: "average-check",
  				configName: "СрЧек",
  				subLabel: "",
  				subLabelUnit: "руб.",
  				status: false
  			},
  			{
  				id: "7",
  				order: 5,
  				label: "Трафик",
  				configName: "Трафик",
  				url: "traffic",
  				subLabel: "",
  				subLabelUnit: "тыс. шт.",
  				status: false
  			}
  		]
  	},
  	{
  		label: "LFL",
  		indicators: [
  			{
  				id: "20",
  				order: 6,
  				label: "Инфляция",
  				url: "inflation",
  				configName: "Инфл",
  				subLabel: "",
  				subLabelUnit: "%",
  				status: false
  			},
  			{
  				id: "2",
  				order: 7,
  				label: "РТО LFL",
  				url: "rtolfl",
  				configName: "РТОLFL",
  				subLabel: "",
  				subLabelUnit: "%",
  				status: true
  			},
  			{
  				id: "5",
  				order: 8,
  				label: "Средний чек LFL",
  				url: "average-check-lfl",
  				configName: "СрЧекLFL",
  				subLabel: "",
  				subLabelUnit: "%",
  				status: true
  			},
  			{
  				id: "8",
  				order: 9,
  				label: "Трафик LFL",
  				url: "traffic-lfl",
  				configName: "ТрафикLFL",
  				subLabel: "",
  				subLabelUnit: "%",
  				status: true
  			}
  		]
  	},
  	{
  		label: "Наценка",
  		indicators: [
  			{
  				id: "25",
  				order: 10,
  				label: "CM",
  				url: "commercial-margin",
  				configName: "KM",
  				subLabel: "",
  				subLabelUnit: "%",
  				status: false
  			},
  			{
  				id: "24",
  				order: 11,
  				label: "FM",
  				url: "front-margin",
  				configName: "FM",
  				subLabel: "",
  				subLabelUnit: "%",
  				status: true
  			},
  			{
  				id: "27",
  				order: 25,
  				label: "Доля Лояльности в FM",
  				url: "rto-vs-loyalty",
  				configName: "Лояльность",
  				subLabel: "",
  				subLabelUnit: "%",
  				status: false
  			},
  			{
  				id: "26",
  				order: 26,
  				label: "Доля Мониторинга в FM",
  				url: "rto-vs-monitoring",
  				configName: "Монит",
  				subLabel: "",
  				subLabelUnit: "%",
  				status: false
  			},
  			{
  				id: "29",
  				order: 27,
  				label: "Доля Промо в FM",
  				url: "rto-vs-promo",
  				configName: "Промо%",
  				subLabel: "",
  				subLabelUnit: "%",
  				status: false
  			},
  			{
  				id: "31",
  				order: 28,
  				label: "Доля Прочего в FM",
  				url: "rto-vs-other",
  				configName: "Прочее",
  				subLabel: "",
  				subLabelUnit: "%",
  				status: false
  			},
  			{
  				id: "30",
  				order: 29,
  				label: "Доля Регулярного в FM",
  				url: "rto-vs-regular",
  				configName: "Регул",
  				subLabel: "",
  				subLabelUnit: "%",
  				status: false
  			},
  			{
  				id: "28",
  				order: 30,
  				label: "Доля Уценки в FM",
  				url: "rto-vs-markdown",
  				configName: "Уценка",
  				subLabel: "",
  				subLabelUnit: "%",
  				status: false
  			}
  		]
  	},
  	{
  		label: "Промо",
  		indicators: [
  			{
  				id: "23",
  				order: 24,
  				label: "Промо",
  				url: "promo",
  				configName: "Промо",
  				subLabel: "",
  				subLabelUnit: "%",
  				status: true
  			}
  		]
  	},
  	{
  		label: "Потери",
  		indicators: [
  			{
  				id: "17",
  				order: 12,
  				label: "Потери",
  				url: "abs-losses",
  				configName: "ПотерАБС",
  				subLabel: "",
  				subLabelUnit: "млн. руб.",
  				status: false
  			},
  			{
  				id: "15",
  				order: 13,
  				label: "Доля потерь в выручке",
  				url: "loss-to-revenue",
  				configName: "ПотерВыруч",
  				subLabel: "",
  				subLabelUnit: "%",
  				status: true
  			},
  			{
  				id: "16",
  				order: 14,
  				label: "Доля потерь в себестоимости",
  				url: "loss-to-cost",
  				configName: "ПотерСебест",
  				subLabel: "",
  				subLabelUnit: "%",
  				status: false
  			}
  		]
  	},
  	{
  		label: "Ассортимент",
  		indicators: [
  			{
  				id: "19",
  				order: 35,
  				label: "Ассортимент",
  				url: "range",
  				configName: "Ассорт",
  				subLabel: "",
  				subLabelUnit: "шт.",
  				status: false
  			}
  		]
  	},
  	{
  		label: "Развитие",
  		indicators: [
  			{
  				id: "10",
  				order: 41,
  				label: "Количество закрытых объектов",
  				configName: "КолЗакрТО",
  				url: "number-of-closed-objects",
  				subLabel: "",
  				subLabelUnit: "шт.",
  				status: false
  			},
  			{
  				id: "9",
  				order: 42,
  				label: "Количество объектов",
  				configName: "КолРабТО",
  				url: "number-of-objects",
  				subLabel: "",
  				subLabelUnit: "шт.",
  				status: false
  			}
  		]
  	}
  ];

  const region = {
  	qLabel: "Округ",
  	qLibraryId: "pzMPQ",
  	qNullSuppression: true
  };
  const format = {
  	qLabel: "Формат",
  	qLibraryId: "8191e425-8372-4ff2-b6ad-73356e29de11",
  	qNullSuppression: true
  };
  const group20 = {
  	qLabel: "ГР20",
  	qLibraryId: "5cbae1fb-ff9b-468c-be21-56e7a0f92b2d",
  	qNullSuppression: true
  };
  var dimensions = {
  	region: region,
  	format: format,
  	group20: group20
  };

  const INDICATORS = indicators$1.reduce((result, group) => [...result, ...group.indicators], []);

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
  		});
  	});
  	return block;
  }

  function formatDateString$1(str) {
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
  				group = DATA.groups.find( g => g.name == lastGroupName);
  				if(!group){
  					group = { name: lastGroupName, series: [] };
  					DATA.groups.push(group);
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
  					name: formatDateString$1(lastLabel),
  					data: +rows[i][j].qNum,
  					text: rows[i][j].qText
  				});
  			}
  		}
  	}
  	return DATA;
  }

  async function requestWithCube$1(app, name, dimensions, measures){
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
  	const indicatorRto = indicatorsMainTable.find(it=> it.id == 1);
  	if(!indicatorRto) throw new Error('Indicator rto not found in indicatorsMainTable');
  	const blockData = indicatorRto['block' + blockNumber];
  	return requestWithCube$1(app, 
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
  		});
  	});
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
    const indicator = indicatorsMainTable.find(it=> it.id == idIndicator);
  	if(!indicator) throw new Error('Indicator with id ' + idIndicator + ' not found in indicatorsMainTable');
  	const blockData = indicator['block' + blockNumber];
  	if(!blockData) throw Error('not found blockData ' + blockNumber + ' for indicatorId' + idIndicator)
  	return requestWithCube$1(app, 
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
  	return requestWithCube$1(app, 
      chartIndicator.name,
      [chartIndicator.dimension, dimension, dimensionPeriod],
      measuresChartIndicatorSlices);
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
  			reply.qHyperCube.qDimensionInfo.forEach( (dim) =>  coppyedHeaders.push(dim.qFallbackTitle) );
  			reply.qHyperCube.qMeasureInfo.forEach(( measureName)=> coppyedHeaders.push(measureName.qFallbackTitle));
  			const DATA = processRowsChartIndicator(coppyedHeaders, matrix);
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
  			reply.qHyperCube.qDimensionInfo.forEach( (dim) =>  coppyedHeaders.push(dim.qFallbackTitle) );
  			reply.qHyperCube.qMeasureInfo.forEach(( measureName)=> coppyedHeaders.push(measureName.qFallbackTitle));
        const DATA = processRowsChartIndicator(coppyedHeaders, matrix);
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
  			reply.qHyperCube.qDimensionInfo.forEach( (dim) =>  coppyedHeaders.push(dim.qFallbackTitle) );
  			reply.qHyperCube.qMeasureInfo.forEach(( measureName)=> coppyedHeaders.push(measureName.qFallbackTitle));
  			const DATA = processRowsChartIndicator(coppyedHeaders, matrix);
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
  			reply.qHyperCube.qDimensionInfo.forEach( (dim) =>  coppyedHeaders.push(dim.qFallbackTitle) );
  			reply.qHyperCube.qMeasureInfo.forEach(( measureName)=> coppyedHeaders.push(measureName.qFallbackTitle));
  			const DATA = processRowsChartIndicator(coppyedHeaders, matrix);
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
  			reply.qHyperCube.qDimensionInfo.forEach( (dim) =>  coppyedHeaders.push(dim.qFallbackTitle) );
  			reply.qHyperCube.qMeasureInfo.forEach(( measureName)=> coppyedHeaders.push(measureName.qFallbackTitle));
  			const DATA = processRowsChartIndicator(coppyedHeaders, matrix);
        console.log('slices format rto chart', DATA);
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
  			reply.qHyperCube.qDimensionInfo.forEach( (dim) =>  coppyedHeaders.push(dim.qFallbackTitle) );
  			reply.qHyperCube.qMeasureInfo.forEach(( measureName)=> coppyedHeaders.push(measureName.qFallbackTitle));
  			const DATA = processRowsChartIndicator(coppyedHeaders, matrix);
  			console.log('slices group20 rto chart', DATA);
        return DATA;
  		})
  }

  // Запрос на графики на срезах для показателя РТО
  async function requestChartIndicatorRtoSlices(app, dimension){
  	const rtoIndicator = chartsForIndicatorsMainTable.items.find( data => data.id == 1);
  	if(!rtoIndicator) throw new Error('chart config slices no found for rto');
  	return requestWithCube$1(app, 
      rtoIndicator.name,
      [rtoIndicator.dimension, dimension, chartsForIndicatorsMainTable.extraDimensions.period],
      [rtoIndicator.fact, rtoIndicator.factPp, rtoIndicator.vsFactPp, rtoIndicator.budget, rtoIndicator.vsBudget])
  }

  async function updateChartIndicatorAverageCheckLFL(app){
  	console.log('try update chart middle check lfl');
  	return requestChartAverageCheckLFL(app)
  		.then(( {reply, name}) => {
  			const matrix = reply.qHyperCube.qDataPages[0].qMatrix;
  			if(matrix.length == 0) throw new Error('matrix null for chart indicatorId ' + 5);
  			let coppyedHeaders = [];
  			reply.qHyperCube.qDimensionInfo.forEach( (dim) =>  coppyedHeaders.push(dim.qFallbackTitle) );
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
  	return requestWithCube$1(app,
  							chartConfig.name,
  							[chartConfig.dimension, chartsForIndicatorsMainTable.extraDimensions.period],
  							[chartConfig.commodityPriceMIX, chartConfig.complexInfluence, 
  								chartConfig.dynamicUnregularPriceInflation, chartConfig.retailPriceInflationInfluence, chartConfig.loyaltyProductsInfluence  ])
  }

  async function qlikUpdateFilters$1(app, { conditions, date, datePoP, columnPrecision, datePrecision, dynamics } ) {
    await qlikRequestFiltersUpdate(app, conditions);
    await qlikRequestPrecisionsUpdate(app, [columnPrecision, dynamics, datePrecision]);
    await qlikRequestDatesUpdate(app, date, datePoP);
    return Promise.resolve();
  }

  async function qlikRequestOperationalSlicesData(app, filters, id, type) {
    if (type === 'meta') {
      const tasks = [
        qlikRequestDates(app),
        qlikRequestFilterState(app),
        qlikRequestPrecisions(app)
      ];
      const results = await Promise.all(tasks);
      return { dates: results[0], filter: results[1], precision: results[2] } 
    } else if (type === 'data') {
      const tasks = [];
      tasks.push(id == '1' ? requestRTOMainTableBlock1(app) : requestIndicatorForMainTableBlock1(app, id));
      tasks.push(id == '1' ? requestRTOMainTableBlock2(app) : requestIndicatorForMainTableBlock2(app, id));
      tasks.push(filters.kind == '1' ? updateChartIndicatorAverageCheckLFL(app) : (id == '1' ? requestChartRtoIndicator(app) : requestChartIndicator(app, id)));
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

  async function qlikRequestOperationalSlices(app, indicator, filters, type) {
    const foundIndicator = findIndicator(indicator);
    const { label, id } = foundIndicator;
    const indicatorId = parseInt(id);
    console.log("SLICES STARTED", label, indicatorId, foundIndicator, type, filters);
    if (type === 'meta') {
      if (filters && !filters.initial && !filters.noUpdate) {
        await qlikUpdateFilters$1(app, filters);
      }
    }  
    const slices = await qlikRequestOperationalSlicesData(app, filters, indicatorId, type);
    console.log("SLICES FINISHED", type);
    return slices;
  }

  const factorsOfIndicators = [
  	{
  		id: 1,
  		name: "РТО",
  		dimensions: [],
  		factorsNames: ["Доля Промо на РТО", "Доля Прочее на РТО", "Доля Регулярного на РТО", "Доля Уценки на РТО", "Доля Лояльности на РТО", "Доля Мониторинга на РТО", "Доля Доп.Промо в РТО"],
  		block1: {
  			results: {
  				fact: {
  					"qLabel": "ОсновнаяТаблица.РТО_день_тп",
  					"qLibraryId": "63705185-448c-4ab5-8256-77a9e3643d21",
  				},
  				factPp: {
  					"qLabel": "ОсновнаяТаблица.РТО_день_пп",
  					"qLibraryId": "df457a1b-8a05-4fe1-b91a-af14504b4b66",
  				},
  			},
  			bridge: {
  				promoInfluence: {
  					"qLabel": "ОсновнаяТаблица.Влияние Промо на РТО день_тп",
  					"qLibraryId": "94e76b54-e33e-46b2-909a-330c6175bbba",
  				},
  				otherInfluence: {
  					"qLabel": "ОсновнаяТаблица.Влияние Прочее на РТО _день_тп",
  					"qLibraryId": "8ea33f37-4fc2-4c45-adde-97132bb4af18",
  				},
  				regularInfluence: {
  					"qLabel": "ОсновнаяТаблица.Влияние Регулярного день тп",
  					"qLibraryId": "492d2639-316e-4674-a86e-1e39c66e81c5",
  				},
  				lostCostInfluence: {
  					"qLabel": "ОсновнаяТаблица.Влияние Уценки день_тп",
  					"qLibraryId": "21a20947-5286-4b13-80e8-2d877fdd0b1a",
  				},
  				loyaltyInfluence: {
  					"qLabel": "ОсновнаяТаблица.Влияние Лояльности день_тп",
  					"qLibraryId": "39603987-fbf3-402b-bbc6-bb8ccef4695e",
  				},
  				monitoringInfluence: {
  					"qLabel": "ОсновнаяТаблица.Влияние Мониторинга день_тп",
  					"qLibraryId": "a8707498-b388-492b-8d56-915653dab166",
  				},
  				extraPromoInfluence: {
  					"qLabel": "ОсновнаяТаблица.Влияние Доп.Промо день_тп",
  					"qLibraryId": "UGUK",
  				},
  			}
  		},
  		block2: {
  			results: {
  				fact: {
  					"qLabel": "ОсновнаяТаблица.РТО_тп",
  						"qLibraryId": "evxjV",
  				},
  				factPp: {
  					"qLabel": "ОсновнаяТаблица.РТО_пп",
  					"qLibraryId": "c2e254c7-4bc3-43ed-9d2c-1718eb6fd23e",
  				},
  			},
  			bridge: {
  				promoInfluence: {
  					"qLabel": "ОсновнаяТаблица.Влияние Промо на РТО _тп",
  					"qLibraryId": "6e4391c2-bd6a-450e-9139-a18e4888b77b",
  				},
  				otherInfluence: {
  					"qLabel": "ОсновнаяТаблица.Влияние Прочее на РТО _тп",
  					"qLibraryId": "8e2eced5-53eb-4b0d-ae64-08ab9df9ed6e",
  				},
  				regularInfluence: {
  					"qLabel": "ОсновнаяТаблица.Влияние Регулярного _тп",
  					"qLibraryId": "c9ad88ce-8c2d-4d02-b8e4-50f3bb18f305",
  				},
  				lostCostInfluence: {
  					"qLabel": "ОсновнаяТаблица.Влияние Уценки _тп",
  					"qLibraryId": "675b22bf-34c1-4cb2-8c13-1d947b5dd4a4",
  				},
  				loyaltyInfluence: {
  					"qLabel": "ОсновнаяТаблица.Влияние Лояльности _тп",
  					"qLibraryId": "43e55715-5650-4e39-837f-45965ca09f06",
  				},
  				monitoringInfluence: {
  					"qLabel": "ОсновнаяТаблица.Влияние Мониторинга _тп",
  					"qLibraryId": "2a0a9da1-61c9-4b5c-a02d-43010acc796a",
  				},
  				extraPromoInfluence: {
  					"qLabel": "ОсновнаяТаблица.Влияние Доп.Промо_тп",
  					"qLibraryId": "FddJUFN",
  				}
  			}
  		}
  	},
  	{
  		id: 5,
  		name: "Средний чек LFL",
  		dimensions: [],
  		factorsNames: ["Влияние товарно-ценовой MIX'a", "Влияние комплексности", "Влияние динамики нерегулярных цен", "Влияние инфляции розничных цен, %", "Влияние товаров лояльности, %" ],
  		block1: {
  			commodityPriceMIX: {
  				"qLabel": "Товарно-ценовой MIX_факторы_день",
  				"qLibraryId": "ppRKP",
  			},
  			complexInfluence: {
  				"qLabel": "Влияние комплексности_факторы_день",
  				"qLibraryId": "ERvkj",
  			},
  			dynamicUnregularPriceInflation: {
  				"qLabel": "Влияние динамики нерегулярных цен_факторы_день",
  				"qLibraryId": "79ff1a6a-fd4f-4b81-8cc0-d273ec73bd21",
  			},
  			retailPriceInflationInfluence: {
  				"qLabel": "Влияние инфляции розничных цен, %_факторы_день",
  				"qLibraryId": "080a8109-750d-4cb5-8547-d812bd4c3df4",
  			},
  			loyaltyProductsInfluence: {
  				"qLabel": "Влияние товаров лояльности, %_факторы_день",
  				"qLibraryId": "8ac9e4af-44de-4275-8f25-7f00959a9030",
  			}
  		},
  		block2: {
  			commodityPriceMIX: {
  				"qLabel": "Товарно-ценовой MIX_факторы",
  				"qLibraryId": "12eea713-da11-4a13-b3be-795608b188aa",
  			},
  			complexInfluence: {
  				"qLabel": "Влияние комплексности_факторы",
  				"qLibraryId": "d3c097b5-9386-43b8-b31e-3893d748c136",
  			},
  			dynamicUnregularPriceInflation: {
  				"qLabel": "Влияние динамики нерегулярных цен_факторы",
  				"qLibraryId": "cfef6ffa-812d-4399-9e63-2ea11d82147d",
  			},
  			retailPriceInflationInfluence: {
  				"qLabel": "Влияние инфляции розничных цен, %_факторы",
  				"qLibraryId": "94a35195-1920-4ea1-a8a8-b12f0b8669f9",
  			},
  			loyaltyProductsInfluence: {
  				"qLabel": "Влияние товаров лояльности, %_факторы",
  				"qLibraryId": "0a775afa-b4c5-4949-8273-10cc7aa42c1d",
  			}
  		}
  	},
  	{
  		id: 20,
  		name: "Инфляция",
  		dimensions: {
  			group20: {
  				"qLabel": "ГР20",
  				"qLibraryId": "5cbae1fb-ff9b-468c-be21-56e7a0f92b2d",
  				"qNullSuppression": true,
  			}
  		},
  		bridge: { 
  			fact: {
  				"qLabel": "ОсновнаяТаблица.Инфляция_день_тп",
  				"qLibraryId": "7f0ba111-315e-4bbc-a278-eaebfb5bcef3",
  			},
  			marginalityContribution: {
  				"qLabel": "Вклад за счет Маржинальности",
  				"qLibraryId": "QdedHT",
  			},
  			inflationVsRtoLFL: {
  				"qLabel": "InfVSRTOLFL",
  				"qLibraryId": "zzaVL",
  			},
  			complexityContribution: {
  				"qLabel": "Вклад категории в комплексность",
  				"qLibraryId": "Vkpjmz",
  			}
  		},
  		results: {
  			factPp:{
  				"qLabel": "ОсновнаяТаблица.Инфляция_день_пп",
  				"qLibraryId": "9864317c-2d7c-4d9b-8df4-dd4bb0d24ab3",
  			},
  			fact: {
  				"qLabel": "ОсновнаяТаблица.Инфляция_день_тп",
  				"qLibraryId": "7f0ba111-315e-4bbc-a278-eaebfb5bcef3",
  			},
  			factVsPp: {
  				"qLabel": "ОсновнаяТаблица.Инфляция_день_тпVSпп%",
  				"qLibraryId": "d1c8bd7a-e33c-4391-ab5c-aa6f17830f99",
  			},
  			marginalityContributionPp: {
  				"qLabel": "Вклад за счет Маржинальности_PY",
  				"qLibraryId": "f2666201-1ac0-4673-abd4-34d310b0e238",
  			},
  			marginalityContribution: {
  				"qLabel": "Вклад за счет Маржинальности",
  				"qLibraryId": "QdedHT",
  			},
  			marginalityContributionVsPp: {
  				"qLabel": "Вклад за счет Маржинальности тпVSпп",
  				"qLibraryId": "982f5075-c283-49ab-9973-8b8ce09a22e3",
  			},
  			inflationVsRtoLFLPp: {
  				"qLabel": "InfVSRTOLFL_LY",
  				"qLibraryId": "a02ea8e8-5d56-4488-92e0-4fe1114f0cf9",
  			},
  			inflationVsRtoLFL: {
  				"qLabel": "InfVSRTOLFL",
  				"qLibraryId": "zzaVL",
  			},
  			inflationVsRtoLFLVsPp: {
  				"qLabel": "InfVSRTOLFL тпVSпп",
  				"qLibraryId": "2625fbcb-3ba0-4b13-bba3-1fe01dc01887",
  			},
  			complexityContributionPp: {
  				"qLabel": "Вклад категории в комплексность_PY",
  				"qLibraryId": "94a6d5d6-ce8c-46dc-bf30-8f41f56e7389",
  			},
  			complexityContribution: {
  				"qLabel": "Вклад категории в комплексность",
  				"qLibraryId": "Vkpjmz",
  			},
  			complexityContributionVsPp: {
  				"qLabel": "Вклад категории в комплексность тпVSпп",
  				"qLibraryId": "62a86946-dc1a-41b2-9ea3-d4a7446ca9f7",
  			}
  		}
  	}
  ];

  const INDICATORS$1 = indicators$1.reduce((result, group) => [...result, ...group.indicators], []);

  function findIndicator$1(indicator) {
    return INDICATORS$1.find(option => option.url === indicator);
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
  };

  const getHierarchyItemsIds = (indicatorId) => {
    const foundHierarchy = hierarchyIndicators.indicators.find( it=> it.id == indicatorId);
    return foundHierarchy ? foundHierarchy.itemsIds : [];
  };

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

  function formatDateString$2(str) {
    const parts = str.split('.');
    if (parts.length !== 3) return '';
    return `${parts[2]}${parts[1]}${parts[0]}`
  }

  function processRowForChartIndicator$1(headers, rows, seriesSettings){
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
  					name: formatDateString$2(lastLabel),
  					data: +rows[i][j].qNum,
            text: rows[i][j].qText
  				});
  			}
  		}

  	}
  	return DATA;
  }

  async function requestWithCube$2(app, name, units, dimensions, measures){
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
  	return requestWithCube$2(app, 
              indicator.name,
              indicator.units,
  						[indicator.dimension],
  						[blockData.factVsPpPercent])
  }

  //запрос на график для индикатора по иерархии
  async function requestHyerarchyChartIndicator(app, idIndicator){
  	const indicatorChartConfig = chartsForIndicatorsMainTable.items.find( data => data.id == idIndicator);
  	if(!indicatorChartConfig) throw new Error('error config for chart indicator hyerarchy: ' + idIndicator );
  	return requestWithCube$2(app,
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
  			reply.qHyperCube.qDimensionInfo.forEach( (dim) =>  coppyedHeaders.push(dim.qFallbackTitle) );
  			reply.qHyperCube.qMeasureInfo.forEach(( measureName)=> coppyedHeaders.push(measureName.qFallbackTitle));
  			let seriesSettings = [
  				{ type: 'bar', color: '#8506a9', axisY: 'rightDown'},
  			];
  			const DATA = processRowForChartIndicator$1(coppyedHeaders, matrix, seriesSettings);	// функция из раздела "Основная Таблица"		
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
  	});
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
  	return requestWithCube$2(app, 
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
  		}]);
  	}
  	return items;
  }

  // обновление факторов для Инфляции
  async function updateFactorsInflationBridge(app){
  	return requestFactorsInflationBridge(app)
  		.then( ({ reply, units, name}) => {
  			const bridgeData = processFactorsInflationBridge(reply, '%');
  			console.log('bridge инфляция', bridgeData);
  			return Promise.resolve(bridgeData);
  		})
  }

  // запрос факторов для инфляции для диаграммы моста
  async function requestFactorsInflationBridge(app){
  	const factorConfig = factorsOfIndicators.find( item => item.id == 20);
  	if(!factorConfig) throw new Error('not found config for factors for id ' + 20);
  	return requestWithCube$2(app,
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
      }]);
      items2.push([{
        block1: {
          name: matrix[i][0].qText,
          units: units,
          blockData: {
            vsBudgetPercent: matrix[i][4],
            vsFactPercent: matrix[i][3]
          }
        }
      }]);
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
  	return requestWithCube$2(app,
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
  	const {reply, units} = await requestFactorsRtoBridgeBlock(app, blockNumber);
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
  	return requestWithCube$2(app, 
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
  		}]);
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

  async function qlikUpdateFilters$2(app, { conditions, date, datePoP, columnPrecision, datePrecision, dynamics } ) {
    await qlikRequestFiltersUpdate(app, conditions);
    await qlikRequestPrecisionsUpdate(app, [columnPrecision, dynamics, datePrecision]);
    await qlikRequestDatesUpdate(app, date, datePoP);
    return Promise.resolve();
  }

  async function qlikRequestOperationalFactorsData(app, filters, id, type) {
    if (type === 'meta') {
      const tasks = [
        qlikRequestDates(app),
        qlikRequestFilterState(app),
        qlikRequestPrecisions(app)
      ];
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
        tasks.push(updateFactorsAverageCheckLFLBridge(app));
        tasks.push(requestIndicatorForMainTableBlock1(app, id));
        tasks.push(requestIndicatorForMainTableBlock2(app, id));
        const results = await Promise.all(tasks);
        return [[zipResults(results[1], results[2])], zipBridges(results[0][0], results[0][1])]
      } else if (id == '20') {      
        tasks.push(updateFactorsInflationBridge(app));
        tasks.push(updateFactorsInflationResults(app));
        const results = await Promise.all(tasks); 
        return [[zipResults(results[1][0], results[1][1])], zipBridges(results[0][0], results[0][1])]
      }
    }
    return null;
  }

  async function qlikRequestOperationalFactors(app, indicator, filters, type) {
    const foundIndicator = findIndicator$1(indicator);
    const { label, id } = foundIndicator;
    const indicatorId = parseInt(id);
    console.log("FACTORS STARTED", label, indicatorId, foundIndicator, type, filters);
    if (type === 'meta') {
      if (filters && !filters.initial && !filters.noUpdate) 
        await qlikUpdateFilters$2(app, filters);
    }
    const factors = await qlikRequestOperationalFactorsData(app, filters, indicatorId, type);
    console.log("FACTORS FINISHED", type, factors);
    return factors; 
  }

  function qlikRequestTemplatesData(app) {
    return new Promise((resolve) => { app.getList('BookmarkList', resolve); });
  }

  function processTemplate(bookmark) {
    return {
      label: bookmark.qData.title,
      description: bookmark.qData.description,
      id: bookmark.qInfo.qId,
    };
  }

  function processTemplatesRawData(response) {
    const data = response.qBookmarkList.qItems.map(processTemplate);
    return data;
  }

  async function qlikRequestTemplates(app) {
    const data = await qlikRequestTemplatesData(app)
      .then(processTemplatesRawData);
    return data;
  }

  async function qlikRequestApplyTemplate(app, { id }) {
    const status = await app.bookmark.apply(id);
    return status;
  }

  async function qlikRequestCreateTemplate(app, { name, description }) {
    const status = await app.bookmark.create(name, description);
    return status.id;
  }

  async function qlikRequestRemoveTemplate(app, { id }) {
    const status = await app.bookmark.remove(id);
    return status;
  }

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
        console.log("REPLY", reply);
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
    console.log("applyExportConfig", 'export_excel', exportConfigStr);
  	return app.variable.setStringValue('export_excel', exportConfigStr)
  }
  // выгрузка в excel
  async function downloadExcel(app) {
    try {
      const model = await app.getObject('QV1', 'HWYCxz');
      const reply = await model.exportData();
      return reply.qUrl;
    } catch (e) {
      console.error('error whle export to excel', e);
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

  async function qlikRequestOperationalExportData(app) {
    const dates = await qlikRequestDates(app);
    const filter = await qlikRequestFilterState(app);
    const precision = await qlikRequestPrecisions(app);
    const data = await loadExportConfig(app);
    console.log("loadExportConfig", data);
    const exportData = zipFinancialExport(data, filter, precision, dates);
    console.log("EXPORT DATA", exportData);
    return exportData;
  }

  async function qlikRequestOperationalExport(app, config, filters, prevFilters) {
    console.log("qlikRequestOperationalExport", config, filters, prevFilters);
    await qlikRequestFiltersUpdate(app, filters);
    await applyExportConfig(app, config);
    const data = await downloadExcel(app);
    console.log("downloadExcel", data);
    await qlikRequestFiltersUpdate(app, prevFilters);
    return Promise.resolve(data);
  }

  /* global require */

  let app;

  function qlikRequestSlices(indicator, filters, type) {
    return qlikRequestOperationalSlices(app, indicator, filters, type);
  }

  function qlikRequestFactors(indicator, filters, type) {
    return qlikRequestOperationalFactors(app, indicator, filters, type);
  }

  function qlikRequestDetail(indicator, detail, filters, type) {
    if (detail === 'factors') return qlikRequestFactors(indicator, filters, type);
    return qlikRequestSlices(indicator, filters, type);
  }

  function qlikRequestOverview(filters, type, idIndicator) {
    return qlikRequestOperationalOverview(app, filters, type, idIndicator);
  }

  function qlikRequestExportData() {
    return qlikRequestOperationalExportData(app);
  }

  function qlikRequest({ indicator, detail, filters, type, idIndicator }) {
    if (detail) return qlikRequestDetail(indicator, detail, filters, type)
    else if (indicator && indicator === 'export') return qlikRequestExportData();
    else if (indicator) return qlikRequestSlices(indicator, filters, type)
    return qlikRequestOverview(filters, type, idIndicator);
  }

  function qlikRequestMeta() {
    console.log("qlikRequestMeta");
    return Promise.all([
      qlikRequestTemplates(app),
      qlikRequestDates(app),
    ]);
  }

  function qlikRequestTemplateAction({ action, data }) {
    if (action === 'add') return qlikRequestCreateTemplate(app, data);
    else if (action === 'remove') return qlikRequestRemoveTemplate(app, data);
    return qlikRequestApplyTemplate(app, data);
  }

  function qlikRequestExport({ config, filters, prevFilters }) {
    return qlikRequestOperationalExport(app, config, filters, prevFilters);
  }

  function qlikClientStart() {
    return new Promise((resolve) => {
      let prefix = window.location.pathname.substr(0, window.location.pathname.toLowerCase().lastIndexOf("/extensions" ) + 1);
      if (prefix.length === 0) prefix = '/';    
      const hostname = window.location.hostname;
      const host = hostname.includes('corp.tander.ru') ? hostname : "qsense.corp.tander.ru";    
      const connection = { 
        host: host,      
        prefix: prefix,
        port: 443,
        isSecure: window.location.protocol === "https:",
      };
      const port = `:${connection.port}`;
      const baseUrl = `https://${host}${port}${prefix}resources/`;
      require.config({ baseUrl });
      console.log("STARTED", connection);
      require(['js/qlik'], (qlik) => {
        qlik.setOnError(error => console.log(error));
        app = qlik.openApp(config.id, connection);
        resolve();
      });
    });
  }

  function dispatchResponseEvent(data, name) {
    const event = new CustomEvent(name, { detail: data });
    window.dispatchEvent(event);
  }

  function dispatchErrorEvent(error) {
    const event = new CustomEvent('error', { detail: error });
    window.dispatchEvent(event);
  }

  function dispatchReadyEvent() {
    const event = new CustomEvent('proxyready');
    window.dispatchEvent(event);
  }

  function sendResponse(data, name = 'dataresponse') {
    dispatchResponseEvent(data, name);
  }

  function sendDataResponse(data) {
    sendResponse(data);
  }

  function sendMetaResponse(data) {
    sendResponse(data, 'metaresponse');
  }

  function sendExportResponse(data) {
    sendResponse(data, 'exportresponse');
  }

  function sendTemplateActionResponse(data) {
    sendResponse(data, 'templateactionresponse');
  }

  function sendError(error) {
    dispatchErrorEvent(error);
    console.error(error);
  }

  async function onEventRequest({ detail }) {
    const { uuid, key, ...data } = detail;
    try {
      const response = await qlikRequest(data);
      sendResponse(response, uuid);
    } catch(e) {
      const error = { error: e };
      sendResponse(error, uuid);
    }
  }

  function onDataRequest({ detail }) {
    qlikRequest(detail)
      .then(sendDataResponse)
      .catch(sendError);
  }

  function onMetaRequest() {
    qlikRequestMeta()
      .then(sendMetaResponse)
      .catch(sendError);
  }

  function onExportRequest({ detail }) {
    qlikRequestExport(detail)
      .then(sendExportResponse)
      .catch(sendError);
  }

  function onTemplateActionRequest({ detail }) {
    qlikRequestTemplateAction(detail)
      .then(sendTemplateActionResponse)
      .catch(sendError);
  }

  function subscribeRequests() {
    window.addEventListener('eventrequest', onEventRequest);
    window.addEventListener('datarequest', onDataRequest);
    window.addEventListener('metarequest', onMetaRequest);
    window.addEventListener('exportrequest', onExportRequest);
    window.addEventListener('templateactionrequest', onTemplateActionRequest);
  }

  function initProxy() {
    subscribeRequests();
    qlikClientStart()
      .then(dispatchReadyEvent);
  }

  initProxy();

}());
//# sourceMappingURL=proxy.js.map
