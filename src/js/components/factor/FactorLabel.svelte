<script>
  import Int from 'components/core/internationalization/Int.svelte';

  export let label;
</script>

<div
  class="txcm-factorLabel">
    <Int
      key={label} />
</div>
