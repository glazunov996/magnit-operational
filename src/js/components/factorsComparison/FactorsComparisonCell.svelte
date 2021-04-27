<script>
  import { compareDynamics } from 'utilities/indicator';
  import FactorsComparisonValue from './FactorsComparisonValue.svelte';
  import FactorsComparisonDiagram from './FactorsComparisonDiagram.svelte';
  import formatLabel from 'utilities/formatLabel'

  export let value;
  export let comparison;
  export let bridges;
  export let diagrams;
  export let baseRatios;
  export let minRatios;
  export let indicator;

</script>

<div
  class="txcm-factorsTotalCell">
    <FactorsComparisonValue
      dynamics={compareDynamics(value[0].qNum, comparison[0].qNum)}>
        {formatLabel(value[0].qNum , value[0].units)}
    </FactorsComparisonValue>
    {#if indicator.id === '20'}
      {#each diagrams as diagram, index}
        <FactorsComparisonDiagram
          value={index === 1 ? formatLabel(value[1].qNum, value[1].units) : null}
          dynamics={index === 1 ? compareDynamics(value[1].qNum, comparison[1].qNum) : null}
          data={diagrams[index]}
          bridge={bridges[index]} 
          baseRatio={baseRatios[index]}  
          minRatio={minRatios[index]}
        />
      {/each}
    {:else}
      <FactorsComparisonDiagram
        data={diagrams[0]}
        bridge={bridges[0]} 
        baseRatio={baseRatios[0]}  
        minRatio={minRatios[0]}
      />
    {/if}
</div>
