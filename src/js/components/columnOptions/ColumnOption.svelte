<script>
  import { renderID } from 'utilities/render';

  export let label;
  export let value;
  export let selected;

  const htmlID = renderID('columnOptionToggle', value);

  $: checked = selected === value;
</script>

<input
  class="txcm-columnOptionInput"
  type="radio"
  bind:group={selected}
  id={htmlID}
  {value}>
<label
  class="txcm-columnOptionControl"
  for={htmlID}>
    {label}
</label>
