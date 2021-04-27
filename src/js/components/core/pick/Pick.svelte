<script>
  import Int from 'components/core/internationalization/Int.svelte';

  export let pick;
  export let name;
  export let value;
  export let label;
  export let disabled = false;
  export let theme = '';

  function onPickChange() {
    if (!pick) pick = value;
    else pick = null;
  }
</script>

<input
  class="txcm-pickInput"
  type="checkbox"
  id={name}
  checked={pick}
  {disabled}
  on:change={onPickChange}>
<label
  class={`txcm-pick ${theme}`}
  for={name}>
    <Int
      key={label} />
</label>
