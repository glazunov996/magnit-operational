<script>
  import { renderDynamicsClass, renderArrowDynamicsClass } from 'utilities/indicator';

  export let dynamics;
</script>

<div
  class={renderArrowDynamicsClass('txcm-sliceValue', dynamics)}>
    <svg
      class={renderArrowDynamicsClass('txcm-sliceValueIcon', dynamics)}>
        <use
          xlink:href="#txspt-icons-fatArrow" />
    </svg>
    <slot />
</div>
