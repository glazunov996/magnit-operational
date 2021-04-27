<script>
  import { getActiveComparisonIndicatorsState } from 'state/comparisonIndicators';
  import ComparisonRow from 'components/comparison/ComparisonRow.svelte';

  export let data;

  const activeComparisonIndicators = getActiveComparisonIndicatorsState();

  let active = [];

  $: updateActive($activeComparisonIndicators, data);

  function findActiveComparisonIndicator(option) {
    return $activeComparisonIndicators.find(id => `${option.id}` === `${id}`);
  }

  function updateActive() {
    if (data) active = data.filter(findActiveComparisonIndicator);
  }
</script>

{#each active as activeComparisonIndicator (activeComparisonIndicator.id)}
  <ComparisonRow
    data={activeComparisonIndicator} />
{/each}
