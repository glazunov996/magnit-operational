<script>
  import { getActiveComparisonIndicatorsState } from 'state/comparisonIndicators';
  import ComparisonIndicatorsControl from './ComparisonIndicatorsControl.svelte';

  export let config;

  const activeComparisonIndicators = getActiveComparisonIndicatorsState();

  let active = [];

  $: updateActive($activeComparisonIndicators);
  $: isEmpty = active.length === 0;

  function findActiveIndicator(option) {
    return $activeComparisonIndicators.find(id => `${option.id}` === `${id}`);
  }

  function updateActive() {
    active = config.filter(findActiveIndicator);
  }
</script>

<div
  class="txcm-indicatorsActive"
  class:txcm-indicatorsActive-is-empty={isEmpty}>
    {#each active as indicator (indicator.id)}
      <ComparisonIndicatorsControl
        id={indicator.id}
        label={indicator.label}
        value={indicator.id} />
    {/each}
</div>
