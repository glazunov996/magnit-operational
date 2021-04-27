<script>
  import { getDashboardState } from 'state/dashboard';
  import FactorColumn from './FactorColumn.svelte';
  import FactorDiagram from './FactorDiagram.svelte';
  import FactorValue from './FactorValue.svelte';
  import formatLabel from 'utilities/formatLabel'

  export let data;
  export let graph;
  export let indicator;

</script>

<div
  class="txcm-factorCell">
  <FactorColumn>
      <FactorValue
        data={formatLabel(data.vsFactPercent.qNum, data.vsFactPercent.units)} />
      <FactorDiagram
        graph={graph.vsFactPercent}
        data={data.vsFactPercent.qNum} />
    </FactorColumn>
    {#if indicator.id === '20'}
      <FactorColumn>
        <FactorValue
          data={formatLabel(data.vsBudgetPercent.qNum, data.vsBudgetPercent.units)}/>
        <FactorDiagram
          graph={graph.vsBudgetPercent}
          data={data.vsBudgetPercent.qNum} />
      </FactorColumn>  
    {/if}      
</div>
