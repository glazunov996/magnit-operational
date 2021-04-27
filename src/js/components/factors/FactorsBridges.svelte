<script>
  /* eslint max-len: 'off' */

  import { sectionScroll } from 'utilities/sectionScroll';
  import FactorsBridge from './FactorsBridge.svelte';

  export let results;
  export let bridges;
  export let baseRatios;
  export let minRatios;
  export let indicator;

  $: graphs = calculateGraphs(results, bridges, baseRatios, minRatios);

  function calulateGraphShift(current, previous, currentRatio, previousRatio, previousShift) {
    if (previous < 0 && current < 0)
      return previousShift - currentRatio;
    if (previous >= 0 && current >= 0)
      return previousShift + previousRatio;
    if (previous < 0 && current >= 0)
      return previousShift;
    if (previous >= 0 && current < 0)
      return previousShift + previousRatio - currentRatio;
    return 0;
  }

  function calculateGraphValue(current, previous, baseRatio, minRatio) { 
    const currentNum = !isNaN(current.qNum) ? current.qNum : 0;
    const previousNum = !isNaN(previous.qNum) ? previous.qNum : 0;
    const currentRatio =  Math.abs(currentNum * baseRatio);
    const previousRatio = Math.abs(previousNum * baseRatio);
    const previousShift = previous.shift ? previous.shift : 0;
    let shift = calulateGraphShift(currentNum, previousNum, currentRatio, previousRatio, previousShift);    
    return {
      ...current,
      width: currentRatio,
      shift: shift,
      min: minRatio,
      baseRatio: baseRatio,
      currentNum: currentNum,
      previousNum: previousNum
    }
  }

  function calculateGraphRow(data, row, index) {
    const prevColumn1VSFactPercent = index !== 0 
      ? data[index - 1].column1.vsFactPercent : results.column1.factPrevYearPrecent

    const prevColumn1VSBudgetPercent = index !== 0 
      ? data[index - 1].column1.vsBudgetPercent : results.column1.budgetPercent

    const prevColumn2VSFactPercent = index !== 0 
      ? data[index - 1].column2.vsFactPercent : results.column2.factPrevYearPrecent

    const prevColumn2VSBudgetPercent = index !== 0 
      ? data[index - 1].column2.vsBudgetPercent : results.column2.budgetPercent

    data.push({
      column1: {
        vsFactPercent: calculateGraphValue(row.column1.vsFactPercent, prevColumn1VSFactPercent, baseRatios[0], minRatios[0]),        
        vsBudgetPercent: calculateGraphValue(row.column1.vsBudgetPercent, prevColumn1VSBudgetPercent, baseRatios[1], minRatios[1]),
      },
      column2: {
        vsFactPercent: calculateGraphValue(row.column2.vsFactPercent, prevColumn2VSFactPercent, baseRatios[2], minRatios[2]),
        vsBudgetPercent: calculateGraphValue(row.column2.vsBudgetPercent, prevColumn2VSBudgetPercent, baseRatios[3], minRatios[3]),
      },
    });

    return data;
  }
  
  function calculateGraphs() {
    const data =  bridges.reduce(calculateGraphRow, []);
    return data;
  }
</script>

{#if bridges}
  <div
    class="txcm-factorsRows"
    use:sectionScroll={true}>
      {#each bridges as bridge, index}
        <FactorsBridge
          {bridge}
          {indicator}
          graph={graphs[index]} />
      {/each}
  </div>
{/if}
