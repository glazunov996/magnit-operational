<script>
  import Int from 'components/core/internationalization/Int.svelte';

  export let extended;
  export let extend;

  function handleClick() {
    extended = !extended;
  }

</script>

<div 
  class="txcm-comboBarShowLabel"
  class:txcm-comboBarShowLabel-extended={extend}
>  
  <div class="txcm-comboBarShowLabelText" on:click={handleClick}>
    <svg
      class="txcm-comboBarShowLabelIcon"
      class:txcm-comboBarShowLabelIcon-extended={extend}>
        <use
          xlink:href="#txspt-icons-angleArrow" />
    </svg>
    {#if !extend}
      <Int key="Раскрыть структуру чека"></Int>
    {:else}
      <Int key="Скрыть структуру чека"></Int>
    {/if}
  </div>  
</div>