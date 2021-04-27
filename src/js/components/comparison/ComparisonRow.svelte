<script context="module">
  const BASE_HEIGHT = 110;
  const DEVIATION_HEIGHT = 32;

  function calculateHeight(data) {
    let height = BASE_HEIGHT;
    height += data.formatDeviations ? DEVIATION_HEIGHT : 0;
    height += data.regionDeviations ? DEVIATION_HEIGHT : 0;
    return height;
  }
</script>

<script>
  import { shiftVertical } from 'utilities/transitions';
  import ComparisonLabel from './ComparisonLabel.svelte';
  import ComparisonCell from './ComparisonCell.svelte';
  import ComparisonGraph from './ComparisonGraph.svelte';
  import ComparisonDeviations from './ComparisonDeviations.svelte';

  export let data;
  export let units = 0;

  $: height = calculateHeight(data);
  $: hasDeviations = data.regionDeviations || data.formatDeviation;
  $: hasGraph = data.graph;
</script>

<div
  class="txcm-comparisonRow"
  class:txcm-comparisonRow-has-deviations={hasDeviations}
  class:txcm-comparisonRow-has-graph={hasGraph}
  transition:shiftVertical|local={{ height }}>
    <ComparisonLabel
      {data} />
    <ComparisonCell
      {units}
      data={data.column1} />
    <ComparisonCell
      {units}
      data={data.column2} />
    {#if hasGraph}
      <ComparisonGraph
        data={data.graph} />
    {/if}
    <ComparisonDeviations
      {data} />
</div>
