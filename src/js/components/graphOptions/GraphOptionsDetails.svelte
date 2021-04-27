<script>
  import { getContext } from 'svelte';
  import { getGraphsState } from 'state/graphs';
  import { getDashboardState } from 'state/dashboard';
  import Int from 'components/core/internationalization/Int.svelte';
  import Dropdown from 'components/core/dropdown/Dropdown.svelte';
  import GraphOptionsDetail from './GraphOptionsDetail.svelte';
  import { getUIState } from 'state/ui';

  export let indicator;

  const { graphs: graphConfig } = getContext('app').getAppConfig();
  const dashboard = getContext('config').getDashboard();
  const mode = getGraphsState('mode');
  const dynamics = getGraphsState('dynamics');
  const sliceLabels = flattenSliceLabels();
  const dynamicsLabels = flattenDynamicsLabels();
  const dynamicsOptions = updateDynamicOptions(dashboard, indicator);
  const updating = getUIState('updating');
  const datePrecision = getDashboardState('datePrecision');

  let selected = $dynamics;
  let isActive = false;

  $: $dynamics = selected;
  $: label = renderLabel($mode, $dynamics);
  $: disabled = $updating > 0;

  function isDynamicsMode() {
    return $mode === 'graphModeDynamics';
  }

  function updateDynamicOptions() {   
    const dynamics = graphConfig.dynamics.slice() 
    if (dashboard === 'financial') return dynamics.slice(2);
    return dynamics;
  }

  function fattenDynamicsLabel(result, option) {
    return {
      ...result,
      [option.value]: option.subLabel,
    };
  }

  function flattenDynamicsLabels() {
    return graphConfig.dynamics.reduce(fattenDynamicsLabel, {});
  }

  function fattenSliceLabel(result, option) {
    if (!option.subLabel) return result;
    return {
      ...result,
      [option.value]: option.subLabel,
    };
  }

  function flattenSliceLabels() {
    return graphConfig.modes.reduce(fattenSliceLabel, {});
  }

  function renderLabel() {
    if (isDynamicsMode()) return dynamicsLabels[$dynamics];
    return sliceLabels[$mode];
  }

  function toggle() {
    isActive = !isActive;
  }

  function hide() {
    isActive = false;
  }

  function onToggleClick() {
    toggle()
  }

  function onDropdownClose() {
    hide();
  }

</script>

<div
  class="txcm-graphDetailPicker">
    {#if isDynamicsMode($mode)}
      <button
        {disabled}
        class="txcm-graphDetailPickerToggle"
        on:click|stopPropagation={onToggleClick}>
          <svg
            class="txcm-graphDetailPickerToggleIcon">
              <use
                xlink:href="#txspt-icons-fatArrow" />
          </svg>
          <Int
            key={label} />
      </button>
      <Dropdown
        {isActive}
        on:dropdownclose={onDropdownClose}>
          <div
            class="txcm-graphDetailOptions"
            class:txcm-graphDetailOptions-is-active={isActive}
            on:click|stopPropagation>
              <Int
                key="Грануляция" />
              {#each dynamicsOptions as option, index}
                {#if $datePrecision < 3 || ($datePrecision >= 3 && index >= 2)}
                  <GraphOptionsDetail
                    value={option.value}
                    label={option.label}
                    subLabel={option.subLabel}
                    bind:selected />
                  {/if}
              {/each}
          </div>
      </Dropdown>
    {:else}
      <Int
        key={label} />
    {/if}
</div>
