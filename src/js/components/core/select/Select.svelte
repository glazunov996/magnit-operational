<script context="module">
  function isPrevKey(keyCode) {
    return keyCode === 38;
  }

  function isNextKey(keyCode) {
    return keyCode === 40;
  }

  function isEnterKey(keyCode) {
    return keyCode === 13;
  }
</script>

<script>
  import { findIndex, findValue } from 'utilities/values';
  import Int from 'components/core/internationalization/Int.svelte';
  import Dropdown from 'components/core/dropdown/Dropdown.svelte';
  import SelectOption from './SelectOption.svelte';

  export let label;
  export let pick;
  export let name;
  export let options = [];
  export let disabled = false;
  export let theme = '';

  let node;
  let selected = findIndex(options, pick);
  let highlighted = null;
  let isActive = false;

  $: updateEvents(isActive);
  $: hide(selected);
  $: updatePick(selected);

  function hasSelected() {
    return pick !== null;
  }

  function resetSelected() {
    selected = null;
  }

  function findHighlighted() {
    if (hasSelected()) return findIndex(options, pick);
    return 0;
  }

  function renderToggleLabel() {
    if (hasSelected()) {
      return options[highlighted].label;
    }
    return label;
  }

  function updatePick() {
    pick = findValue(options, selected);
  }

  function show() {
    isActive = true;
  }

  function hide() {
    if (isActive) isActive = false;
  }

  function highlightPrev() {
    if (highlighted === null) highlighted = findHighlighted();
    if (highlighted === 0) highlighted = options.length - 1;
    else highlighted -= 1;
  }

  function highlightNext() {
    if (highlighted === null) highlighted = findHighlighted();
    if (highlighted === (options.length - 1)) highlighted = 0;
    else highlighted += 1;
  }

  function pickHighlighted() {
    if (isActive && highlighted !== null) {
      if (pick !== options[highlighted].value) pick = options[highlighted].value;
      else pick = null;
    }
  }

  function scrollOptions(delta) {
    if (delta !== 0) {
      const step = delta < 0 ? -32 : 32;
      requestAnimationFrame(() => { node.scrollTop += step; });
    }
  }

  function onToggleClick() {
    if (!isActive) setTimeout(show, 5);
  }

  function onKeyUp({ keyCode }) {
    if (isPrevKey(keyCode)) highlightPrev();
    else if (isNextKey(keyCode)) highlightNext();
    else if (isEnterKey(keyCode)) pickHighlighted();
  }

  function onWheel() {
    event.preventDefault();
    event.stopPropagation();
    const { deltaY } = event;
    scrollOptions(deltaY);
  }

  function onDropdownClose() {
    hide();
  }

  function subscribeEvents() {
    window.addEventListener('keyup', onKeyUp);
    if (node) node.addEventListener('wheel', onWheel);
  }

  function unsubscribeEvents() {
    window.removeEventListener('keyup', onKeyUp);
    if (node) node.addEventListener('wheel', onWheel);
  }

  function updateEvents() {
    if (isActive) subscribeEvents();
    else unsubscribeEvents();
  }

  function onResetClick() {
    resetSelected();
  }
</script>

<div
  class={`txcm-select ${theme}`}>
    <button
      class="txcm-selectToggle"
      class:txcm-selectToggle-has-selected={hasSelected(pick)}
      class:txcm-selectToggle-is-opened={isActive}
      on:click={onToggleClick}
      {disabled}>
        {renderToggleLabel(pick)}
        <svg
          class="txcm-selectToggleIcon">
            <use
              xlink:href="#txspt-icons-fatArrow" />
        </svg>
    </button>
    <button
      class="txcm-selectReset"
      on:click={onResetClick}
      {disabled}>
        <Int
          key="Сбросить" />
    </button>
    <Dropdown
      {isActive}
      on:dropdownclose={onDropdownClose}>
        <ul
          class="txcm-selectOptions"
          class:txcm-selectOptions-is-opened={isActive}
          bind:this={node}>
            {#each options as option, index}
              <SelectOption
                bind:selected
                bind:highlighted
                {...option}
                {name}
                {index}
                {isActive} />
            {/each}
        </ul>
    </Dropdown>
</div>
