<script>
  import Int from 'components/core/internationalization/Int.svelte';
  import NavLink from 'components/core/navLink/NavLink.svelte';
  import { default as indicators } from 'configs/dashboards/operational/indicators.json';

  const INDICATORS = indicators.reduce((result, group) => [...result, ...group.indicators], []);

  export let dashboard;
  export let indicator;

  $: indicatorId = findIndicator(indicator)

  function findIndicator(indicator) {
    const id = INDICATORS.find(option => option.url === indicator).id;
    return id
  }

</script>

<nav
  class="txcm-headerTabs">
    <NavLink
      linkClass="txcm-headerTab"
      to={`/dashboard/${dashboard}/${indicator}`}>
        <Int
          key="Срезы" />
    </NavLink>
    {#if indicatorId === '1' || indicatorId === '20'}
      <NavLink
        linkClass="txcm-headerTab"
        to={`/dashboard/${dashboard}/${indicator}/factors`}>
          <Int
            key="Факторы" />
      </NavLink>
    {/if}
</nav>
