<script>
  import { tick } from 'svelte';
  import { tooltip } from 'utilities/tooltip';
  import { renderPointX, renderPointY } from 'utilities/graph';
  import ComboBarTooltip from 'components/comboBarGraph/ComboBarTooltip.svelte';
  
  export let data;
  export let index;
  export let min;
  export let max;
  export let count;
  export let shift;
  export let height;
  export let padding;

  let bars = [];
  let colors = ['#57599C', '#F4C856', '#E36735', '#5D86C0', '#9D4B99', '#5BAFD4']
  let tooltipOptions;

  $: transform = calculateTransform(shift);
  $: calculatePosition(data || 0, min, max, count);
  $: updateTooltip(data);  

  async function clearBars() {
    bars = [];
    await tick();
  }

  async function calculatePosition() {
    await clearBars();
    const x = renderPointX(index, count, 6 / 20);
    const mid = renderPointY(0, min, max, height, padding);
    bars = data.map(item => {
      const y = renderPointY(item.point || 0, min, max, height, padding);
      return item.point ? {          
        x: x, 
        y: item.point > 0 ? y : mid, 
        height: item.point > 0 ? mid - y : y - mid,
        color: colors[item.index - 1],
      } : null
    })
  }

  function calculateTransform() {
    return `translate(${shift} 0)`;
  }

  function updateTooltipData() {    
    if (!data) return null;
    return data.slice().sort((a, b) => a.index - b.index);
  }

  function updateTooltip() {
    tooltipOptions = {
      content: {
        component: ComboBarTooltip,
        data: updateTooltipData(),
      },
      side: 'left',
    };
  }
  
</script>

<g use:tooltip={tooltipOptions}>
  {#each bars as bar}
    {#if bar !== null}
      <rect
        class="txcm-comboBar"
        x={bar.x}
        y={bar.y}
        width={15}
        height={bar.height}
        style="--theme-color: {bar.color}"
        {transform} />
    {/if}
  {/each}
</g>
