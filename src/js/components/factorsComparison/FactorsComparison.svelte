<script>
  import { getDashboardState } from 'state/dashboard';
  import FactorsTotalRow from 'components/factorsTotal/FactorsTotalRow.svelte';
  import FactorsTotalLabel from 'components/factorsTotal/FactorsTotalLabel.svelte';
  import FactorsComparisonCell from './FactorsComparisonCell.svelte';
  import { translate } from 'utilities/dictionary';
  import { getUIState } from 'state/ui';

  export let data;
  export let baseRatios;
  export let minRatios;
  export let indicator;

  const date = getDashboardState('date');
  const locale = getUIState('locale');

  $: label = renderLabel($date, $locale);

  function renderLabel() {
    const year = (new Date($date)).getFullYear();
    return `${translate("Факт", $locale)} ${year}`;
  }
</script>

<FactorsTotalRow>
    <FactorsTotalLabel
      {label} />
    {#if data}
      <FactorsComparisonCell
        {indicator}
        value={[data.column1.factCurrYearPercent, data.column1.budgetPercent]}
        comparison={[data.column1.factPrevYearPrecent, data.column1.budgetPrevYearPercent.qNum]}
        baseRatios={[baseRatios[0], baseRatios[1]]}
        minRatios={[minRatios[0], minRatios[1]]}
        bridges={[
          data.column1.bridgeResultPrevYearPercent,
          data.column1.bridgeResultBudgetPercent,
        ]}
        diagrams={[
          [data.column1.factCurrYearPercent.qNum, data.column1.factPrevYearPrecent.qNum],
          [data.column1.budgetPrevYearPercent.qNum, data.column1.budgetPercent.qNum],
        ]} />
      
      <FactorsComparisonCell
        {indicator}
        value={[data.column2.factCurrYearPercent, data.column2.budgetPercent]}
        comparison={[data.column2.factPrevYearPrecent, data.column2.budgetPrevYearPercent.qNum]}
        baseRatios={[baseRatios[2], baseRatios[3]]}
        minRatios={[minRatios[2], minRatios[3]]}
        bridges={[
          data.column2.bridgeResultPrevYearPercent,
          data.column2.bridgeResultBudgetPercent,          
        ]}
        diagrams={[
          [data.column2.factCurrYearPercent.qNum, data.column2.factPrevYearPrecent.qNum],
          [data.column2.budgetPrevYearPercent.qNum, data.column2.budgetPercent.qNum],
        ]} />     
    {/if}
</FactorsTotalRow>
