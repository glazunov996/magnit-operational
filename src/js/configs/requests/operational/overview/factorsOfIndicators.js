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
]

export default factorsOfIndicators