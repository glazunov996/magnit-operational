<script>
  import { renderMonthShort } from 'utilities/date';
  import { getGraphsState } from 'state/graphs';
  import { translate } from 'utilities/dictionary';
  import { getUIState } from 'state/ui';
  import Int from 'components/core/internationalization/Int.svelte'; 

  const dynamics = getGraphsState('dynamics');
  const locale = getUIState('locale');

  export let data;

  $: factLabel = updateFactLabel(data, $dynamics, $locale);
  $: factPrevLabel = updateFactPrevLabel(data, $dynamics, $locale);

  function updateFactLabel() {
    try {
      if ($dynamics === 'graphDetailDay') {
        const month = renderMonthShort((new Date(data.year, data.month - 1, data.day)).getTime(), $locale);
        return `${data.day} ${month} ${data.year}`
      }
      if ($dynamics === 'graphDetailWeek')
        return `${data.month} ${translate("Неделя", $locale)} ${data.year}`;
      if ($dynamics === 'graphDetailMonth') {
        const month = renderMonthShort((new Date(data.year, data.month - 1, 1)).getTime(), $locale);
        return `${month} ${data.year}`
      }
      if ($dynamics === 'graphDetailQuarter')
        return `${data.month} ${translate("Квартал", $locale)} ${data.year}`;
    } catch (e) {
      console.log("updateFactLabel", e)      
    }
    return `${data.year}`
  }

  function updateFactPrevLabel() {
    try {
      if ($dynamics === 'graphDetailDay') {
        const month = renderMonthShort((new Date(data.year - 1, data.month - 1, data.day)).getTime(), $locale);
        return `${data.day} ${month} ${data.year - 1}`
      }
      if ($dynamics === 'graphDetailWeek')
        return `${data.month} ${translate("Неделя", $locale)} ${data.year - 1}`;
      if ($dynamics === 'graphDetailMonth') {
        const month = renderMonthShort((new Date(data.year - 1, data.month - 1, 1)).getTime(), $locale);
        return `${month} ${data.year - 1}`
      }
      if ($dynamics === 'graphDetailQuarter')
        return `${data.month} ${translate("Квартал", $locale)} ${data.year - 1}`;
    } catch (e) {
      console.log("updateFactLabel", e)   
    }
    return `${data.year - 1}`
  }
  
</script>

{#if data}
  <table
    class="txcm-graphTooltip">
      <tr
        class="txcm-graphTooltipRow">
          <th
            class="txcm-graphTooltipRowHeader txcm-graphTooltipRowHeader-fact"
            class:txcm-graphTooltipRowHeader-fact-normal={!data.deviations}>
              <Int key="Факт"/> {factLabel}
          </th>
          <td
            class="txcm-graphTooltipRowCell">
              {data.fact ? data.fact : '-'}
          </td>
        <tr
          class="txcm-graphTooltipRow">
          <th
            class="txcm-graphTooltipRowHeader">
              <Int key="Факт"/> {factPrevLabel}
          </th>
          <td
            class="txcm-graphTooltipRowCell">
              {data.vsPp ? data.vsPp : '-'}
          </td>
        </tr>
      <tr
        class="txcm-graphTooltipRow">
        <th
          class="txcm-graphTooltipRowHeader txcm-graphTooltipRowHeader-deltaBudget">
            <Int key="∆ от"/> {factPrevLabel}
        </th>
        <td
          class="txcm-graphTooltipRowCell">
            {data.vsPpPercent ? data.vsPpPercent : '-'}
        </td>
      </tr> 
        <tr
          class="txcm-graphTooltipRow">
          <th
            class="txcm-graphTooltipRowHeader">
              <Int key="План"/> {data.year}
          </th>
          <td
            class="txcm-graphTooltipRowCell">
              {data.vsBudget ? data.vsBudget : '-'}
          </td>
        </tr>
      <tr
        class="txcm-graphTooltipRow">
        <th
          class="txcm-graphTooltipRowHeader txcm-graphTooltipRowHeader-deltaPoP">
            <Int key="∆ от плана"/>
        </th>
        <td
          class="txcm-graphTooltipRowCell">
            {data.vsBudgetPercent ? data.vsBudgetPercent : '-'}
        </td>
      </tr>
  </table>
{/if}
