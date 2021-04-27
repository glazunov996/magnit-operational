<script>
  import { getContext } from 'svelte';
  import { getExportState } from 'state/export';
  import Int from 'components/core/internationalization/Int.svelte';
  import ControlledSelect from 'components/controlledSelect/ControlledSelect.svelte';
  import ExportIndicatorsRow from './ExportIndicatorsRow.svelte';

  export let dashboard;

  const indicators = getExportState('indicators');
  const config = getContext('app').getAppConfig();
  const { indicators: financialOptions } = config.dashboards.financial;
  const { indicators: operationalOptions } = config.dashboards.operational;
  const options = pickOptions();
  const flatIndicators = flattenOptions();

  let pick = [];

  $: updateIndicators(pick);

  function flattenOptions() {
    return options.reduce((result, option) => [...result, ...option.options], []);
  }

  function updateIndicator(id) {
    const indicator = flatIndicators.find(indicatorOption => indicatorOption.value === id);
    return {
      id,
      label: indicator.label,
    };
  }

  function updateIndicators() {
    $indicators = pick.map(updateIndicator);
  }

  function updateOption({ label, id }) {
    return {
      label,
      value: id,
    };
  }

  function updateOptions({ label, indicators: indicatorOptions }) {
    return {
      label,
      options: indicatorOptions.map(updateOption),
    };
  }

  function pickOptions() {
    const options = []
    operationalOptions.map(updateOptions).forEach(item => {
      item.options.forEach(opt => options.push(opt))
    })
    return [{ label: "", options }]
  }

  function removeIndicator(index) {
    pick.splice(index, 1);
    pick = pick;
  }

  function onRemoveIndicator({ detail }) {
    removeIndicator(detail.index);
  }
</script>

<div
  class="txcm-exportIndicators">
    <div
      class="txcm-exportColumnControls">
        <div
          class="txcm-exportHeader">
            <Int
              key="Показатели" />
        </div>
        <ControlledSelect
          name="exportSlices"
          label="Добавить"
          acceptLabel="Добавить"
          grouped={true}
          {options}
          bind:pick />
    </div>
    <ExportIndicatorsRow
      indicators={$indicators}
      on:removeindicator={onRemoveIndicator} />
</div>
