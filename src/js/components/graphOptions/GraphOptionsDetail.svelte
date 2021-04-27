<script>
  import { renderID } from 'utilities/render';
  import { tooltip } from 'utilities/tooltip';
  import Int from 'components/core/internationalization/Int.svelte';
  import GraphOptionsDetailTooltip from './GraphOptionsDetailTooltip.svelte';

  export let label;
  export let subLabel;
  export let value;
  export let selected;

  const htmlID = renderID('graphDetail', value);
  const tooltipOptions = {
    content: {
      component: GraphOptionsDetailTooltip,
      data: subLabel,
    },
    side: 'bottom',
    theme: 'txcm-tooltip-graphDetail',
  };
</script>

<input
  class="txcm-graphDetailInput"
  type="radio"
  bind:group={selected}
  id={htmlID}
  {value}>
<label
  class="txcm-graphDetailControl"
  for={htmlID}
  use:tooltip={tooltipOptions}>
    <Int
      key={label} />
</label>
