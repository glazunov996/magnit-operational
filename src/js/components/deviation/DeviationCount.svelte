<script>
  import DeviationHint from './DeviationHint.svelte';
  import { tooltip } from 'utilities/tooltip';

  export let value;

  const tooltipOptions = {
    content: {
      component: DeviationHint,
      data: 'Количество отклонений',
    },
    side: 'right',
    theme: 'txcm-tooltip-deviationHint',
  };
</script>

<div
  use:tooltip={tooltipOptions}
  class="txcm-deviationCount"
  data-count={value}>
</div>
