<script>
  import { renderID } from 'utilities/render';
  import Int from 'components/core/internationalization/Int.svelte';

  export let pick = [];
  export let name;
  export let options = [];
  export let disabled = false;
</script>

{#each options as option, index}
  <input
    class="txcm-pickInput"
    type="checkbox"
    id={renderID(name, index)}
    disabled={disabled || option.disabled}
    bind:group={pick}
    value={option.value}>
  <label
    class='txcm-pick'
    for={renderID(name, index)}>
      <Int
        key={option.label} />
  </label>
{/each}
