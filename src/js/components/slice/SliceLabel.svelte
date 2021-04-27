<script>
  import Int from 'components/core/internationalization/Int.svelte';

  export let label;
</script>

<div
  class="txcm-sliceLabel">
    <Int
      key={label} />
</div>
