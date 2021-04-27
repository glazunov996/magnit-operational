<script>
  import { getContext } from 'svelte';

  const config = getContext('app').getAppConfig().dashboards;
  const { indicators: financialIndicatorsConfig } = config.financial;
  const { indicators: operationalIndicatorsConfig } = config.operational;

  const LABELS = {
    financial: 'Финансовый дашборд',
    operational: 'Операционный дашборд',
  };

  const INDICATORS = {
    financial: financialIndicatorsConfig,
    operational: operationalIndicatorsConfig,
  };

  export let dashboard;
  export let indicator;
  export let detail;

  $: title = renderTitle(dashboard, indicator, detail);

  function findIndicatorLabel() {
    if (indicator === 'export') return `${LABELS[dashboard]}`;
    let result;
    Object.values(INDICATORS[dashboard]).some(({ indicators }) => {
      const condition = indicators.find(option => option.url === indicator);
      if (condition) result = condition.label;
      return condition;
    });
    return result;
  }

  function findDetailLabel() {
    if (indicator === 'export') return 'Выгрузка данных';
    if (detail) {
      if (detail === 'comparisons') return 'Сравнения';
      return 'Факторы';
    }
    return 'Срезы';
  }

  function renderTitle() {
    if (!indicator) return LABELS[dashboard];
    const indicatorLabel = findIndicatorLabel();
    const detailLabel = findDetailLabel();
    return `${indicatorLabel} – ${detailLabel}`;
  }
</script>

<svelte:head>
  <title>
    {title}
  </title>
</svelte:head>
