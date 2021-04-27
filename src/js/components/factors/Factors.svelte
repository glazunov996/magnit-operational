<script>
  import { getContext } from 'svelte';  
  import { getDashboardState } from 'state/dashboard';
  import FactorIndicators from 'components/factorIndicators/FactorIndicators.svelte';
  import FactorsSectionHeader from './FactorsSectionHeader.svelte';
  import FactorsSectionFooter from './FactorsSectionFooter.svelte';
  import FactorsBridges from './FactorsBridges.svelte';
  import FactorsTableHeader from './FactorsTableHeader.svelte';

  export let data = null;
  export let dashboard;
  export let indicator;

  const config = getContext('config').getIndicatorsConfig();
  const indicators = Object.values(config).reduce(flattenCategories, {});

  let baseRatios = [0, 0, 0, 0];
  let minRatios = [0, 0, 0, 0]

  $: bridges = sortedBridges(data); 
  $: results = data.results && data.results.length ? data.results[0] : null
  $: updateBaseRatios(bridges);
  $: indicatorId = findIndicator(indicator);

  function sortedBridges() {
    if (!data.results)
      return [];
    if (data.results[0].column1.factPrevYearPrecent.qNum >= 0) {
      return data.bridges.sort((a, b) => {
        return a.column1.vsFactPercent.qNum - b.column1.vsFactPercent.qNum;
      })
    } else {
      return data.bridges.sort((a, b) => {
        return b.column1.vsFactPercent.qNum - a.column1.vsFactPercent.qNum;
      })
    }
  }

  function flattenIndicators(results, option) {
    return {
      ...results,
      [option.id]: option,
    };
  }

  function flattenCategories(results, group) {
    return {
      ...results,
      ...group.indicators.reduce(flattenIndicators, {}),
    };
  }

  function findIndicator() {
    return Object.values(indicators).find(option => option.url === indicator);
  }

  function calculateRange() {
    const arr = [
      [results.column1.factPrevYearPrecent && !isNaN(results.column1.factPrevYearPrecent.qNum) ? results.column1.factPrevYearPrecent.qNum : 0], 
      [results.column1.budgetPercent && !isNaN(results.column1.budgetPercent.qNum) ? results.column1.budgetPercent.qNum : 0],
      [results.column2.factPrevYearPrecent && !isNaN(results.column2.factPrevYearPrecent.qNum) ? results.column2.factPrevYearPrecent.qNum : 0],
      [results.column2.budgetPercent && !isNaN(results.column2.budgetPercent.qNum) ? results.column2.budgetPercent.qNum : 0]
    ];
    bridges.reduce((prev, curr) => {
      prev[0] += curr.column1.vsFactPercent && !isNaN(curr.column1.vsFactPercent.qNum) ? curr.column1.vsFactPercent.qNum : 0;
      prev[1] += curr.column1.vsBudgetPercent && !isNaN(curr.column1.vsBudgetPercent.qNum) ? curr.column1.vsBudgetPercent.qNum : 0;
      prev[2] += curr.column2.vsFactPercent && !isNaN(curr.column2.vsFactPercent.qNum) ? curr.column2.vsFactPercent.qNum : 0;
      prev[3] += curr.column2.vsBudgetPercent && !isNaN(curr.column2.vsBudgetPercent.qNum) ? curr.column2.vsBudgetPercent.qNum : 0;
      arr[0].push(prev[0]);
      arr[1].push(prev[1]);
      arr[2].push(prev[2]);
      arr[3].push(prev[3]);
      return prev;
    }, [ 
      results.column1.factPrevYearPrecent && !isNaN(results.column1.factPrevYearPrecent.qNum) ? results.column1.factPrevYearPrecent.qNum : 0, 
      results.column1.budgetPercent && !isNaN(results.column1.budgetPercent.qNum) ? results.column1.budgetPercent.qNum : 0, 
      results.column2.factPrevYearPrecent && !isNaN(results.column2.factPrevYearPrecent.qNum) ? results.column2.factPrevYearPrecent.qNum : 0, 
      results.column2.budgetPercent && !isNaN(results.column2.budgetPercent.qNum) ? results.column2.budgetPercent.qNum : 0
    ])
    const min = [
      Math.min(...arr[0]),
      Math.min(...arr[1]),
      Math.min(...arr[2]),
      Math.min(...arr[3]),
    ];
    const max = [
      Math.max(...arr[0]),
      Math.max(...arr[1]),
      Math.max(...arr[2]),
      Math.max(...arr[3]),
    ];
    return [
      [
        min[0] - Math.abs(max[0] - min[0]) * 0.30,
        min[1] - Math.abs(max[1] - min[1]) * 0.30,
        min[2] - Math.abs(max[2] - min[2]) * 0.30,
        min[3] - Math.abs(max[3] - min[3]) * 0.30
      ], 
      max
    ];
  }

  function coerceMinRatio(min, comparison, baseRatio) {
    if (comparison >= 0) {
      return -1 * min * baseRatio;
    } else {        
      return -1 * (min - comparison)  * baseRatio;        
    }
  }

  function updateBaseRatios() {
    if (!results) 
      return;
    const [min, max] = calculateRange();
    baseRatios[0] = 1 / Math.abs(max[0] - min[0]);
    baseRatios[1] = 1 / Math.abs(max[1] - min[1]);
    baseRatios[2] = 1 / Math.abs(max[2] - min[2]);
    baseRatios[3] = 1 / Math.abs(max[3] - min[3]);
    minRatios[0] = coerceMinRatio(min[0], results.column1.factPrevYearPrecent ? results.column1.factPrevYearPrecent.qNum : 0, baseRatios[0]);
    minRatios[1] = coerceMinRatio(min[1], results.column1.budgetPercent ? results.column1.budgetPercent.qNum : 0, baseRatios[1]);
    minRatios[2] = coerceMinRatio(min[2], results.column2.factPrevYearPrecent ? results.column2.factPrevYearPrecent.qNum : 0, baseRatios[2]);
    minRatios[3] = coerceMinRatio(min[3], results.column2.budgetPercent ? results.column2.budgetPercent.qNum : 0, baseRatios[3]);
  }

</script>

<section
  class="txcm-factorsSection">
    <FactorsTableHeader
      indicator={indicatorId}
      {dashboard} />
    {#if data && results}
      <FactorsSectionHeader
        data={results} 
        {baseRatios}  
        {minRatios}
        indicator={indicatorId}
      />      
      <FactorsBridges
        results={results}
        bridges={bridges}
        {baseRatios}
        {minRatios}
        indicator={indicatorId}
      />      
      <FactorsSectionFooter
        data={results}
        {baseRatios}
        {minRatios}
        indicator={indicatorId}
      />
      <!--FactorIndicators
        data={results} /-->
    {/if}
</section>
