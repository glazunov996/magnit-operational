<script>
  import { getContext } from 'svelte';
  import { getActiveIndicatorsState } from 'state/indicators';
  import { sectionScroll } from 'utilities/sectionScroll';
  import { filterIndicatorCategories } from 'utilities/listFilter';
  import KPIRow from 'components/kpi/KPIRow.svelte';
  import KPIGroup from 'components/kpi/KPIGroup.svelte';

  export let data;

  const config = getContext('config').getIndicatorsConfig();
  const indicators = Object.values(config).reduce(flattenCategories, {});
  const activeIndicators = getActiveIndicatorsState();

  let active = [];
  let filtered = []

  $: updateActive($activeIndicators, data);

  function flattenIndicators(results, indicator) {
    return {
      ...results,
      [indicator.id]: indicator,
    };
  }

  function flattenCategories(results, group) {
    return {
      ...results,
      ...group.indicators.reduce(flattenIndicators, {}),
    };
  }

  function findActiveIndicator(option) {
    return $activeIndicators.find(id => `${option.id}` === `${id}`);
  }

  function sortOrder(option1, option2) {
    const order1 = indicators[option1.id].order;
    const order2 = indicators[option2.id].order;
    return order1 - order2;
  }

  function updateActive() {
    if (data && data.length) {
      active = data
        .filter(findActiveIndicator)
        .sort(sortOrder);
      filtered = filterIndicatorCategories(config, '');
    }
  }

  function hasIndicators(group) {
    return group.indicators.some(item => {
      return active.some(item2 => item2.id == item.id)
    })
  }

</script>

<div
  class="txcm-overviewRows"
  use:sectionScroll={true}
>
  {#each filtered as group}
    <KPIGroup
      label={group.label}
      hasIndicators={hasIndicators(group)}
    >
      {#each group.indicators as indicator (indicator.id)}        
        {#each active as activeIndicator (activeIndicator.id)}
          {#if activeIndicator.id == indicator.id}
            <KPIRow
              indicator={indicators[activeIndicator.id]}
              data={activeIndicator} />
          {/if}
        {/each}
      {/each}
    </KPIGroup>
  {/each}
</div>
