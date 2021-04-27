<script>
  import { getContext } from 'svelte';
  import Dashboard from 'components/dashboard/Dashboard.svelte';

  export let options;

  const { filter: filterConfig, indicators: indicatorsConfig, column: columnConfig } = getContext('app').getAppConfig().dashboards.financial;
</script>

<Dashboard
  {...options}
  {filterConfig}
  {indicatorsConfig}
  {columnConfig} />
