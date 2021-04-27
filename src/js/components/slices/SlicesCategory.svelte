<script>
  import Int from 'components/core/internationalization/Int.svelte';
  import SlicesTabs from './SlicesTabs.svelte';
  import SlicesTable from './SlicesTable.svelte';

  export let data;
  export let label;
  export let key;
  export let tab;
  export let units;
  export let indicator;
  export let isInverted;

  export let hasDeviations;
  export let hasData;

  let isActive = !tab ? true : key === tab;
  let showDeviations = key === tab;

  $: filteredData = filterData(data, showDeviations);
  $: checkDeviations(data, units);

  function checkFieldDeviations(field) {
    return [
      'factVsBudgetPercent',
      'factVsPpPercent',
    ].some(optionKey => field[optionKey] && field[optionKey].qNum < 0);
  }

  function checkOptionDeviations(option) {
    return [
      'column1',
      'column2',
    ].some(optionKey => checkFieldDeviations(option[optionKey]));
  }

  function checkDeviations() {
    hasDeviations = data.some(checkOptionDeviations);
  }

  function toggle() {
    isActive = !isActive;
  }

  function onTabsAll() {
    showDeviations = false;
    isActive = true;
  }

  function onTabsDeviations() {
    showDeviations = true;
    isActive = true;
  }

  function onToggleClick() {
    toggle();
  }

  function filterData() {
    if (!showDeviations) return data;
    return data.filter(checkOptionDeviations);
  }
</script>

<div
  class="txcm-slicesCategory">
    <div class="txcm-slicesCategoryControls">
      <button
        class="txcm-slicesToggle"
        class:txcm-slicesToggle-is-active={isActive}
        on:click={onToggleClick}>
          <svg
            class="txcm-slicesToggleIcon"
            class:txcm-slicesToggleIcon-is-active={isActive}>
              <use
                xlink:href="#txspt-icons-angleArrow" />
          </svg>
          <Int
            key={label} />
      </button>
      {#if hasDeviations}
        <SlicesTabs
          {isActive}
          {showDeviations}
          on:tabsall={onTabsAll}
          on:tabsdeviations={onTabsDeviations} />
      {/if}
    </div>
    {#if isActive}
      <SlicesTable
        bind:hasData
        {isInverted}
        {indicator}
        {units}
        data={filteredData} />
    {/if}
</div>
