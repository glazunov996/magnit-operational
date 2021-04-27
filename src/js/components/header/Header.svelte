<script>
  import HeaderDashboardToggle from './HeaderDashboardToggle.svelte';
  import HeaderTabs from './HeaderTabs.svelte';
  import HeaderFilter from './HeaderFilter.svelte';
  import HeaderNavigation from './HeaderNavigation.svelte';
  import { getUIState } from 'state/ui';

  const updating = getUIState('updating');

  export let dashboard;
  export let indicator;

  $: isTabsActive = !!indicator && indicator !== 'export' && $updating <= 0;
</script>

<header
  class="txcm-header">
    {#if isTabsActive}
      <HeaderTabs
        {dashboard}
        {indicator} />
    {/if}
    <HeaderDashboardToggle
      {dashboard}
      {indicator} />
    <HeaderFilter
      variant="header"
      {dashboard} />
    <HeaderNavigation
      {dashboard}
      {indicator} />
</header>
