<script>
  import Int from 'components/core/internationalization/Int.svelte';
  import { renderID } from 'utilities/render';

  export let label;
  export let value;
  export let selected;

  const htmlID = renderID('graphMode', value);
</script>

<input
  class="txcm-graphModeInput"
  type="radio"
  bind:group={selected}
  id={htmlID}
  {value}>
<label
  class="txcm-graphModeControl"
  for={htmlID}>
    <Int
      key={label} />
</label>
