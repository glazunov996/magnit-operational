<script>
  import { findIndex, findIndexes, findGroupedIndexes, findValue, findValues, findGroupedValues } from 'utilities/values';
  import Int from 'components/core/internationalization/Int.svelte';
  import DropdownDrawer from 'components/dropdownDrawer/DropdownDrawer.svelte';
  import DropdownDrawerControls from 'components/dropdownDrawer/DropdownDrawerControls.svelte';
  import ListFilter from 'components/list/ListFilter.svelte';
  import { getUIState } from 'state/ui';
  import { translate } from 'utilities/dictionary';

  export let label;
  export let pick;
  export let selected;
  export let options;
  export let theme;
  export let multiple;
  export let grouped;
  export let filter;
  export let disabled;
  export let acceptLabel;

  let toggleLabel = label;
  let isActive = false;

  const locale = getUIState('locale');

  $: changeSelected(pick, $locale);

  function changeSelected() {
    updateSelected(pick);
    renderToggleLabel(pick);
  }

  function hasSelected() {
    if (multiple) return pick.length > 0;
    return pick !== null;
  }

  function renderSelectedMultipleLabel() {
    const text = options[selected[0]].label;
    if (selected.length === 1) return text;
    const count = selected.length - 1;
    return `${translate(text, $locale)}, +${count}`;
  }

  function renderSelectedUniqueLabel() {
    return options[selected].label;
  }

  function renderSelectedMultipleGroupedLabel() {
    const indexEements = selected[0].split('-');
    const groupIndex = parseInt(indexEements[0], 10);
    const optionIndex = parseInt(indexEements[1], 10);
    const text = options[groupIndex].options[optionIndex].label;
    if (selected.length === 1) return text;
    const count = selected.length - 1;
    return `${translate(text, $locale)}, +${count}`;
  }

  function renderSelectedLabel() {
    if (grouped) return renderSelectedMultipleGroupedLabel();
    if (multiple) return renderSelectedMultipleLabel();
    return renderSelectedUniqueLabel();
  }

  function renderToggleLabel() {
    toggleLabel = hasSelected() ? renderSelectedLabel() : label;
  }

  function show() {
    isActive = true;
  }

  function resetSelected() {
    if (grouped || multiple) selected = [];
    else selected = null;
  }

  $: changeSelected(pick);
  function updateSelected() {
    if (grouped) selected = findGroupedIndexes(options, pick);
    else if (multiple) selected = findIndexes(options, pick);
    else selected = findIndex(options, pick);
  }

  function resetPick() {
    if (grouped || multiple) pick = [];
    else pick = null;
  }

  function updatePick() {
    if (grouped) pick = findGroupedValues(options, selected);
    else if (multiple) pick = findValues(options, selected);
    else pick = findValue(options, selected);
  }

  function hide() {
    if (isActive) isActive = false;
  }

  function onToggleClick() {
    if (!isActive) setTimeout(show, 5);
  }

  function onDropdownClose() {
    updateSelected();
    hide();
  }

  function onCancelClick() {
    updateSelected();
    hide();
  }

  function onApplyClick() {
    updatePick();
    hide();
  }

  function onResetClick() {
    resetPick();
    resetSelected();
    hide();
  }
</script>

<div
  class={`txcm-controlledSelect ${theme}`}>
    <button
      class="txcm-controlledSelectToggle"
      class:txcm-controlledSelectToggle-has-selected={hasSelected(pick)}
      class:txcm-controlledSelectToggle-is-opened={isActive}
      on:click={onToggleClick}
      {disabled}>
        <Int
          key={toggleLabel} />
        <svg
          class="txcm-controlledSelectToggleIcon">
            <use
              xlink:href="#txspt-icons-fatArrow" />
        </svg>
    </button>
    <button
      class="txcm-controlledSelectReset"
      on:click={onResetClick}
      {disabled}>
        <Int
          key="Сбросить" />
    </button>
    <DropdownDrawer
      {isActive}
      on:dropdownclose={onDropdownClose}>
        <ListFilter
          bind:value={filter} />
        <slot />
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
                key={acceptLabel} />
          </button>
        </DropdownDrawerControls>
    </DropdownDrawer>
</div>
