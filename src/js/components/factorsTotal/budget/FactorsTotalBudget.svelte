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

  const date = getDashboardState('date');
  const locale = getUIState('locale');

  $: label = renderLabel($date, $locale);
  $: column1 = data.column1;
  $: column2 = data.column2;

  function renderLabel() {
    const year = (new Date($date)).getFullYear();
    return `${translate("Бюджет", $locale)} ${year}`;
  }
</script>

<FactorsTotalRow>
  <FactorsTotalLabel
    {label} />
  {#if data}
  <FactorsTotalCell
    {indicator}
    value={column1.budgetPercent}
    baseRatio={baseRatios[1]}
    minRatio={minRatios[1]}
      diagrams= {[
        [column1.factCurrYearPercent.qNum, column1.budgetPercent.qNum],
        [column1.factCurrYearPercent.qNum, column1.budgetPercent.qNum]
    ]} />   
    <FactorsTotalCell
      {indicator}
      value={column2.budgetPercent}
      baseRatio={baseRatios[3]}
      minRatio={minRatios[3]}
      diagrams={[
        [column2.factCurrYearPercent.qNum, column2.budgetPercent.qNum],
        [column2.factCurrYearPercent.qNum, column2.budgetPercent.qNum]        
      ]} />     
  {/if}
</FactorsTotalRow>
