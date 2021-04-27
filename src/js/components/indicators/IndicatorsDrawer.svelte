<script>
  import { getContext } from 'svelte';
  import Int from 'components/core/internationalization/Int.svelte';
  import ListFilter from 'components/list/ListFilter.svelte';
  import IndicatorsActiveList from './IndicatorsActiveList.svelte';
  import IndicatorsList from './IndicatorsList.svelte';

  const config = getContext('config').getIndicatorsConfig();

  let filter = '';
</script>

<div
  class="txcm-indicatorsHeader">
    <Int
      key="Добавить показатели" />
</div>
<ListFilter
  bind:value={filter} />
<div class="txcm-indicatorsGroups">
  <IndicatorsList
    {config}
    {filter} />
</div>
