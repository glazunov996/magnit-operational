<script>
  /* eslint  unicorn/filename-case: 'off' */

  import { getDashboardState } from 'state/dashboard';
  import { getGraphsState } from 'state/graphs';
  import { calculateDatePoP } from 'utilities/date'
  import { 
    filterDayData,
    filterWeekData,
    filterMonthData,
    filterQuarterData,
    filterYearData,
    fillDayData, 
    fillWeekData, 
    fillMonthData, 
    fillQuaterData, 
    fillYearData 
  } from 'utilities/graph';
  import LineGraph from 'components/lineGraph/LineGraph.svelte';
  import BarChart from 'components/barChart/BarChart.svelte';
  import ComboBarGraph from 'components/comboBarGraph/ComboBarGraph.svelte';
  import ComboBarShowLabel from 'components/comboBarGraph/ComboBarShowLabel.svelte';
  import ComboBarGraphExt from 'components/comboBarGraphExt/ComboBarGraphExt.svelte';

  export let data;
  export let indicator;
  export let units;
  export let isInverted;

  const date = getDashboardState('date');
  const dynamics = getGraphsState('dynamics');
  const kind = getGraphsState('kind');
  const step = getGraphsState('step');
  const count = getGraphsState('count');
  const highlighted = getGraphsState('highlighted');
  const shift = getGraphsState('shift');
  
  let fragment;
  let isExpanded;
  let hasDeviations;
  let extended = false;

  $: updateFragments(data);

  function checkDeviation(point, index) {
    return (point.data !== null && !isNaN(point.data));
  }

  function checkDeviations() {
    return (fragment[2] && fragment[2].data.some(checkDeviation)) || (fragment[4] && fragment[4].data.some(checkDeviation));
  }

  function fillData(data) {
    if (!data || !data.length) return [];
    if ($dynamics === 'graphDetailDay' || $dynamics === 'graphDetailAvgCheck') return fillDayData(data, $date);
    if ($dynamics === 'graphDetailWeek') return fillWeekData(data, $date);
    if ($dynamics === 'graphDetailMonth') return fillMonthData(data, $date);
    if ($dynamics === 'graphDetailQuarter') return fillQuaterData(data, $date);
    if ($dynamics === 'graphDetailYear') return fillYearData(data, $date);
    return data;
  }

  function filterData(data) {
    if (!data || !data.length) return [];
    const datePoP = calculateDatePoP($date, $dynamics);
    if ($dynamics === 'graphDetailDay' || $dynamics === 'graphDetailAvgCheck') return filterDayData(data, $date, datePoP);
    if ($dynamics === 'graphDetailWeek') return filterWeekData(data, $date, datePoP);
    if ($dynamics === 'graphDetailMonth') return filterMonthData(data, $date, datePoP);
    if ($dynamics === 'graphDetailQuarter') return filterQuarterData(data, $date, datePoP);
    if ($dynamics === 'graphDetailYear') return filterYearData(data, $date);
    return data;
  }

  function updateFragments() {
    fragment = filterData(data.series);
    fragment = fillData(fragment);
    hasDeviations = checkDeviations();
  }
</script>

<div
  class="txcm-kpiGraph"
  style="--highlightWidth: {100 / $count}%; --highlightPosition: {100 * $highlighted}%; --highlightOpacity: {$highlighted === null ? 0 : 1}; --highlightShift: {$shift}px">
    <div
      class="txcm-kpiGraphHolder"
      class:txcm-kpiGraphHolder-is-expanded={isExpanded}>
        {#if $kind === 0}
          <LineGraph
            {units}
            {indicator}
            data={fragment}
            count={$count}
            step={$step}
            shift={$shift}
            isCompact={hasDeviations} />
          {#if hasDeviations}
            <BarChart
              {indicator}
              {isInverted}
              data={fragment}
              count={$count}
              step={$step} 
              shift={$shift}
              />
          {/if}
        {/if} 
        {#if $kind === 1}
          {#if !extended}
            <ComboBarGraph 
              {units}
              {indicator}
              data={fragment}
              count={$count}
              step={$step}
              shift={$shift}
            />
            <ComboBarShowLabel 
              extend={false} 
              bind:extended
            />
          {:else}
            <ComboBarGraphExt 
              {units}
              {indicator}
              data={fragment}
              count={$count}
              step={$step}
              shift={$shift}
            >
              <ComboBarShowLabel 
                extend={true} 
                bind:extended 
              />
            </ComboBarGraphExt>
          {/if}
        {/if}
    </div>    
</div>
