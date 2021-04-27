<script>
  import { getDashboardState } from 'state/dashboard';
  import FactorCell from 'components/factor/FactorCell.svelte';
  import FactorLabel from 'components/factor/FactorLabel.svelte';
  import FactorRow from 'components/factor/FactorRow.svelte';

  export let bridge;
  export let graph;
  export let indicator;

</script>

<FactorRow>
  <FactorLabel
    label={bridge.name} />  
  <FactorCell
    graph={graph.column1}
    data={bridge.column1} 
    {indicator}
    />
  <FactorCell
    graph={graph.column2}
    data={bridge.column2} 
    {indicator}
    />
</FactorRow>
