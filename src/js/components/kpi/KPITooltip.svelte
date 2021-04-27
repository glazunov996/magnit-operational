<script>
  /* eslint  unicorn/filename-case: 'off' */

  import { getDashboardState } from 'state/dashboard';
  import { renderYear, renderDateShort } from 'utilities/date';
  import formatLabel from 'utilities/formatLabel';
  import { translate } from 'utilities/dictionary';
  import { getUIState } from 'state/ui';
  import Int from 'components/core/internationalization/Int.svelte';  
  import { renderPreciseDate } from 'utilities/date';  

  export let data;
  
  const date = getDashboardState('date');
  const datePoP = getDashboardState('datePoP');
  const datePrecision = getDashboardState('datePrecision');

  let factLabel;
  let factPoPlabel;

  const locale = getUIState('locale');

  $: ({ fact, factPp, factVsPp, factVsPpPercent, factVsBudget, factVsBudgetPercent, budget } = data.tooltip);
  $: year = renderYear($date);
  $: units = data.units;
  $: updateLabels($date, $datePoP, $datePrecision);

  function updateLabels() {
    if ($datePrecision === 0) {
      factLabel = `${renderDateShort($date, $locale)} ${renderYear($date)}`
      factPoPlabel = `${renderDateShort($datePoP, $locale)} ${renderYear($datePoP)}`
    } else {
      factLabel = renderPreciseDate($date, $datePrecision, $locale)
      factPoPlabel = renderPreciseDate($datePoP, $datePrecision, $locale)
    }
  }

</script>

{#if data}
  <table
    class="txcm-kpiDataTooltip">
      <tr
        class="txcm-kpiDataTooltipRow">
          <th
            class="txcm-kpiDataTooltipCollumnHeader"
            scope="row" />
          <th
            class="txcm-kpiDataTooltipCollumnHeader"
            scope="row">
              <Int key="в %/п.п."/>
          </th>
          <th
            class="txcm-kpiDataTooltipCollumnHeader"
            scope="row">
              <Int key="абсолют"/>
          </th>
      </tr>
      <tr
        class="txcm-kpiDataTooltipRow">
        <th
          class="txcm-kpiDataTooltipRowHeader">
            <Int key="Факт"/> {factLabel}
        </th>
        <td
          class="txcm-kpiDataTooltipRowCell">
            {'-'}
        </td>
        <td
          class="txcm-kpiDataTooltipRowCell">
            {fact ? formatLabel(fact.qNum, units, '', 1.0) : '-'}
        </td>
      </tr>
      <tr
        class="txcm-kpiDataTooltipRow">
        <th
          class="txcm-kpiDataTooltipRowHeader">
            <Int key="Факт"/> {factPoPlabel}
        </th>
        <td
          class="txcm-kpiDataTooltipRowCell">
            {'-'}
        </td>
        <td
          class="txcm-kpiDataTooltipRowCell">
            {factPp ? formatLabel(factPp.qNum, units, '', 1.0) : '-'}
        </td>
      </tr>  
      <tr
        class="txcm-kpiDataTooltipRow">
        <th
          class="txcm-kpiDataTooltipRowHeader">
            <Int key="∆ от"/> {factPoPlabel}
        </th>
        <td
          class="txcm-kpiDataTooltipRowCell">
            {factVsPpPercent ? formatLabel(factVsPpPercent.qNum, '%', '%') : '-'}
        </td>
        <td
          class="txcm-kpiDataTooltipRowCell">
            {factVsPp ? formatLabel(factVsPp.qNum, units, '', 1.0) : '-'}
        </td>
      </tr>
      <tr
        class="txcm-kpiDataTooltipRow">
        <th
          class="txcm-kpiDataTooltipRowHeader">
            <Int key="План"/> {year}
        </th>
        <td
          class="txcm-kpiDataTooltipRowCell">
            {'-'}
        </td>
        <td
          class="txcm-kpiDataTooltipRowCell">
            {budget ? formatLabel(budget.qNum, units, '', 1.0) : '-'}
        </td>
      </tr>
      <tr
        class="txcm-kpiDataTooltipRow">
        <th
          class="txcm-kpiDataTooltipRowHeader">
            <Int key="∆ от плана"/>
        </th>
        <td
          class="txcm-kpiDataTooltipRowCell">
            {factVsBudgetPercent ? formatLabel(factVsBudgetPercent.qNum, '%', '%') : '-'}
        </td>
        <td
          class="txcm-kpiDataTooltipRowCell">
            {factVsBudget ? formatLabel(factVsBudget.qNum, units, '', 1.0) : '-'}
        </td>
      </tr>
  </table>
{/if}
