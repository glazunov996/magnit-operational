<script>
  import { getContext } from 'svelte';
  import Int from 'components/core/internationalization/Int.svelte';
  import NavLink from 'components/core/navLink/NavLink.svelte';
  import { renderURL } from 'utilities/render';
  import DeviationCount from './DeviationCount.svelte';

  export let data;
  export let multiple;
  export let indicator = null;
  export let tab = null;

  const dashboard = getContext('config').getDashboard();

  $: label = renderLabel(data);

  function renderLabel() {
    return `Отклонения по ${multiple}`;
  }

  function renderDeviationURL() {
    return `${renderURL(dashboard, indicator.url)}#${tab}`;
  }
</script>

{#if indicator}
<div
  class="txcm-deviationLabel">
    <NavLink
      to={renderDeviationURL()}
      linkClass="txcm-deviationLabelLink">
        <DeviationCount
          value={data.countDeviation} />
          <Int
            key={label} />
    </NavLink>
</div>
{:else}
  <div
    class="txcm-deviationLabel">
      <DeviationCount
        value={data.countDeviation} />
        <Int
          key={label} />
  </div>
{/if}
