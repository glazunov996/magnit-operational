<script>
  /* eslint  unicorn/filename-case: 'off' */

  import { renderDynamicsClass } from 'utilities/indicator';

  export let dynamics;
</script>

<div
  class={renderDynamicsClass('txcm-kpiValueAdd', dynamics)}>
    <slot />
</div>
