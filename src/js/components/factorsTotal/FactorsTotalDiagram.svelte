<script>
  import { checkDynamics } from 'utilities/indicator';
  import FactorsTotalValue from './FactorsTotalValue.svelte';

  export let data;
  export let baseRatio;
  export let minRatio;
  export let value;

  let base;
  let comparison;
  let ratio;
  let width;
  let shift = 0;  

  $: updateValues(data, baseRatio);

  function renderDynamicsClass() {
    [ base, comparison ] = data;
    const dynamics = checkDynamics(comparison);
    if (dynamics === -2) return ' txcm-factorsTotalDiagramRectBase-is-decreasing';
    return '';
  }

  function updateValues() {
    if (data) {
      [ base, comparison ] = data;      
      width = Math.abs(comparison * baseRatio) * 100
      shift = minRatio * 100;
    }
  }
</script>

<div
  class="txcm-factorsTotalDiagram">
    {#if value}
      <div style="position:absolute; right: 0px;">
        <FactorsTotalValue>
          {value}
        </FactorsTotalValue>
      </div>
    {/if}
    {#if data}
      <svg
        width="100%"
        height="19"
        class="txcm-factorsTotalDiagramSVG">
          <rect
            class={`txcm-factorsTotalDiagramRectBase${renderDynamicsClass(data)}`}
            x={`${shift}%`}
            y="0"
            width={`${width}%`}
            height="100%"
            rx="3"
            ry="3" />
      </svg>
    {/if}
</div>
