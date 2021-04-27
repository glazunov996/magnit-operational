<script>
  import ComboBarGraphExtAxes from './ComboBarGraphExtAxes.svelte';
  import ComboBarGraphExtLabels from './ComboBarGraphExtLabels.svelte';
  import ComboBarGraphExtLegends from './ComboBarGraphExtLegends.svelte';
  import ComboBarsGraphExtBars from './ComboBarsGraphExtBars.svelte';
  import { getGraphsState } from 'state/graphs';

  const DEFAULT_HEIGHT = 400;
  const DEFAULT_PADDING = 40;

  const scroll = getGraphsState('scroll');
  const scrollMax = getGraphsState('scrollMax');

  export let indicator;
  export let step;
  export let count;
  export let shift;
  export let data
  export let units;

  let height = DEFAULT_HEIGHT;  
  let min;
  let max;
  let div;
  let points = []
  let fragment;

  let pointer = null;
  let pointerPositionStart;
  let pointerScrollStart;
  let pointerPositionCurrent;

  $: calculateLimits(data);
  $: updateCharts(data, step, count);

  function calculateLimits() {
    if (data.length === 0) return;
    const values = data.reduce((result, item, index) => {
      item.data.forEach(item => item.data && result.push(Math.abs(item.data)))
      return result;
    }, [])
    if (values && values.length) {
      max = Math.max(...values);
      div = Math.round(max * 100 / 4)
      min = -max;
    } else {
      min = -1;
      div = 1;
      max = 1;
    }
  }

  function sortBars(a, b) {
    return Math.abs(b.point) - Math.abs(a.point)
  }

  function zipPoints() {
    if (data.length === 0) return;
    return data[0].data.reduce((result, item, index) => {      
      const bars = []
      for (let i = 0; i < 6; ++i) {
        const bar = {
          index: i + 1, 
          point: data[i] && data[i].data[index].data !== null && !isNaN(data[i].data[index].data) ? data[i].data[index].data : null
        }
        bars.push(bar)
      }
      bars.sort(sortBars)
      result.push(bars)
      return result;
    }, [])
  }

  async function updateCharts() {
    if (data.length === 0) return;
    const { length } = data[0];
    if (!fragment)
      fragment = zipPoints();
    if (length <= count)
      points = fragment.slice();
    else
      points = fragment.slice(step, (step + count + 1));
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

<ComboBarGraphExtLabels
  {max}
  {min}
  {div}
/>
<div
  class="txcm-comboBarGraphExt"
  on:click|preventDefault|stopPropagation
  on:mousedown|stopPropagation|preventDefault={onPointerDown}
  on:touchstart|stopPropagation|preventDefault={onPointerDown}
>
  <svg
    class="txcm-comboBarGraph"
    width="100%"
    {height}>
    <ComboBarGraphExtAxes />
    <ComboBarsGraphExtBars 
      {count}
      {shift}
      height={DEFAULT_HEIGHT}
      padding={DEFAULT_PADDING}
      {min}
      {max}
      {points}
    />
  </svg>
  <ComboBarGraphExtLegends />
  <slot />
</div>