<script>
  import { tooltip } from 'utilities/tooltip';
  import GraphTooltip from 'components/graphTooltip/GraphTooltip.svelte';

  export let point;
  export let min;
  export let max;
  export let isInverted;

  let leftValue;
  let rightValue;
  let tooltipOptions;

  $: updateTooltip(point);
  $: updateValues(point, min, max);

  function updateTooltip() {
    tooltipOptions = {
      content: {
        component: GraphTooltip,
        data: point.tooltip ? point : null,
      },
      side: 'left',
    };
  }

  function updateValues() {
    if (!!point.left)
      leftValue = -(1 - Math.abs(point.left / min)) * 100;
    if (!!point.right) {
      rightValue = -(1 - Math.abs(point.right / min)) * 100;
    }
  }

</script>

<div
  class="txcm-barChartComparison"
  use:tooltip={tooltipOptions}>
    {#if !!point.left && Math.abs(point.left / 10000) >= 0.0001 && ((!isInverted && point.left < 0) || (isInverted && point.left > 0))}
      <div
        class="txcm-barChartBar txcm-barChartBar-left"
        style="--valueScale: {leftValue}%;" />
    {/if}
    {#if !!point.right && Math.abs(point.right / 10000) >= 0.0001 && ((!isInverted && point.right < 0) || (isInverted && point.right > 0))}
      <div
        class="txcm-barChartBar txcm-barChartBar-right"
        style="--valueScale: {rightValue}%;" />
    {/if}
</div>
