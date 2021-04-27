<script>
  import { getContext } from 'svelte';
  import { sectionScroll } from 'utilities/sectionScroll';
  import HeaderFilter from 'components/header/HeaderFilter.svelte';
  import FilterGroup from './FilterGroup.svelte';
  import FilterReset from './FilterReset.svelte';

  export let data;
  export let disabled;

  const context = getContext('config');
  const config = context.getFilterConfig();
  const dashboard = context.getDashboard();

  $: normaizedData = normalizeData(data);

  function normalizeData() {
    return data;
  }
</script>

<div
  use:sectionScroll
  class="txcm-filter">
    <HeaderFilter
      {dashboard}
      variant="filter" />
    {#each config as group, index (index)}
      <FilterGroup
        {group}
        {disabled}
        options={normaizedData} />
    {/each}
    <FilterReset
      {config}
      {disabled} />
</div>
