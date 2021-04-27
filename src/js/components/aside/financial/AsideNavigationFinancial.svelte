<script>
  import { getContext } from 'svelte';
  import Int from 'components/core/internationalization/Int.svelte';
  import NavLink from 'components/core/navLink/NavLink.svelte';
  import AsideGroup from 'components/aside/AsideGroup.svelte';

  export let filter;

  const { indicators: config } = getContext('app').getAppConfig().dashboards.financial;
</script>

<div
  class="txcm-asideNavGroup">
    <NavLink
      linkClass="txcm-asideNavLink"
      to="/dashboard/financial">
        <Int
          key="Финансовый дашборд" />
        <svg
          class="txcm-asideNavLinkIcon">
            <use
              xlink:href="#txspt-icons-checkmark" />
        </svg>
    </NavLink>
    <AsideGroup
      dashboard="financial"
      categories={config}
      {filter} />
</div>
