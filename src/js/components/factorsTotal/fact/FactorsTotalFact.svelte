<script>
  import { getDashboardState } from 'state/dashboard';
  import FactorsTotalRow from 'components/factorsTotal/FactorsTotalRow.svelte';
  import FactorsTotalLabel from 'components/factorsTotal/FactorsTotalLabel.svelte';
  import FactorsTotalCell from 'components/factorsTotal/FactorsTotalCell.svelte';
  import { translate } from 'utilities/dictionary';
  import { getUIState } from 'state/ui';

  export let data;
  export let baseRatios;
  export let minRatios;
  export let indicator;

  const datePoP = getDashboardState('datePoP');
  const locale = getUIState('locale');  

  $: label = renderLabel($datePoP, $locale);
  $: column1 = data.column1;
  $: column2 = data.column2;

  function renderLabel() {
    const year = (new Date($datePoP)).getFullYear();
    return `${translate("Факт", $locale)} ${year}`;
  }
</script>

<FactorsTotalRow>
  <FactorsTotalLabel
    {label} />
  {#if data}
    <FactorsTotalCell
      {indicator}
      value={[column1.factPrevYearPrecent, column1.budgetPrevYearPercent]}
      baseRatios={[baseRatios[0], baseRatios[1]]}
      minRatios={[minRatios[0], minRatios[1]]}
      diagrams={indicator.id == '20' ? [
        [column1.factCurrYearPercent.qNum, column1.factPrevYearPrecent.qNum],
        [column1.budgetPercent.qNum, column1.budgetPrevYearPercent.qNum]
      ] : [
        [column1.factCurrYearPercent.qNum, column1.factPrevYearPrecent.qNum]
      ]} /> 
    <FactorsTotalCell
      {indicator}
      value={[column2.factPrevYearPrecent, column2.budgetPrevYearPercent]}
      baseRatios={[baseRatios[2], baseRatios[3]]}
      minRatios={[minRatios[2], minRatios[3]]}
      diagrams={indicator.id == '20' ? [
        [column2.factCurrYearPercent.qNum, column2.factPrevYearPrecent.qNum],
        [column2.budgetPercent.qNum, column2.budgetPrevYearPercent.qNum]
      ] : [ 
        [column2.factCurrYearPercent.qNum, column2.factPrevYearPrecent.qNum]
      ]} />   
  {/if}
</FactorsTotalRow>
