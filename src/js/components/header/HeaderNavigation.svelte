<script>
  import NavLink from 'components/core/navLink/NavLink.svelte';
  import { getUIState } from 'state/ui';

  export let dashboard;
  export let indicator;

  const updating = getUIState('updating');

  function onBackClick() {
    history.back();
  }

  $: disabled = $updating > 0;

</script>

<nav
  class="txcm-navigation">
    {#if !disabled}
      <NavLink
        linkClass="txcm-navigationExportLink"
        to={`/dashboard/${dashboard}/export`}>
          <svg
            class="txcm-navigationExportIcon">
              <use
                xlink:href="#txspt-icons-export" />
          </svg>
      </NavLink>
    {/if}
    <button
      {disabled}
      class="txcm-navigationExportBack"
      class:txcm-navigationExportBack-is-active={indicator === 'export'}
      on:click={onBackClick}>
    </button>
</nav>
