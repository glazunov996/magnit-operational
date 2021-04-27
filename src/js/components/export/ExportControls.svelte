<script>
  /* eslint unicorn/prefer-node-append: 'off' */
  import { getContext } from 'svelte';
  import { getExportState } from 'state/export';
  import { getDashboardState } from 'state/dashboard';
  import { requestExport } from 'utilities/export';
  import { renderMonthLong, renderPreciseCellDate } from 'utilities/date';

  import Int from 'components/core/internationalization/Int.svelte';

  export let dashboard;
  export let conditions;

  const config = getContext('app').getAppConfig();
  const { export: options, indicators: operationalOptions } = getContext('app').getAppConfig().dashboards[dashboard];

  const downloading = getExportState('downloading');
  const slicesFilter = getExportState('slicesFilter');
  const indicators = getExportState('indicators');
  const date = getDashboardState('date');
  const datePoP = getDashboardState('datePoP');
  const datePrecision = getDashboardState('datePrecision');

  $: flattenOperationalOptions = flatOperationalOptions(operationalOptions)

  function disable() {
    $downloading += 1;
  }

  function enable() {
    $downloading -= 1;
  }

  function flatOperationalOptions() {
    const options = []
    operationalOptions.map(updateOptions).forEach(item => {
      item.options.forEach(opt => options.push(opt))
    })
    return options;
  }

  function updateOption({ label, id, configName }) {
    return {
      label,
      value: id,
      configName
    };
  }

  function updateOptions({ label, indicators: indicatorOptions }) {
    return {
      label,
      options: indicatorOptions.map(updateOption),
    };
  }

  async function downloadExport(url) {
    const label = $indicators.length === 1 ? $indicators[0].label : `${$indicators.length} показателя`;   
    const name1 = renderPreciseCellDate($date, $datePrecision);
    const name2 = renderPreciseCellDate($datePoP, $datePrecision);
    let response = await fetch(url);
    let blob = await response.blob();
    let a = document.createElement('a');
    a.href = window.URL.createObjectURL(blob);
    a.download = `${label} ${name1} ${name2}.xlsx`;
    a.click();
  }

  function onDownloadClick() {
    disable();
    const a1 = Object.entries($slicesFilter)
      .filter(([key, value]) => value.length > 0)
      .map(([key, value]) => options.find(item => item.value === key).label);
    const a2 = $indicators
      .map(item => item.label)
      .map(item => flattenOperationalOptions.find(item2 => item2.label === item).configName)
      .filter(item => item);
    const config = [...a1, ...a2].join('.') + '.';
    requestExport(dashboard, config, $slicesFilter, conditions)
      .then(async (url) => {  await downloadExport(url) })
      .then(enable)
      .catch(enable);
  }

  function checkDisabled() {
    return $downloading > 0 || $indicators.length === 0;
  }
</script>

<div
  class="txcm-exportControls">
    <button
      class="txcm-exportDownload"
      on:click={onDownloadClick}
      disabled={checkDisabled($downloading, $slicesFilter, $indicators)}>
        <Int
          key="Скачать" />
    </button>
</div>
