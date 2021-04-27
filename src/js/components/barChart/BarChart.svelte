<script>
  import BarChartComparison from './BarChartComparison.svelte';
  import { getGraphsState } from 'state/graphs';
  import { renderMonthShort } from 'utilities/date';

  const dynamics = getGraphsState('dynamics');

  export let data;
  export let count;
  export let step;
  export let indicator;
  export let isInverted;

  let min;
  let max;
  let points;
  let fragment;

  $: updatePoints(data, indicator);
  $: updateCharts(points, step, count);
  $: calculateLimits(data);

  function calculateLimits() {
    const indexes = [4, 2];
    if (!isInverted) {
      const valuesLeft = data[indexes[1]] ? data[indexes[1]].data.map(item => item.data < 0 ? item.data : 0) : [0];
      const valuesRight = data[indexes[0]] ? data[indexes[0]].data.map(item => item.data < 0 ? item.data : 0) : [0];
      min = Math.min(...valuesLeft, ...valuesRight) * 10000;
    } else {
      const valuesLeft = data[indexes[1]] ? data[indexes[1]].data.map(item => item.data > 0 ? item.data : 0) : [0];
      const valuesRight = data[indexes[0]] ? data[indexes[0]].data.map(item => item.data > 0 ? item.data : 0) : [0];
      min = Math.max(...valuesLeft, ...valuesRight) * 10000;
    }
  }

  function zipPoints() {
    return data[0].data.reduce((result, point, index) => {
      result.push({
        tooltip: true,
        name: point.name,
        year: parseInt(point.name.slice(0, 4)),
        month: parseInt(point.name.slice(4, 6)),
        day: parseInt(point.name.slice(6, 8)),
        fact: point.text,          
        vsPp: data[1] ? (data[1].data[index].data !== 0 && data[1].data[index].data !== null ? data[1].data[index].text || '-' : '-') : '-',
        vsPpPercent: data[2] ? (data[2].data[index].data !== 0 && data[2].data[index].data !== null ? data[2].data[index].text || '-' : '-') : '-',
        vsBudget: data[3] ? (data[3].data[index].data !== 0 && data[3].data[index].data !== null ?  data[3].data[index].text || '-'  : '-') : '-',
        vsBudgetPercent: data[4] ? (data[4].data[index].data !== 0 && data[4].data[index].data !== null ?  data[4].data[index].text || '-'  : '-') : '-',
        left: data[2] ? (data[2].data[index].data !== null && !isNaN(data[2].data[index].data) ? (data[2].data[index].data * 10000) : null) : null,
        right: data[4] ? (data[4].data[index].data !== null && !isNaN(data[4].data[index].data) ? (data[4].data[index].data * 10000) : null) : null,
        deviations: data.length > 3 ? (
          data[0].data[index].data !== null
          && data[3].data[index].data !== null
          && data[3].data[index].data > data[0].data[index].data) : undefined,
      });
      return result;
    }, []);
  }

  function updateCharts() {
    fragment = points.slice(step, (step + count + 1));
  }

  function updatePoints() {
    points = zipPoints();
  }

  function checkScroll() {
    return data[0].data.length > count;
  }

  function checkLimit() {
    return step === data[0].data.length - count;
  }
</script>

<div
  class="txcm-barChart"
  class:txcm-barChart-is-scrollable={checkScroll(data, count)}
  class:txcm-barChart-is-atLimit={checkLimit(data, step, count)}>
    {#each fragment as point}
      <BarChartComparison
        {isInverted}
        {point}
        {min}
        {max} />
    {/each}
</div>
