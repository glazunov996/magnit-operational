<script>
  import { getContext } from 'svelte';
  import ListFilter from 'components/list/ListFilter.svelte';
  import Int from 'components/core/internationalization/Int.svelte';
  import ComparisonIndicatorsActiveList from './ComparisonIndicatorsActiveList.svelte';
  import ComparisonIndicatorsList from './ComparisonIndicatorsList.svelte';

  const config = getContext('comparisonsConfig').getComparisonIndicatorsConfig();

  let filter = '';
</script>

<div
  class="txcm-indicatorsHeader">
    <Int
      key="Добавить показатели" />
</div>
<ListFilter
  bind:value={filter} />
<ComparisonIndicatorsActiveList
  {config} />
<ComparisonIndicatorsList
  {config}
  {filter} />
