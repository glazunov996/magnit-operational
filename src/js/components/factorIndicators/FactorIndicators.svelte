<script>
  import { getUIState } from 'state/ui';
  import { getDashboardState } from 'state/dashboard';
  import FactorIndicatorsCell from './FactorIndicatorsCell.svelte';

  export let data;

  const sectionScrollX = getUIState('sectionScrollX');

  let node;

  $: updateScroll($sectionScrollX);

  function updateScroll() {
    if (node) node.scrollLeft = $sectionScrollX;
  }
</script>

<div
  bind:this={node}
  class="txcm-factorsTotalDiagramIndicators">
    <div
      class="txcm-factorsTotalDiagramIndicatorsRow">
        <div
          class="txcm-factorsTotalDiagramIndicatorCell">
            <FactorIndicatorsCell
              base={data.column1.factCurrYearPercent.qNum}
              comparison={data.column1.budgetPercent.qNum}
              bridge={data.column1.bridgeResultBudgetPercent.qNum} />
            <FactorIndicatorsCell
              base={data.column1.factCurrYearPercent.qNum}
              comparison={data.column1.factPrevYearPrecent.qNum}
              bridge={data.column1.bridgeResultPrevYearPercent.qNum} />
        </div>
        <div
          class="txcm-factorsTotalDiagramIndicatorCell">
            <FactorIndicatorsCell
              base={data.column2.factCurrYearPercent.qNum}
              comparison={data.column2.budgetPercent.qNum}
              bridge={data.column2.bridgeResultBudgetPercent.qNum} />
            <FactorIndicatorsCell
              base={data.column2.factCurrYearPercent.qNum}
              comparison={data.column2.factPrevYearPrecent.qNum}
              bridge={data.column2.bridgeResultPrevYearPercent.qNum} />
        </div>
      </div>
</div>
