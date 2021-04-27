<script>
  import Int from 'components/core/internationalization/Int.svelte';
  import ListFilter from 'components/list/ListFilter.svelte';
  import AsideNavigationOperational from 'components/aside/operational/AsideNavigationOperational.svelte';

  let filter = '';
</script>

<nav
  class="txcm-asideNavigation">
    <div
      class="txcm-asideNavigationHeader">
        <Int
          key="Перейти в показатель" />
    </div>
    <ListFilter
      bind:value={filter} />
    <div
      class="txcm-asideNavigationGroups">
        <AsideNavigationOperational
          {filter} />
    </div>
</nav>
