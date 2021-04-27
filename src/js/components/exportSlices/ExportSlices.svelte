<script>
  import { getContext, onDestroy } from 'svelte';
  import { getExportState, updateExport } from 'state/export';
  import { findIndex } from 'utilities/values';
  import Int from 'components/core/internationalization/Int.svelte';
  import ControlledSelect from 'components/controlledSelect/ControlledSelect.svelte';
  import ExportSlicesRow from './ExportSlicesRow.svelte';

  export let dashboard;
  export let data;

  const { export: options } = getContext('app').getAppConfig().dashboards[dashboard];
  const bits = options.map(option => option.bit);
  const slices = getExportState('slices');
  const slicesValue = getExportState('slicesValue');

  let pick = [];
  let order = [];

  $: updateOrder(pick);
  $: updateSlices(order);
  $: updateSliceValue($slices);

  drop();
  onDestroy(drop);

  function drop() {
    updateExport({
      slicesFilter: options.reduce((result, option) => {
        const fiter = result;
        fiter[option.value] = [];
        return fiter;
      }, {}),
    });
  }

  function updateSliceValue() {
    $slicesValue = bits
      .reduce((value, bit) => {
        const status = $slices.some(slice => slice.bit === bit) ? '1' : '0';
        value.splice(bit, 1, status);
        return value;
      }, $slicesValue.split('').reverse())
      .reverse()
      .join('');
  }

  function pickSliceOptions(value) {
    const { data: sliceOptions } = data.find(slice => slice.key === value);
    return sliceOptions;
  }

  function filterAddedPicks() {
    return pick.filter(id => $slices.every(slice => slice.value !== id));
  }

  function filterRemovedPick(result, slice) {
    const shouldRemove = pick.every(id => slice.value !== id);
    if (shouldRemove) result.push(slice.value);
    return result;
  }

  function filterRemovedPicks() {
    return $slices.reduce(filterRemovedPick, []);
  }

  function filterSavedPicks(id, picksRemoved) {
    return picksRemoved.every(removedID => removedID !== id);
  }

  function generateNewOrder(picksAdded, picksRemoved) {
    let newOrder = order.slice();
    if (picksRemoved.length > 0) newOrder = order.filter(id => filterSavedPicks(id, picksRemoved));
    if (picksAdded.length > 0) newOrder.push(...picksAdded);
    return newOrder;
  }

  function updateOrder() {
    const picksAdded = filterAddedPicks();
    const picksRemoved = filterRemovedPicks();
    const newOrder = generateNewOrder(picksAdded, picksRemoved);
    order = newOrder;
  }

  function removePick(id) {
    const index = pick.indexOf(id);
    pick.splice(index, 1);
    pick = pick;
  }

  function updateSlice(value) {
    const index = findIndex(options, value);
    const slice = options[index];
    const sliceOptions = pickSliceOptions(value);
    return {
      ...slice,
      options: sliceOptions,
    };
  }

  function updateSlices() {
    $slices = order.map(updateSlice);
  }

  function switchOrder({ id, shift }) {
    const index = order.indexOf(id);
    const newOrder = order.slice();
    newOrder.splice(index, 1);
    newOrder.splice((index + shift), 0, id);
    order = newOrder;
  }

  function onRemoveSlice({ detail }) {
    removePick(detail.id);
  }

  function onSwitchSlices({ detail }) {
    switchOrder(detail);
  }
</script>

<div
  class="txcm-exportSlices">
    <div
      class="txcm-exportColumnControls">
        <div
          class="txcm-exportHeader">
            <Int
              key="Срезы" />
        </div>
        <ControlledSelect
          name="exportSlices"
          label="Добавить"
          acceptLabel="Добавить"
          {options}
          bind:pick />
    </div>
    <ExportSlicesRow
      slices={$slices}
      on:removeslice={onRemoveSlice}
      on:switchslices={onSwitchSlices} />
</div>
