<script>
  import Int from 'components/core/internationalization/Int.svelte';
  import NavLink from 'components/core/navLink/NavLink.svelte';
  import { getUIState, updateUI } from 'state/ui';

  const LABELS = {
    financial: 'Финансовый дашборд',
    operational: 'Операционный дашборд',
  };

  export let dashboard;
  export let indicator;

  const aside = getUIState('aside');

  $: label = renderLabel(dashboard, indicator);

  function renderLabel() {
    if (indicator && indicator === 'export') return 'Выгрузка данных';
    return LABELS[dashboard];
  }

  function show() {
    updateUI({ aside: true });
  }

  function onToggleClick() {
    if (!$aside) setTimeout(show, 5);
  }
</script>

<button
  class="txcm-dashboardToggle"
  on:click={onToggleClick}>
    <svg
      class="txcm-dashboardToggleIcon">
        <use
          xlink:href="#txspt-icons-drawer" />
    </svg>
    {#if !indicator || indicator === 'export'}
      <span
        class="txcm-dashboardToggleText">
          <Int
            key={label} />
      </span>
    {/if}
</button>
{#if indicator && indicator !== 'export'}
  <NavLink
    to={`/dashboard/${dashboard}`}
    linkClass="txcm-dashboardToggleLink">
      <Int
        key={label} />
  </NavLink>
{/if}
