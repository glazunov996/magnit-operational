<script>
  import { renderDynamicsClass } from 'utilities/indicator';

  export let dynamics;
</script>

<div
  class={renderDynamicsClass('txcm-comparisonValueAdd', dynamics)}>
    <slot />
</div>
