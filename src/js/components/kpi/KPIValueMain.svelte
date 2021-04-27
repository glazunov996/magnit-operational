<script context="module">
  /* eslint  unicorn/filename-case: 'off' */

  function isHighlighted(units, valueUnits) {
    return units === valueUnits;
  }
</script>

<script>
  import { renderArrowDynamicsClass } from 'utilities/indicator';
  import DeviationHint from '../deviation/DeviationHint.svelte';
  import { tooltip } from 'utilities/tooltip';

  const tooltipOptions = {
    content: {
      component: DeviationHint,
      data: 'Тренд относительно прошлого периода',
    },
    side: 'right',
    theme: 'txcm-tooltip-deviationHint',
  };

  export let units;
  export let valueUnits;
  export let dynamics;
</script>

<div
  class="txcm-kpiValue"
  class:txcm-kpiValue-is-highlighted={isHighlighted(units, valueUnits)}>
    <svg
      use:tooltip={tooltipOptions}
      class={renderArrowDynamicsClass('txcm-kpiValueIcon', dynamics)}>
        <use
          xlink:href="#txspt-icons-fatArrow" />
    </svg>
    <slot />
</div>
