<script context="module">
  function isHighlighted(units, valueUnits) {
    return units === valueUnits;
  }
</script>

<script>
  import { renderDynamicsClass } from 'utilities/indicator';

  export let units;
  export let valueUnits;
  export let dynamics;
</script>

<div
  class="txcm-comparisonValue"
  class:txcm-comparisonValue-is-highlighted={isHighlighted(units, valueUnits)}>
    <svg
      class={renderDynamicsClass('txcm-comparisonValueIcon', dynamics)}>
        <use
          xlink:href="#txspt-icons-fatArrow" />
    </svg>
    <slot />
</div>
