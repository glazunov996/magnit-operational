<script>
  import { setContext, getContext, onDestroy, tick } from 'svelte';
  import { initFilter, updateFilter, subscribeFilterAll } from 'state/filter';
  import { initIndicators } from 'state/indicators';
  import { initGraphs, getGraphsState } from 'state/graphs';
  import { updateDashboard, getDashboardState } from 'state/dashboard';
  import { updateExport, getExportState } from 'state/export';
  import { getUIState } from 'state/ui';
  import { requestUpdate } from 'utilities/data';
  import { CONFIG } from 'utilities/config';
  import { getActiveIndicatorsState } from 'state/indicators';
  import Filter from 'components/filter/Filter.svelte';
  import Loader from 'components/loader/Loader.svelte';
  import Reload from 'components/reload/Reload.svelte';
  import Indicators from 'components/indicators/Indicators.svelte';
  import DashboardContent from './DashboardContent.svelte';
  import { executeRequest } from 'utilities/req';
  import { calculateDatesForValue } from 'utilities/date';
  import sortFilterOptions from 'utilities/sortFilterOptions';
  
  export let dashboard;
  export let indicator;
  export let detail;
  export let location;
  export let filterConfig;
  export let indicatorsConfig;
  export let columnConfig;

  const { graphs: graphConfig } = getContext('app').getAppConfig();

  let initial = true;
  let noUpdate = false;
  let loading = false;
  let reloadNeeded = false;

  initFilter(filterConfig);
  initGraphs(graphConfig, dashboard);
  initIndicators(indicatorsConfig);
  updateDashboard({ column: columnConfig[0].indicators[0].value });

  const updating = getUIState('updating');
  const downloading = getExportState('downloading');
  const dynamics = getGraphsState('dynamics');
  const kind = getGraphsState('kind');
  const date = getDashboardState('date');
  const datePoP = getDashboardState('datePoP');
  const datePrecision = getDashboardState('datePrecision');
  const columnPrecision = getDashboardState('columnPrecision');
  const units = getDashboardState('units');
  const templateUpdate = getUIState('templateUpdate');
  const activeIndicators = getActiveIndicatorsState();

  let dashboardData = null;
  let dashboardFilterData = null;
  let dashboardMetaData = null;
  let fetchingData = false;

  let conditions = {};

  setContext('config', {
    getDashboard: () => dashboard,
    getFilterConfig: () => filterConfig,
    getIndicatorsConfig: () => indicatorsConfig,
    getColumnConfig: () => columnConfig,
  });

  const unsubscribeFilter = subscribeFilterAll(onFilterUpdate);

  $: dynamicsOptions = updateDynamicOptions(dashboard);
  $: updateData(location, conditions, $date, datePoP, $datePrecision, $columnPrecision, $dynamics, $datePoP, $kind);
  $: updateDataTemplate($templateUpdate);
  $: fetchUpdateData($activeIndicators);

  function shouldRenderContent() {
    return dashboardData || indicator === 'export';
  }

  function updateDynamicOptions() {
    return graphConfig.dynamics;
  }

  function onFilterUpdate(key, update) {
    const shouldUpdate = Object.prototype.hasOwnProperty.call(conditions, key);
    conditions[key] = update;
    if (shouldUpdate) conditions = conditions;
  }

  function unsubscribe() {
    unsubscribeFilter.forEach((unsubscribeKey) => { unsubscribeKey(); });
  }

  function saveUpdate({ data, filter, precision, dates }) {
    dashboardData = data;
    dashboardFilterData = filter;
    dashboardMetaData = { filter, precision, dates };
  }

  function updateExportState({ slices, expressions }) {
    updateExport({ slicesValue: slices, expressionsValue: expressions });
  }

  function updateOperationalPrecision(columnPrecisionData, graphPrecisionData) {
    $columnPrecision = columnPrecisionData - 1;
    $dynamics = dynamicsOptions[graphPrecisionData - 1].value;
  }

  function updatePrecision(update) {
    const { columnPrecision: columnPrecisionData, graphPrecision: graphPrecisionData } = update.precision;
    updateOperationalPrecision(columnPrecisionData, graphPrecisionData);
  }

  function convertFinancialColumnPrecision() {
    return $columnPrecision - 1;
  }

  function convertOperationalColumnPrecision() {
    return Math.max($columnPrecision, Math.min($datePrecision + 1, 4)) + 1;
  }

  function convertColumnPrecision() {
    if (dashboard === 'financial') return convertFinancialColumnPrecision();
    return convertOperationalColumnPrecision();
  }

  function convertFinancialDatePrecision() {
    return $datePrecision - 1;
  }

  function convertOperationalDatePrecision() {
    return $datePrecision + 1;
  }

  function convertDatePrecision() {
    if (dashboard === 'financial') return convertFinancialDatePrecision();
    return convertOperationalDatePrecision();
  }

  function convertFinancialDynamics() {
    return dynamicsOptions.findIndex(dynamicsOption => dynamicsOption.value === $dynamics) + 1;
  }

  function convertOperationalDynamics() {
    const index = dynamicsOptions.findIndex(dynamicsOption => dynamicsOption.value === $dynamics);
    if ($datePrecision == 0 || $datePrecision == 1 || $datePrecision == 2)
      return index + 1;
    if ($datePrecision == 3 || $datePrecision == 4) {
      if (index < 3)
        return 3;
    }
    return index + 1;
  }

  function convertDynamics() {
    if (dashboard === 'financial') return convertFinancialDynamics();
    return convertOperationalDynamics();
  }

  function updateFilterKeyState(update, option) {
    if (option.picked) update.push(option.value);
    return update;
  }

  function updateFilterState(update, option) {
    return {
      ...update,
      [option.key]: option.data.reduce(updateFilterKeyState, []),
    };
  }

  function updateFiltersState() {
    const update = dashboardFilterData.reduce(updateFilterState, {});
    if (initial || noUpdate) updateFilter(update);
  }

  function hydrateDashboard(update) {
    console.log("UPDATE", update, indicator)
    if (update) saveUpdate(update);
    if (update.export) updateExportState(update.update);
    if (update.filter) updateFiltersState();
    updatePrecision(update);
    $kind = !indicator || indicator !== 'average-check-lfl' ? 0 : $kind;
    initial = false;
    noUpdate = false;
  }

  function dropData() {
    dashboardData = null;
  }

  function showLoader() {
    loading = true;
  }

  function hideLoader() {
    loading = false;
  }

  function startUpdating() {
    $updating += 1;
  }

  function stopUpdating() {
    $updating -= 1;
  }

  function zipOperationalOverview({ filter, precision, dates }, data) {
    return { dates, filter, precision, data };
  }

  function zipOperationalOverviewData(idIndicator, block1, block2, charts, formats, regions) {    
    const newData = {
      id: idIndicator,
      name: block1 ? block1.name : '',
      units: block1 ? block1.units : '',
      column1: block1 ? block1.block : {},
      column2: block2 ? block2.block : {},
      loaded: !!block1,
      allLoaded: !!block1 && !!charts,
      graphs: { 
        id: idIndicator,
        name: block1 ? block1.name : '',
        series: charts ? charts.series : [],
        loaded: !!charts
      },
      formatDeviations: {
        id: idIndicator,
        name: block1? block1.name : '',
        column1: formats ? formats.block1 : [],
        column2: formats ? formats.block2 : [],
        countDeviation: formats && formats.count ? formats.count.qNum : 0
      },
      regionDeviations: {
        id: idIndicator,
        name: block1? block1.name : '',
        column1: regions ? regions.block1 : [],
        column2: regions ? regions.block2 : [],
        countDeviation: regions && regions.count ? regions.count.qNum : 0
      }
    }
    return newData;
  }  

  async function renderDashboard(overview) {
    await hydrateDashboard(overview);
    await tick();
  }

  async function renderOperationalOverview(idIndicator, block1, block2, charts, formats, regions) {
    if (!dashboardData) 
      return;
    const item = zipOperationalOverviewData(idIndicator, block1, block2, charts, formats, regions);    
    const index = dashboardData.findIndex(item => item.id == idIndicator);
    if (index === -1) 
      dashboardData.push(item) 
    else 
      dashboardData[index] = item;
    const overview = zipOperationalOverview(dashboardMetaData, dashboardData);
    await renderDashboard(overview);
  }

  function zipOperationalSlicesData(indicator, slices, graphs) {   
    const [ block1, block2 ] = slices ? slices : [null, null];
    const [ format1, region1, group1 ] = block1 ? block1 : [null, null, null];
    const [ format2, region2, group2 ] = block2 ? block2 : [null, null, null];
    const [ regionGraphs, formatGraphs, groupGraphs ] = graphs ? graphs : [null, null, null]; 
    const formats = format1 ? (format1.items || []).map((item, index) => {
      return {
          name: item.name,
          column1: {...item},
          column2: format2 && format2.items ? {...format2.items[index]} : {},
          graphs: formatGraphs && formatGraphs.groups ? formatGraphs.groups[index] : null,
        }
    }) : [];
    const regions = region1 ? (region1.items || []).map((item, index) => {
      return {
          name: item.name,
          column1: {...item},
          column2: region2 && region1.items ? {...region2.items[index]} : {},
          graphs: regionGraphs && regionGraphs.groups ? regionGraphs.groups[index] : null,
        }
    }) : [];
    const groups = group1 ? (group1.items || []).map((item, index) => {
      return {
          name: item.name,
          column1: {...item},
          column2: group2 && group2.items ? {...group2.items[index]} : {},
          graphs: groupGraphs && groupGraphs.groups ? groupGraphs.groups[index] : null,
        }
    }) : []

    const newData = {
      loaded: !!slices,
      allLoaded: !!slices && !! graphs,
      units: indicator.units,      
      indicator: {...indicator},
      formats,
      regions,
      groups
    }

    return newData;
  }

  async function renderOperationalSlices(indicator, slices, graphs) {
    if (!dashboardData) 
      return;
    const data = zipOperationalSlicesData(indicator, slices, graphs);
    const overview = zipOperationalOverview(dashboardMetaData, data)
    await renderDashboard(overview);
  }

  function zipOperationalFactors(results, bridges) {
    const newData = {
      results: results,
      bridges: bridges
    }
    return newData;
  }

  async function renderOperationalFactors(results, bridges) {
    if (!dashboardData)
      return;
    const data = zipOperationalFactors(results, bridges);
    const overview = zipOperationalOverview(dashboardMetaData, data);
    await renderDashboard(overview);
  }

  async function renderMeta() {
    const filters = getFilters();
    const meta = await requestUpdate(dashboard, indicator, detail, filters, 'meta');    
    const FRMT = meta.filter.find(item => item.key === 'FRMT');
    if (FRMT)
      FRMT.data = sortFilterOptions(FRMT.data);
    console.log("RENDER META", meta);
    const overview = zipOperationalOverview(meta, []);
    await renderDashboard(overview);
  }

  function getFilters() {
    const dateValue = calculateDatesForValue(new Date($date), $datePrecision, 'date');
    const datePoPValue = calculateDatesForValue(new Date($datePoP), $datePrecision, 'datePoP');
    return {
      initial,
      noUpdate,
      conditions,
      date: dateValue,
      datePoP: datePoPValue,
      columnPrecision: convertColumnPrecision(),
      datePrecision: convertDatePrecision(),
      dynamics: convertDynamics(),
      kind: $kind
    };
  }

  async function fetchUpdateData() {
    if (!dashboardData) 
      return;    
    const filters = getFilters();
    const tasks = [];
    if (detail === 'factors') {
      tasks.push(
        executeRequest("factors", { dashboard, indicator, detail, filters, type: 'data' })
          .then(async (data) => {
            await renderOperationalFactors(data[0], data[1])
          })
      )
    } else if (indicator) {
      tasks.push(
        executeRequest("slices", { dashboard, indicator, detail, filters, type: 'data' })
          .then(async (data) => {
            if (data.length === 3) {
              const overviewData = zipOperationalOverviewData(indicator, data[0], data[1], data[2]);
              await renderOperationalSlices(overviewData);
              const slices = await executeRequest("slices", { dashboard, indicator, detail, filters, type: 'slices' });
              await renderOperationalSlices(overviewData, slices[0]);
              const charts = await executeRequest("slices", { dashboard, indicator, detail, filters, type: 'charts' });
              await renderOperationalSlices(overviewData, slices[0], charts[0]);
            }
          })
      )
    } else {
      const indicators = $activeIndicators.filter(id => dashboardData.findIndex(item => item.id == id) === -1)
      for (let i = 0; i < indicators.length; ++i) {
        const idIndicator = indicators[i];
        await renderOperationalOverview(idIndicator)    
        tasks.push(
          executeRequest("overview", { dashboard, indicator, detail, filters, type: 'data', idIndicator })
            .then(async (data) => {
              await renderOperationalOverview(idIndicator, data[0], data[1]);
              const charts = await executeRequest("overview", { dashboard, indicator, detail, filters, type: 'charts', idIndicator });
              await renderOperationalOverview(idIndicator, data[0], data[1], charts[0]);
            })
        )
      }
    }
    startUpdating();
    await Promise.all(tasks);
    stopUpdating();
  }
    
  async function updateData() {   
    try { 
      if (!fetchingData) {
        fetchingData = true;
        startUpdating();
        showLoader();
        dropData();
        if (initial)
          await renderMeta(); // fetch params
        await renderMeta(); // update params
        hideLoader();
        await fetchUpdateData();
        stopUpdating();
        fetchingData = false;
      }
    } catch (e) {
      console.log("ERROR", e);
      reloadNeeded = true;
    }
  }

  async function updateDataTemplate() {
    if ($templateUpdate && $templateUpdate > 0) {
      noUpdate = true;
      await updateData();
    }
  }

  onDestroy(unsubscribe);
</script>

<Filter
  disabled={$updating > 0 || $downloading > 0}
  data={dashboardFilterData} />
{#if loading}
  <Loader
    shift="-69" />
{/if}
{#if shouldRenderContent(dashboardData, indicator)}
  {#if !indicator}
    <Indicators />
  {/if}
  <DashboardContent
    data={dashboardData}
    filterData={dashboardFilterData}
    units={$units}
    {dashboard}
    {indicator}
    {detail}
    {conditions} />  
{/if}
{#if reloadNeeded}
  <Reload />
{/if}
