<script>
  import { getDashboardState } from 'state/dashboard';
  import { checkDynamics, renderDynamicsClass } from 'utilities/indicator';
  import FactorsComparisonValue from './FactorsComparisonValue.svelte';
  import formatLabel from 'utilities/formatLabel'
  
  
  export let data;
  export let bridge;
  export let baseRatio;
  export let minRatio;
  export let value;
  export let dynamics;

  const RECT = {
    y: 0,
    height: '100%',
    rx: 3,
    ry: 3,
  };

  let base;
  let comparison;
  let baseWidth;
  let baseShift = 0;
  let width;
  let shift = 0;

  $: calculateValues(data, bridge, baseRatio);

  function calculateValues() {
    if (data) {
      [ base, comparison ] = data;
      const value = base - comparison;
      if (comparison >= 0) {
        if (value >= 0) {
          baseShift = 0;
          baseWidth = Math.abs(base) * baseRatio * 100;
          shift = (Math.abs(comparison) * baseRatio * 100);
          width = Math.abs(base - comparison) * baseRatio * 100;
        } else {
          width = Math.abs(base - comparison) * baseRatio * 100;
          baseWidth = Math.abs(comparison) * baseRatio * 100;
          shift = baseWidth - width;
        }
      } else {
        if (value >= 0) {
          baseShift = 0;
          baseWidth = Math.abs(base) * baseRatio * 100;
          width = Math.abs(base - comparison) * baseRatio * 100;
        } else {
          width = Math.abs(base - comparison) * baseRatio * 100;
          baseWidth = Math.abs(base) * baseRatio * 100;
          baseShift = -baseWidth + (Math.abs(comparison) * baseRatio * 100);
          shift = baseShift;          
        }
      }
    }
  }

</script>

<div
  class="txcm-factorsTotalDiagram">
    {#if value}
      <div style="position:absolute; right: 0px;">
        <FactorsComparisonValue {dynamics}>
          {value}
        </FactorsComparisonValue>
      </div>
    {/if}
    {#if data}
      <svg
        class="txcm-factorsTotalDiagramSVG"
        width="100%"
        height="19">
          <rect
            class="txcm-factorsTotalDiagramRectBase"
            x={`${minRatio * 100 + baseShift}%`}
            width={`${baseWidth}%`} 
            {...RECT} />
            {#if bridge.qNum !== 0}
              <rect
                class={renderDynamicsClass('txcm-factorsTotalDiagramRectBase', checkDynamics(bridge.qNum))}
                {...RECT}
                x={`${minRatio * 100 + shift}%`}
                width={`${width}%`} />
            {/if}
      </svg>
      <div
        class="txcm-factorsTotalDiagramDiff">
          {formatLabel(bridge.qNum, bridge.units)}
      </div>
    {/if}
</div>
