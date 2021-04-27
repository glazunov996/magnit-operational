<script context="module">
  /* eslint  unicorn/filename-case: 'off' */

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
  import KPILabel from './KPILabel.svelte';
  import KPICell from './KPICell.svelte';
  import KPIDeviations from './KPIDeviations.svelte';
  import KPIGraph from './KPIGraph.svelte';

  export let data;
  export let indicator;

  let isInverted = false;

  $: height = calculateHeight(data);
  $: hasGraph = !!data.graphs;
  $: checkInverted(data);

  function hasDeviations() {
    return (data.regionDeviations && data.regionDeviations.countDeviation > 0) || (data.formatDeviation && data.formatDeviation.countDeviation > 0);
  }

  function checkInverted() {    
    const arrow = data.column1.arrow ? data.column1.arrow.qNum : 0;
    isInverted = arrow === 2 || arrow === 3
  }

</script>

<div
  class="txcm-kpiRow"
  class:txcm-kpiRow-has-deviations={hasDeviations(data)}
  class:txcm-kpiRow-has-graph={hasGraph}
  class:txcm-kpiRow-loaded={data.allLoaded}
  transition:shiftVertical|local={{ height }}>
    <KPILabel
      {data}
      {indicator} />
    {#if data }
      <KPICell
        units={data.units}
        data={data.column1} 
        indicator={indicator}
        loaded={data.loaded}
        />
      <KPICell
        units={data.units}
        data={data.column2}
        indicator={indicator}
        loaded={data.loaded}
        />
      {#if hasGraph}
        <KPIGraph
          {indicator}
          {isInverted}
          units={data.units}
          data={data.graphs} />
      {/if}
      <KPIDeviations
        {indicator}
        {data} />
    {/if}
</div>
