<script>
  import Int from 'components/core/internationalization/Int.svelte';

  export let indicator
</script>

<div
  class="txcm-factorsLabel"
>
  <Int key={indicator.label} />
</div>