<script>
  import ListGroup from 'components/list/ListGroup.svelte';
  import { filterIndicatorCategories } from 'utilities/listFilter';
  import IndicatorsControl from './IndicatorsControl.svelte';

  export let config;
  export let filter;

  $: filtered = filterIndicatorCategories(config, filter);
</script>

{#each filtered as group}
  <ListGroup
    label={group.label}
    count={filtered.length}
    length={group.length}
    {filter}>
      {#each group.indicators as indicator (indicator.id)}
        <IndicatorsControl
          id={indicator.id}
          label={indicator.label}
          note={indicator.note}
          status={indicator.status}
          value={indicator.value}
          exclude={false} />
      {/each}
  </ListGroup>
{/each}
