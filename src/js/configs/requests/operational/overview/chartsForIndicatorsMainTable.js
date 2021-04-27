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
}

export default chartsForIndicatorsMainTable;