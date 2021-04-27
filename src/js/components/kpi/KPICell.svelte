<script>
  /* eslint  unicorn/filename-case: 'off' */

  import { onMount } from 'svelte';
  import { tooltip } from 'utilities/tooltip';
  import { checkArrowDynamics, compareDynamics } from 'utilities/indicator';
  import KPIColumn from './KPIColumn.svelte';
  import KPIValue from './KPIValue.svelte';
  import KPITooltip from './KPITooltip.svelte';
  import formatLabel from 'utilities/formatLabel';
  import { getActiveIndicatorsState } from 'state/indicators';

  export let data;
  export let units;
  export let indicator;
  export let loaded;

  const activeIndicators = getActiveIndicatorsState();

  $: ({ fact, factVsPp, factVsPpPercent, factVsBudget, factVsBudgetPercent, arrow } = data);
  $: tooltipOptions = updateTooltip(data, $activeIndicators);

  function updateTooltip() {    
    return {
      content: {
        component: KPITooltip,
        data: {
          tooltip: data,
          indicator: indicator,
          units
        } 
      },
      side: 'right',
    };
  }

</script>

<div
  class="txcm-kpiCell"
  use:tooltip={tooltipOptions}>
  {#if loaded}
    <KPIColumn>
      <KPIValue
        units={0}
        status={true}
        dynamics={!arrow ? -1 : arrow.qNum } >
          {fact ? formatLabel(indicator.id != 7 && indicator.id != 18 ? fact.qNum : fact.qNum / 1000.0 , units, units === '%' ? '%' : '',
            indicator.id != 4 ? 1000000.0 : 1.0) : '-'}
      </KPIValue>    
    </KPIColumn> 
    <KPIColumn>
      <KPIValue
        units={0}
        dynamics={checkArrowDynamics(fact ? fact.qNum : 0, units !== '%' && factVsPp ? factVsPp.qNum : 0, !arrow ? -1 : arrow.qNum)}>
          {units !== '%' ? (factVsPp ? formatLabel(indicator.id != 7 && indicator.id != 18 ? factVsPp.qNum : factVsPp.qNum / 1000.0, units, '', 
            indicator.id != 4 ? 1000000.0 : 1.0) : '-') : ''}
      </KPIValue>
      <KPIValue
        units={0}
        dynamics={checkArrowDynamics(fact ? fact.qNum : 0, factVsPpPercent ? factVsPpPercent.qNum : 0, !arrow ? -1 : arrow.qNum)}>
          {factVsPpPercent ? formatLabel(factVsPpPercent.qNum, '%', units === '%' ? 'п.п.' : '%') : '-'}
      </KPIValue>    
    </KPIColumn>
    <KPIColumn>
      <KPIValue
        {units}
        dynamics={checkArrowDynamics(fact ? fact.qNum : 0, units !== '%' && factVsBudget ? factVsBudget.qNum : 0, !arrow ? -1 : arrow.qNum)}>
          {units !== '%' ? (factVsBudget ? formatLabel(factVsBudget.qNum, units, '', 
            indicator.id != 4 ? 1000000.0 : 1.0) : '-') : ''}
      </KPIValue>
      <KPIValue
        units={0}
        dynamics={checkArrowDynamics(fact ? fact.qNum : 0, factVsBudgetPercent ? factVsBudgetPercent.qNum : 0, !arrow ? -1 : arrow.qNum)}>
          {factVsBudgetPercent ? formatLabel(factVsBudgetPercent.qNum, '%', units === '%' ? 'п.п.' : '%') : '-'}
      </KPIValue>    
    </KPIColumn>
  {/if}
</div>
