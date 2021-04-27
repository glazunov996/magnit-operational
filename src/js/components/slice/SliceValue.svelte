<script>
  import SliceValueMain from './SliceValueMain.svelte';
  import SliceValueAdd from './SliceValueAdd.svelte';

  export let dynamics = false;
  export let status = false;

  function pickValueType() {
    if (status) return SliceValueMain;
    return SliceValueAdd;
  }
</script>

<svelte:component
  {dynamics}
  this={pickValueType(status)}>
    <slot />
</svelte:component>
