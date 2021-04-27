<script>
  import { createEventDispatcher } from 'svelte';
  import { getExportState } from 'state/export';
  import { renderID } from 'utilities/render';
  import { filterSelectOptions } from 'utilities/listFilter';
  import Int from 'components/core/internationalization/Int.svelte';
  import ListFilter from 'components/list/ListFilter.svelte';

  const ORIENTATION_THRESHOLD = 768;
  const LABEL_COUNT = 2;

  export let slice;

  const slicesFilter = getExportState('slicesFilter');
  const dispatch = createEventDispatcher();

  let filter = '';
  let options = generateAll();
  let isActive;
  let isSwitching;
  let innerWidth;

  $: switchOrientation = detectOrientation(innerWidth);
  $: label = generateToggleLabel(isActive, options);
  $: filtered = filterSelectOptions(slice.options, filter);
  $: $slicesFilter = updateFilter(options);

  function updateFilter() {
    return {
      ...$slicesFilter,
      [slice.value]: options,
    };
  }

  function detectOrientation() {
    switchOrientation = innerWidth <= ORIENTATION_THRESHOLD;
  }

  function generateLabel(value) {
    return slice
      .options
      .find(sliceOption => sliceOption.value === value)
      .label;
  }

  function generateLabels(values) {
    return values.map(generateLabel);
  }

  function generateToggleLabel() {
    if (isActive || options.length === 0) return 'Добавить';
    if (options.length <= LABEL_COUNT) return generateLabels(options).join(', ');
    const remainder = options.length - LABEL_COUNT;
    const optionsText = generateLabels(options.slice(0, LABEL_COUNT)).join(', ');
    if (remainder > 0) return `${optionsText} и еще ${remainder}`;
    return optionsText;
  }

  function generateAll() {
    return slice.options.map(option => option.value);
  }

  function pickAll() {
    options = generateAll();
  }

  function drop() {
    options = [];
  }

  function hide() {
    isActive = false;
  }

  function show() {
    isActive = true;
  }

  function toggle() {
    if (isActive) hide();
    else show();
  }

  function removeSlice() {
    dispatch('removeslice', { id: slice.value });
  }

  function onRemoveClick() {
    removeSlice();
  }

  function onSelectAllClick() {
    pickAll();
  }

  function onClearClick() {
    drop();
  }

  function onToggleClick() {
    toggle();
  }
</script>

<div
  class="txcm-exportSlice"
  class:txcm-exportSlice-is-switching={isSwitching}>
    <div
      class="txcm-exportSiceHeader">
        <Int
          key={slice.label} />
    </div>
    <button
      class="txcm-exportSliceRemove"
      on:click={onRemoveClick}>
        <Int
          key="Удалить" />
    </button>
    <button
      class="txcm-exportSliceToggle"
      class:txcm-exportSliceToggle-is-active={isActive}
      on:click={onToggleClick}>
        <Int
          key={label} />
        <svg
          class="txcm-exportSliceToggleIcon">
            <use
              xlink:href="#txspt-icons-angleArrow" />
        </svg>
    </button>
    <div
      class="txcm-exportSliceContent"
      class:txcm-exportSliceContent-is-active={isActive}>
        <ListFilter
          bind:value={filter}
          theme="txcm-listFilter-slice" />
        <button
          class="txcm-exportSliceSelectAll"
          on:click={onSelectAllClick}>
            <span
              class="txcm-exportSliceSelectAllText">
                <Int
                  key="Выбрать все" />
            </span>
            <span
              class="txcm-exportSliceSelectAllMobileText">
                <Int
                  key="Все" />
            </span>
        </button>
        <button
          class="txcm-exportSliceClear"
          on:click={onClearClick}>
            <Int
              key="Сбросить" />
        </button>
        <div
          class="txcm-exportSliceOptions">
            {#each filtered as option, optionIndex (renderID(slice.value, optionIndex))}
              <input
                class="txcm-exportSliceOptionInput"
                id={renderID(`export-${slice.value}`, optionIndex)}
                type="checkbox"
                bind:group={options}
                value={option.value} />
              <label
                class="txcm-exportSliceOptionLabel"
                for={renderID(`export-${slice.value}`, optionIndex)}>
                  <Int
                    key={option.label} />
                  <svg
                    class="txcm-exportSliceOptionLabelIcon">
                      <use
                        xlink:href="#txspt-icons-checkmark" />
                  </svg>
              </label>
            {/each}
        </div>
    </div>
</div>
<svelte:window
  bind:innerWidth />
