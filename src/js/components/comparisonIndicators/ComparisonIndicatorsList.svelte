<script>
  import ListGroup from 'components/list/ListGroup.svelte';
  import { filterComparisonIndicators } from 'utilities/listFilter';
  import ComparisonIndicatorsControl from './ComparisonIndicatorsControl.svelte';

  export let config;
  export let filter;

  $: filtered = filterComparisonIndicators(config, filter);
</script>

<ListGroup
  count={1}
  length={filtered.length}
  fixed={true}
  {filter}>
    {#each filtered as indicator (indicator.id)}
      <ComparisonIndicatorsControl
        id={indicator.id}
        label={indicator.label}
        value={indicator.id}
        exclude={true} />
    {/each}
</ListGroup>
