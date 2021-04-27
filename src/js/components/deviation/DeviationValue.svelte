<script>
  import { renderDynamicsClass } from 'utilities/indicator';

  export let dynamics = 0;
</script>

<div
  class={renderDynamicsClass('txcm-deviationValue', dynamics)}>
    <slot />
</div>
