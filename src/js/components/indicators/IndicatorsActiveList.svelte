<script>
  import { getActiveIndicatorsState } from 'state/indicators';
  import IndicatorsControl from './IndicatorsControl.svelte';

  export let config;

  const options = flattenOptions();
  const activeIndicators = getActiveIndicatorsState();

  let active = [];

  $: updateActive($activeIndicators);
  $: isEmpty = active.length === 0;

  function flattenOption(flat, group) {
    return [
      ...flat,
      ...group.indicators,
    ];
  }

  function sortOrder(option1, option2) {
    return option1.order - option2.order;
  }

  function flattenOptions() {
    return config
      .reduce(flattenOption, [])
      .sort(sortOrder);
  }

  function findActiveIndicator(option) {
    return $activeIndicators.find(id => `${option.id}` === `${id}`);
  }

  function updateActive() {
    active = options.filter(findActiveIndicator);
  }
</script>

<div
  class="txcm-indicatorsActive"
  class:txcm-indicatorsActive-is-empty={isEmpty}>
    {#each active as indicator (indicator.id)}
      <IndicatorsControl
        id={indicator.id}
        label={indicator.label}
        note={indicator.note}
        status={indicator.status}
        value={indicator.value} />
    {/each}
</div>
