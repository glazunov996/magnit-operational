<script>
  import { setContext } from 'svelte';
  import Router from 'svelte-spa-router'
  import { CONFIG } from 'utilities/config';
  import { getUIState } from 'state/ui';
  import Defs from 'components/defs/Defs.svelte';
  import DashboardPage from 'components/page/DashboardPage.svelte';
  import DefaultPage from 'components/page/DefaultPage.svelte';
  import InitializationPage from 'components/page/InitializationPage.svelte';

  const initialized = getUIState('initialized');

  const routes = {
    '/dashboard/:dashboard': DashboardPage,
    '/dashboard/:dashboard/*': DashboardPage,
    '*': DefaultPage,
  }

  setContext('app', {
    getAppConfig: () => CONFIG,
  });
</script>

<Defs />
{#if !$initialized}
  <InitializationPage />
{:else}
  <Router {routes}/>
{/if}
