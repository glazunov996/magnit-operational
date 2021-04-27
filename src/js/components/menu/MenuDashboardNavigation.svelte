<script>
  import { getUIState } from 'state/ui';
  import Int from 'components/core/internationalization/Int.svelte';
  import AsideNavigation from 'components/aside/AsideNavigation.svelte';

  const dashNav = getUIState('menuDashNav');

  $: isActive = $dashNav;

  function onCloseClick() {
    $dashNav = false;
  }
</script>

<div
  class="txcm-menuDrawerDashboardNav"
  class:txcm-menuDrawerDashboardNav-is-active={isActive}>
    <AsideNavigation />
    <button
      class="txcm-drawerClose"
      on:click={onCloseClick}>
        <Int
          key="Закрыть" />
    </button>
</div>
