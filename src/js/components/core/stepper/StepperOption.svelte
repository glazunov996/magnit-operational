<script>
  import Int from 'components/core/internationalization/Int.svelte';

  export let pick;
  export let value;
  export let name;
  export let index;
  export let label;
  export let disabled = false;
  export let cancel;

  const id = `${name}-${index}`;

  function onLabelClick(event) {
    if (cancel && pick === value) {
      event.preventDefault();
      pick = null;
    }
  }
</script>

<li
  class="txcm-stepperOption">
    <input
      class="txcm-stepperInput"
      type="radio"
      bind:group={pick}
      {name}
      {id}
      {value}
      {disabled}>
    <label
      class="txcm-stepperLabel"
      for={id}
      on:click={onLabelClick}>
        <Int
          key={label} />
    </label>
</li>
