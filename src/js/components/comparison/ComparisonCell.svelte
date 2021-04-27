<script>
  import { checkDynamics } from 'utilities/indicator';
  import ComparisonColumn from './ComparisonColumn.svelte';
  import ComparisonValue from './ComparisonValue.svelte';

  export let data;
  export let units;

  $: ({ revenuePercent, dateDeltaPercent } = data);
</script>

<div
  class="txcm-comparisonCell">
    <ComparisonColumn>
      <ComparisonValue
        {units}
        status={true}
        dynamics={checkDynamics(revenuePercent.qNum)}>
          {revenuePercent.qText}
      </ComparisonValue>
    </ComparisonColumn>
    <ComparisonColumn>
      <ComparisonValue
        dynamics={checkDynamics(dateDeltaPercent.qNum)}>
          {dateDeltaPercent.qText}
      </ComparisonValue>
    </ComparisonColumn>
</div>
