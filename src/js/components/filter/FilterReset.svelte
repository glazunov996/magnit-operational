<script>
  import Int from 'components/core/internationalization/Int.svelte';
  import { updateFilter } from 'state/filter';

  export let config;
  export let disabled;

  $: defaults = flattenConfig(config);

  function flattenGroup(group) {
    return group.reduce((result, option) => ({ ...result, [option.data.name]: option.data.pick }), {});
  }

  function flattenConfig() {
    return config.reduce((result, group) => ({ ...result, ...flattenGroup(group.options) }), {});
  }

  function dropFilter() {
    updateFilter(defaults);
  }

  function onClick() {
    dropFilter();
  }
</script>

<button
  class="txcm-filterReset"
  on:click|preventDefault={onClick}
  {disabled}>
    <Int
      key="Сбросить" />
</button>
