<script>
  import { getContext } from 'svelte';
  import { filterIndicatorCategories } from 'utilities/listFilter';
  import { getDashboardState } from 'state/dashboard';
  import Int from 'components/core/internationalization/Int.svelte';
  import Dropdown from 'components/core/dropdown/Dropdown.svelte';
  import ColumnOption from './ColumnOption.svelte';

  const config = getContext('config').getColumnConfig();
  const date = getDashboardState('date');
  const columnPrecision = getDashboardState('columnPrecision');
  const datePrecision = getDashboardState('datePrecision');

  let selected = $columnPrecision;
  let filter = '';
  let isActive = false;

  $: updateColumnPrecision(selected);
  $: filtered = filterIndicatorCategories(config, filter);
  $: label = renderLabel($date, $columnPrecision);

  function updateColumnPrecision() {
    $columnPrecision = selected;
  }

  function renderLabel() {
    if ($columnPrecision === 0) return 'DTD';
    if ($columnPrecision === 1) return 'WTD';
    if ($columnPrecision === 2) return 'MTD';
    if ($columnPrecision === 3) return 'QTD';
    return 'YTD';
  }

  function toggle() {
    isActive = !isActive;
  }

  function hide() {
    isActive = false;
  }

  function onDropdownClose() {
    hide();
  }

  function onToggleClick() {
    toggle();
  }
</script>

<div
  class="txcm-columnOptionPicker">
    <button
      class="txcm-columnOptionPickerToggle"
      on:click|stopPropagation={onToggleClick}>
        <svg
          class="txcm-columnOptionPickerToggleIcon">
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
            {#each filtered as group, index}              
              {#each group.indicators as indicator (indicator.value)}
                {#if indicator.value > $datePrecision || indicator.value == 4}
                  <ColumnOption
                    label={indicator.label}
                    value={indicator.value}
                    bind:selected />
                {/if}
              {/each}
            {/each}
      </div>
    </Dropdown>
</div>

