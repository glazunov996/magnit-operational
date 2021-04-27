<script>
  import { renderDynamicsClass } from 'utilities/indicator';

  export let dynamics;
</script>

<div
  class="txcm-factorsTotalValue">
    <svg
      class={renderDynamicsClass('txcm-factorsTotalValueIcon', dynamics)}>
        <use
          xlink:href="#txspt-icons-fatArrow" />
    </svg>
    <slot />
</div>
