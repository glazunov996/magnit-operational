<script>
  import formatLabel from 'utilities/formatLabel';
  import Int from 'components/core/internationalization/Int.svelte'; 

  export let data;

</script>

<table class="txcm-comboBarTooltip">
  <tr class="txcm-graphTooltipRow" >
    <th class="txcm-comboBarTooltipRowHeader txcm-comboBarTooltipRowHeader-bar1">
      <Int key="Влияние товарно-ценовой MIX'a"/>
    </th>
    <td class="txcm-comboBarTooltipRowCell">
      {data[0] ? formatLabel(data[0].point, '%', '%') : '-'}
    </td>
  </tr>
  <tr class="txcm-graphTooltipRow">
    <th class="txcm-comboBarTooltipRowHeader txcm-comboBarTooltipRowHeader-bar2">
      <Int key="Влияние комплексности"/>
    </th>
    <td class="txcm-comboBarTooltipRowCell">
      {data[1] ? formatLabel(data[1].point, '%', '%') : '-'}
    </td>
  </tr>
  <tr class="txcm-graphTooltipRow">
    <th class="txcm-comboBarTooltipRowHeader txcm-comboBarTooltipRowHeader-bar3">
      <Int key="Влияние динамики нерегулярных цен"/>
    </th>
    <td class="txcm-comboBarTooltipRowCell">
      {data[2] ? formatLabel(data[2].point, '%', '%') : '-'}
    </td>
  </tr>
  <tr class="txcm-graphTooltipRow">
    <th class="txcm-comboBarTooltipRowHeader txcm-comboBarTooltipRowHeader-bar4">
      <Int key="Влияние инфляции розничных цен, %"/>
    </th>
    <td class="txcm-comboBarTooltipRowCell">
      {data[3] ? formatLabel(data[3].point, '%', '%') : '-'}
    </td>
  </tr>
  <tr class="txcm-graphTooltipRow">
    <th class="txcm-comboBarTooltipRowHeader txcm-comboBarTooltipRowHeader-bar5">
      <Int key="Влияние товаров лояльности, %"/>
    </th>
    <td class="txcm-comboBarTooltipRowCell">
      {data[4] ? formatLabel(data[4].point, '%', '%') : '-'}
    </td>
  </tr>
</table>