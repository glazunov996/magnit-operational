<script>
  import { getContext } from 'svelte';
  import { getGraphsState } from 'state/graphs';
  import { getDashboardState } from 'state/dashboard';
  import { shortenLabel } from 'utilities/render';
  import { renderPreciseTableDate } from 'utilities/date';
  import Int from 'components/core/internationalization/Int.svelte';
  import DropdownDrawer from 'components/dropdownDrawer/DropdownDrawer.svelte';
  import DropdownDrawerControls from 'components/dropdownDrawer/DropdownDrawerControls.svelte';
  import GraphOptionsMode from './GraphOptionsMode.svelte';

  const mode = getGraphsState('mode');
  const dynamics = getGraphsState('dynamics');
  const column = getDashboardState('column');
  const graphConfig = getContext('app').getAppConfig().graphs;
  const columnConfig = getContext('config').getColumnConfig();
  const labels = flattenLabels();
  const date = getDashboardState('date');

  let selected = $mode;
  let pick = selected;
  let isActive = false;

  $: updateMode(pick);
  $: label = renderLabel($mode, $dynamics, $column, $date);

  function pickPrecision() {
    if ($dynamics === 'graphDetailDay' || $dynamics === 'graphDetailAvgCheck') return 0;
    if ($dynamics === 'graphDetailWeek') return 1;
    if ($dynamics === 'graphDetailMonth') return 2;
    if ($dynamics === 'graphDetailQuarter') return 3;
    return 4;
  }

  function renderDateLabel() {
    const precision = pickPrecision();
    return renderPreciseTableDate($date, precision);
  }

  function renderColumnLabel() {
    return shortenLabel(labels[$column]);
  }

  function renderLabel() {
    if ($mode === 'graphModeDynamics' || $mode === 'graphModeReceipt') return renderDateLabel();
    return renderColumnLabel();
  }

  function flattenIndicators(result, indicator) {
    return {
      ...result,
      [indicator.value]: indicator.label,
    };
  }

  function flattenGroup(result, group) {
    return {
      ...result,
      ...group.indicators.reduce(flattenIndicators, {}),
    };
  }

  function flattenLabels() {
    return columnConfig.reduce(flattenGroup, {});
  }

  function hide() {
    isActive = false;
  }

  function updateMode() {
    $mode = pick;
    if (pick === 'graphModeReceipt') $dynamics = 'graphDetailMonth';
  }

  function updatePick() {
    pick = selected;
  }

  function updateSelected() {
    selected = pick;
  }

  function onApplyClick() {
    updatePick();
    hide();
  }

  function onCancelClick() {
    updateSelected();
    hide();
  }

  function onDropdownClose() {
    updateSelected();
    hide();
  }
</script>

<div
  class="txcm-graphModePicker">
    <div
      class="txcm-graphModePickerToggle">
        <Int
          key={label} />
    </div>
    <DropdownDrawer
      {isActive}
      on:dropdownclose={onDropdownClose}>
        {#each graphConfig.modes as mode (mode.value)}
          <GraphOptionsMode
            label={mode.label}
            value={mode.value}
            bind:selected />
        {/each}
        <DropdownDrawerControls>
          <button
            on:click={onCancelClick}
            class="txcm-dropdownDrawerCancel">
              <Int
                key="Отмена" />
          </button>
          <button
            on:click={onApplyClick}
            class="txcm-dropdownDrawerApply">
              <Int
                key="Выбрать срез" />
          </button>
        </DropdownDrawerControls>
    </DropdownDrawer>
</div>
