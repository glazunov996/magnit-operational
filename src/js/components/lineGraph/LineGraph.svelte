<script>
  import LineGraphAxes from './LineGraphAxes.svelte';
  import LineGraphPoints from './LineGraphPoints.svelte';
  import LineGraphSegments from './LineGraphSegments.svelte';
  import LineGraphLabels from './LineGraphLabels.svelte';
  import { getUIState } from 'state/ui';
  import { getGraphsState } from 'state/graphs';

  const DEFAULT_HEIGHT = 82;
  const DEFAULT_COMPACT_HEIGHT = 56;
  const DEFAULT_PADDING = 10;

  const scroll = getGraphsState('scroll');
  const scrollMax = getGraphsState('scrollMax');

  export let indicator;
  export let data;
  export let step;
  export let count;
  export let shift;
  export let padding = DEFAULT_PADDING;
  export let isCompact = false;
  export let units;

  let points = [];
  let segments = [];
  let min;
  let minLabel;
  let max;
  let maxLabel;

  let pointer = null;
  let pointerPositionStart;
  let pointerScrollStart;
  let pointerPositionCurrent;

  const locale = getUIState('locale');

  $: height = isCompact ? DEFAULT_COMPACT_HEIGHT : DEFAULT_HEIGHT;
  $: calculateLimits(data);
  $: updateLines(data, step, count, $locale);

  function normalizeValue(option) {
    return option.data;
  }

  function calculateLimits() {
    if (data.length === 0) return;
    const values = data[0].data.map(normalizeValue).filter(item => item !== null && !isNaN(item));
    if (values && data[0].data && data[0].data.length > 0) {
      const minRaw = Math.min(...values);
      const maxRaw = Math.max(...values);
      min = Math.round(minRaw * 10000) / 10000;
      max = Math.round(maxRaw * 10000) / 10000;
      minLabel = (data[0].data.find(option => option.data === minRaw) || {}).text || '0.00%';
      maxLabel = (data[0].data.find(option => option.data === maxRaw) || {}).text || '1.00%';
    } else {
      min = 0;
      max = 1;
      minLabel = '0.00%';
      maxLabel = '1.00%';
    }
  }

  function zipPoints() {
    return data[0].data.map((point, index) => ({
      point: point.data && !isNaN(point.data) ? point.data : null,
      name: point.name,
      year: parseInt(point.name.slice(0, 4)),
      month: parseInt(point.name.slice(4, 6)),
      day: parseInt(point.name.slice(6, 8)),
      fact: point.text,
      vsPp: data[1] ? (data[1].data[index].data !== 0 && data[1].data[index].data !== null ? data[1].data[index].text || '-'  : '-') : '-',
      vsPpPercent: data[2] ? (data[2].data[index].data !== 0 && data[2].data[index].data !== null ? data[2].data[index].text || '-'  : '-') : '-',
      vsBudget: data[3] ? (data[3].data[index].data !== 0 && data[3].data[index].data !== null ?  data[3].data[index].text || '-'  : '-') : '-',
      vsBudgetPercent: data[4] ? (data[4].data[index].data !== 0 && data[4].data[index].data !== null ?  data[4].data[index].text || '-'  : '-') : '-',
      deviations: data.length > 3 ? (
        data[0].data[index].data !== null 
        && data[3].data[index].data !== null
        && data[3].data[index].data > data[0].data[index].data) : undefined,
    }));
  }

  function updateLines() {
    if (data.length === 0) return;
    const [ { length } ] = data;
    const fragment = zipPoints();
    if (length <= count) {
      points = fragment.slice();
      segments = [null, ...fragment];
    } else {
      points = fragment.slice(step, (step + count + 1));
      const newSegments = [...points];
      newSegments.unshift(fragment[step - 1] || null);
      newSegments.push(fragment[step + count + 1] || null);
      segments = newSegments;
    }
  }

  function changeScroll(deltaX) {
    if ((pointerScrollStart + deltaX) <= 0) $scroll = 0;
    else if ((pointerScrollStart + deltaX) >= $scrollMax) $scroll = $scrollMax;
    else $scroll = pointerScrollStart + deltaX;
  }

  function onPointerMove(event) {
    pointerPositionCurrent = event.touches ? event.touches[0].clientX : event.clientX;
    const diff = pointerPositionStart - pointerPositionCurrent;
    changeScroll(diff);
  }

  function onPointerUp(event) {
    event.preventDefault();
    event.stopPropagation();
    unsubscribeWindow();
  }

  function subscribeWindow() {
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('touchmove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
    window.addEventListener('touchend', onPointerUp);
  }

  function unsubscribeWindow() {
    window.removeEventListener('mousemove', onPointerMove);
    window.removeEventListener('touchmove', onPointerMove);
    window.removeEventListener('mouseup', onPointerUp);
    window.removeEventListener('touchend', onPointerUp);
  }

  function onPointerDown(event) {
    pointerPositionStart = event.touches ? event.touches[0].clientX : event.clientX;
    pointerScrollStart = $scroll;
    subscribeWindow();
  }

</script>

<LineGraphLabels
  {units}
  {min}
  {max}
  {minLabel}
  {maxLabel}
  {indicator}
  {isCompact} />
<div
  class="txcm-lineGraphHolder"
  on:click|preventDefault|stopPropagation
  on:mousedown|stopPropagation|preventDefault={onPointerDown}
  on:touchstart|stopPropagation|preventDefault={onPointerDown}
  >
    <svg
      class="txcm-lineGraph"
      class:txcm-lineGraph-is-compact={isCompact}
      width="100%"
      height={height}>
        <LineGraphAxes
          {padding} />
        <LineGraphSegments
          {count}
          {shift}
          {height}
          {padding}
          {min}
          {max}
          {segments} />
        <LineGraphPoints
          {count}
          {shift}
          {height}
          {padding}
          {min}
          {max}
          {points} />
    </svg>
</div>
