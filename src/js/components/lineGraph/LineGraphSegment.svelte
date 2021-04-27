<script>
  import { renderPointX, renderPointY } from 'utilities/graph';

  export let points;
  export let index;
  export let min;
  export let max;
  export let count;
  export let shift;
  export let height;
  export let padding;

  let x1;
  let y1;
  let x2;
  let y2;

  $: transform = calculateTransform(shift);
  $: calculatePosition(points, min, max, count);

  function shouldDrawPoint() {
    return points.every(point => point.point !== null);
  }

  function calculateX1() {
    return renderPointX(index - 1, count);
  }

  function calculateY1() {
    const [ { point } ] = points;
    const value = point || 0;
    return renderPointY(value, min, max, height, padding);
  }

  function calculateX2() {
    return renderPointX(index, count);
  }

  function calculateY2() {
    const [ , { point } ] = points;
    const value = point || 0;
    return renderPointY(value, min, max, height, padding);
  }

  function calculatePosition() {
    x1 = calculateX1();
    y1 = calculateY1();
    x2 = calculateX2();
    y2 = calculateY2();
  }

  function calculateTransform() {
    return `translate(${shift} 0)`;
  }

  function renderSegmentStatusClass() {
    if (points[0].vsBudget === '-' || points[1].vsBudget === '-') {
      return ' txcm-lineGraphSegment-no-budget';
    }

    if (points[0].deviations) {
      if (points[1].deviations) return ' txcm-lineGraphSegment-has-fullDeviations';
      return ' txcm-lineGraphSegment-has-leftDeviations';
    } else if (points[1].deviations) return ' txcm-lineGraphSegment-has-rightDeviations';
    return '';
  }
</script>

{#if shouldDrawPoint(points)}
  <line
    class={`txcm-lineGraphSegment${renderSegmentStatusClass(points)}`}
    {x1}
    {y1}
    {x2}
    {y2}
    {transform} />
{/if}
