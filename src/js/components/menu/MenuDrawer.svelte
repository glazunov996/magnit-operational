<script>
  import { onMount } from 'svelte';
  import { getUIState } from 'state/ui';
  import Int from 'components/core/internationalization/Int.svelte';
  import Overlay from 'components/core/overlay/Overlay.svelte';
  import Templates from 'components/templates/Templates.svelte';
  import MenuLanguage from './MenuLanguage.svelte';
  import MenuNavigation from './MenuNavigation.svelte';
  import MenuDashboardNavigation from './MenuDashboardNavigation.svelte';

  const menu = getUIState('menu');
  const templateUpdate = getUIState('templateUpdate');

  let isMounted = false;

  $: isActive = $menu;
  $: if (isMounted && $templateUpdate) setTimeout(close, 5);

  onMount(() => isMounted = true)

  function close() {
    $menu = false;
  }

  function onCloseClick() {
    close();
  }

  function onOverayClose() {
    close();
  }
</script>

<Overlay
  {isActive}
  on:overlayclose={onOverayClose}>
    <div
      class="txcm-menuDrawer"
      class:txcm-menuDrawer-is-active={isActive}
      on:click|stopPropagation>
        <svg
          class="txcm-menuLogo">
            <use
              xlink:href="#txspt-icons-logo" />
        </svg>
        <MenuLanguage />
        <MenuNavigation />
        <Templates />
        <MenuDashboardNavigation />
        <button
          class="txcm-drawerClose"
          on:click={onCloseClick}>
            <Int
              key="Закрыть" />
        </button>
    </div>
</Overlay>
