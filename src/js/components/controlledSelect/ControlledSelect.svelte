<script context="module">
  import ControlledSelectMultiple from './ControlledSelectMultiple.svelte';
  import ControlledSelectGroupedMultiple from './ControlledSelectGroupedMultiple.svelte';
  import ControlledSelectUnique from './ControlledSelectUnique.svelte';

  function pickComponent(multiple, grouped) {
    if (grouped) return ControlledSelectGroupedMultiple;
    if (multiple) return ControlledSelectMultiple;
    return ControlledSelectUnique;
  }

  function isMultiple(grouped, pick) {
    return grouped || Array.isArray(pick);
  }
</script>

<script>
  export let pick = [];
  export let label;
  export let name;
  export let options = [];
  export let grouped = false;
  export let theme = '';
  export let disabled = false;
  export let acceptLabel = 'Применить фильтр';

  const multiple = isMultiple(grouped, pick);

</script>

<svelte:component
  bind:pick
  {label}
  {name}
  {options}
  {theme}
  {multiple}
  {grouped}
  {disabled}
  {acceptLabel}
  this={pickComponent(multiple, grouped)} />
