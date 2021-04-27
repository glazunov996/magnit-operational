<script>
  import { checkArrowDynamics, compareDynamics } from 'utilities/indicator';
  import SliceColumn from './SliceColumn.svelte';
  import SliceValue from './SliceValue.svelte';  
  import formatLabel from 'utilities/formatLabel';

  export let data;
  export let units;
  export let indicator;

  $: fact = data.fact;
  $: factVsBudgetPercent = data.factVsBudgetPercent;
  $: factVsPpPercent = data.factVsPpPercent;
  $: arrow = data.arrow;
  $: base = indicator.id != '4' ? 1000000.0 : 1.0;

</script>

<div
  class="txcm-sliceCell">
    <SliceColumn>
      <SliceValue
        dynamics={!arrow ? -1 : arrow.qNum}
        status={true}>
          { fact ? formatLabel(fact.qNum, units, '', base) : '-'}
      </SliceValue>
    </SliceColumn>
    <SliceColumn>
      <SliceValue
        dynamics={factVsPpPercent ? checkArrowDynamics(fact ? fact.qNum : 0, factVsPpPercent.qNum, !arrow ? -1 : arrow.qNum) : 0}>
         { factVsPpPercent ? formatLabel(factVsPpPercent.qNum, '%') : '-'}
      </SliceValue>
    </SliceColumn>
    <SliceColumn>
      <SliceValue
        dynamics={factVsBudgetPercent ? checkArrowDynamics(fact ? fact.qNum : 0, factVsBudgetPercent.qNum, !arrow ? -1 : arrow.qNum) : 0}>
          { factVsBudgetPercent ? formatLabel(factVsBudgetPercent.qNum, '%') : '-'}
      </SliceValue>
    </SliceColumn>
</div>
