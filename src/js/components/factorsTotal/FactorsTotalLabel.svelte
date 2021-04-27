<script>
  import Int from 'components/core/internationalization/Int.svelte';

  export let label;
</script>

<div
  class="txcm-factorsTotalLabel">
    <Int
      key={label} />
</div>
