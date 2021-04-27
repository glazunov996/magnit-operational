<script>
  import { getDashboardState } from 'state/dashboard';
  import FactorsTotalValue from './FactorsTotalValue.svelte';
  import FactorsTotalDiagram from './FactorsTotalDiagram.svelte';
  import formatLabel from 'utilities/formatLabel'

  export let value;
  export let diagrams;
  export let baseRatios;
  export let minRatios;

</script>

<div
  class="txcm-factorsTotalCell">
    <FactorsTotalValue>
      {formatLabel(value[0].qNum, value[0].units)}
    </FactorsTotalValue>
    {#each diagrams as diagram, index}
      <FactorsTotalDiagram
        value={index === 1 ? formatLabel(value[1].qNum, value[1].units) : null}
        data={diagrams[index]} 
        baseRatio={baseRatios[index]}  
        minRatio={minRatios[index]}
      />
    {/each}
</div>
