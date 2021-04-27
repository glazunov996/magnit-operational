<script>
  import { getContext, setContext, onDestroy } from 'svelte';
  import { initComparisonIndicators, destroyComparisons } from 'state/comparisonIndicators';
  import { sectionScroll } from 'utilities/sectionScroll';
  import KPIRow from 'components/kpi/KPIRow.svelte';
  import ComparisonIndicators from 'components/comparisonIndicators/ComparisonIndicators.svelte';
  import ComparisonsTableHeader from './ComparisonsTableHeader.svelte';
  import ComparisonsContent from './ComparisonsContent.svelte';

  export let data = null;
  export let indicator;

  const config = getContext('config').getIndicatorsConfig();
  const indicators = Object.values(config).reduce(flattenCategories, {});

  let comparisonData;
  let comparisonIndicators;

  setContext('comparisonsConfig', {
    getComparisonIndicatorsConfig: () => comparisonIndicators,
  });

  $: updateData(data);

  onDestroy(destroy);

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

  function initComparisonIndicatorsState() {
    if (comparisonIndicators) initComparisonIndicators(comparisonIndicators);
  }

  function findIndicator() {
    return Object.values(indicators).find(option => option.url === indicator);
  }

  function updateData() {
    comparisonData = data || null;
    comparisonIndicators = data && data.comparisons ? data.comparisons : null;
    initComparisonIndicatorsState();
  }

  function destroy() {
    destroyComparisons();
  }
</script>

<section
  class="txcm-comparisonsSection">
    <ComparisonsTableHeader />
    <ComparisonIndicators />
    {#if comparisonData}
      <div
        class="txcm-comparisonsRows"
        use:sectionScroll={true}>
          <KPIRow
            indicator={findIndicator(indicator)}
            data={comparisonData} />
          {#if comparisonIndicators}
            <ComparisonsContent
              data={comparisonIndicators} />
          {/if}
      </div>
    {/if}
</section>
