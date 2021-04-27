<script>
import { getContext } from 'svelte';
  import { getGraphsState } from 'state/graphs';
  import Int from 'components/core/internationalization/Int.svelte';
  import Dropdown from 'components/core/dropdown/Dropdown.svelte';
  import GraphOptionsDetail from './GraphOptionsDetail.svelte';
  import { getUIState } from 'state/ui';
  import GraphKindOptionsDetail from './GraphKindOptionsDetail.svelte';

  export let indicator;

  const { graphs: graphConfig } = getContext('app').getAppConfig();
  const dashboard = getContext('config').getDashboard();
  const kind = getGraphsState('kind');
  const updating = getUIState('updating');
 
  let selected = $kind;
  let isActive = false;

  let kinds = ['Дин.'] // [ 'Дин.', 'Стр.']

  $: $kind = selected;
  $: label = renderLabel($kind);
  $: disabled = $updating > 0;

  function renderLabel() {    
    return kinds[$kind];
  }

  function toggle() {
    isActive = !isActive;
  }

  function hide() {
    isActive = false;
  }

  function onToggleClick() {
    toggle();
  }

  function onDropdownClose() {
    hide();
  }
</script>

<div class="txcm-graphDetailPicker">
  <button
    {disabled}
    class="txcm-graphDetailPickerToggle"
    on:click|stopPropagation={onToggleClick}>
      <svg
        class="txcm-graphDetailPickerToggleIcon">
          <use
            xlink:href="#txspt-icons-fatArrow" />
      </svg>
      <div class="txcm-tableHeaderCellLabel"
        class:txcm-tableHeaderCellLabel-is-kind={true}
      >
        <Int
          key={label} />
      </div>      
  </button>
  <Dropdown
    {isActive}
    on:dropdownclose={onDropdownClose}>
      <div
        class="txcm-graphDetailOptions"
        class:txcm-graphDetailOptions-is-active={isActive}
        on:click|stopPropagation>          
          {#each kinds as option, index}
            <GraphKindOptionsDetail
              value={index}
              label={option}
              bind:selected />
          {/each}
      </div>
  </Dropdown>
</div>