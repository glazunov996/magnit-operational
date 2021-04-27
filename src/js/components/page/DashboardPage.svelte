<script>
  import { initDashboard } from 'state/dashboard';
  import { initExport } from 'state/export';
  import DashboardFinancial from 'components/dashboard/financial/DashboardFinancial.svelte';
  import DashboardOperational from 'components/dashboard/operational/DashboardOperational.svelte';
  import Header from 'components/header/Header.svelte';
  import Menu from 'components/menu/Menu.svelte';
  import Title from 'components/title/Title.svelte';
  import Tooltip from 'components/tooltip/Tooltip.svelte';
  import AsideMenu from 'components/aside/AsideMenu.svelte';
  import Scroll from 'components/scroll/Scroll.svelte';
  import Confirmation from 'components/confirmation/Confirmation.svelte';
  import {location} from 'svelte-spa-router'

  const DASHBOARDS = {
    financial: DashboardFinancial,
    operational: DashboardOperational,
  };

  export let params = {};

  $: dashboard = params.dashboard;
  $: [ indicator, detail ] = params.wild ? params.wild.split('/') : [null, null];

  initExport();
  initDashboard(params.dashboard);

  function pickDashboard(key) {
    return DASHBOARDS.operational;
  }
</script>

<Header
  {dashboard}
  {indicator} />
<Menu />
<AsideMenu />
<svelte:component
  options={{ dashboard, indicator, detail, location }}
  this={pickDashboard(dashboard)} />
<Tooltip />
<Confirmation />
<Title
  {dashboard}
  {indicator}
  {detail} />
<Scroll />
