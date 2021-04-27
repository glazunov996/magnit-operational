<script>
  import { getContext } from 'svelte';
  import { sectionScroll } from 'utilities/sectionScroll';
  import KPIRow from 'components/kpi/KPIRow.svelte';
  import SlicesTableHeader from './SlicesTableHeader.svelte';
  import SlicesCategories from './SlicesCategories.svelte';
  import SlicesLoader from '/SlicesLoader.svelte';
  import { getUIState } from 'state/ui';

  export let data = null;
  export let dashboard;
  export let indicator;

  const tab = null;
  const config = getContext('config').getIndicatorsConfig();
  const indicators = Object.values(config).reduce(flattenCategories, {});
  const updating = getUIState('updating');

  let slicesData;
  let isInverted = false;

  $: updateData(data);
  $: checkInverted(slicesData);

  function checkInverted() {    
    if (slicesData && slicesData.indicator) {
      const data = slicesData.indicator;
      const arrow = data.column1.arrow ? data.column1.arrow.qNum : 0;
      isInverted = arrow === 2 || arrow === 3
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

  function updateData() {
    slicesData = data || null;
  }
</script>

<section
  class="txcm-slicesSection">
    <SlicesTableHeader
      indicator={findIndicator(indicator)}
      {dashboard} />
    {#if slicesData}
      <div
        class="txcm-slicesRows"
        use:sectionScroll={true}>
          {#if slicesData.indicator}
            <KPIRow
              units={slicesData.units}
              indicator={findIndicator(indicator)}
              data={slicesData.indicator} />
          {/if}
          <SlicesCategories
            {isInverted}
            data={slicesData}
            units={slicesData.units}
            indicator={findIndicator(indicator)}
            {tab} />
          {#if $updating > 0}
            <SlicesLoader shift={80} />
          {/if}
      </div>
    {/if}
</section>
