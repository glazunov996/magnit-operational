<script>
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
  import BarChart from 'components/barChart/BarChart.svelte';

  export let data;
  export let indicator;
  export let isInverted;

  const date = getDashboardState('date');
  const dynamics = getGraphsState('dynamics');
  const step = getGraphsState('step');
  const count = getGraphsState('count');
  const highlighted = getGraphsState('highlighted');
  const shift = getGraphsState('shift');

  let fragment;

  $: updateFragments(data);

  function fillData(data) {
    if (!data) return [];
    if ($dynamics === 'graphDetailDay') return fillDayData(data, $date);
    if ($dynamics === 'graphDetailWeek') return fillWeekData(data, $date);
    if ($dynamics === 'graphDetailMonth') return fillMonthData(data, $date);
    if ($dynamics === 'graphDetailQuarter') return fillQuaterData(data, $date);
    if ($dynamics === 'graphDetailYear') return fillYearData(data, $date);
    return data;
  }

  function filterData(data) {
    if (!data) return [];
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
    fragment = fillData(fragment)
  }
</script>

<div
  class="txcm-sliceGraph"
  style="--highlightWidth: {100 / $count}%; --highlightPosition: {100 * $highlighted}%; --highlightOpacity: {$highlighted === null ? 0 : 1}; --highlightShift: {$shift}px">
    <div
      class="txcm-sliceGraphHolder">
        <BarChart
          {isInverted}
          {indicator}
          data={fragment}
          count={$count}
          step={$step}
          shift={$shift} />
    </div>
</div>
