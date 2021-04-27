<script>
  import { tooltip } from 'utilities/tooltip';
  import { renderPointX, renderPointY } from 'utilities/graph';
  import GraphTooltip from 'components/graphTooltip/GraphTooltip.svelte';

  const DEFAULT_RADIUS = 2.5;
  const DUMMY_QUOTIENT = 7;

  export let data;
  export let index;
  export let min;
  export let max;
  export let count;
  export let shift;
  export let height;
  export let padding;

  const r = DEFAULT_RADIUS;

  let cx;
  let cy;
  let tooltipOptions;

  $: transform = calculateTransform(shift);
  $: calculatePosition(data.point || 0, min, max, count);
  $: updateTooltip(data);

  function shouldDrawPoint() {
    return data.point !== null;
  }

  function updateTooltipData() {
    if (!data) return null;
    return data;
  }

  function updateTooltip() {
    tooltipOptions = {
      content: {
        component: GraphTooltip,
        data: updateTooltipData(),
      },
      side: 'left',
    };
  }

  function calculatePosition() {
    cx = renderPointX(index, count);
    cy = renderPointY(data.point || 0, min, max, height, padding);
  }

  function calculateTransform() {
    return `translate(${shift} 0)`;
  }

</script>

{#if shouldDrawPoint(data)}
  <g
    class="txcm-lineGraphPointGroup"
    use:tooltip={tooltipOptions}>
      <circle
        class="txcm-lineGraphPointDummy"
        r={r * DUMMY_QUOTIENT}
        {cx}
        {cy}
        {transform} />
      <circle
        class="txcm-lineGraphPoint"
        class:txcm-lineGraphPoint-has-deviations={data.deviations}
        class:txcm-lineGraphPoint-no-budget={data.vsBudget === '-'}
        {r}
        {cx}
        {cy}
        {transform} />
  </g>
{/if}
