<script>
  import Int from 'components/core/internationalization/Int.svelte';

  export let label = null;
  export let hasIndicators = false;

</script>

{#if hasIndicators}
  <div class="txcm-kpiLabel-is-small" style="margin-left: 32px">
    <span class="txcm-kpiText" style="font-weight: 600" >
      <Int key={label} />
    </span>
  </div>
  <slot />
{/if}