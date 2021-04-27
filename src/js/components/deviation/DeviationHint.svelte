<script>
  import Int from 'components/core/internationalization/Int.svelte';
  
  export let data;
</script>

<span
  class="txcm-deviationHint">
  <Int key={data} />
</span>
