<script>
  import Int from 'components/core/internationalization/Int.svelte';
  import { updateComparisonIndicators } from 'state/comparisonIndicators';

  export let data;

  function onCancelClick() {
    updateComparisonIndicators({ [data.id]: false });
  }
</script>

<div
  class="txcm-comparisonLabel">
    <span
      class="txcm-comparisonText">
        <Int
          key={data.label} />
    </span>
    {#if data.units}
      <span
        class="txcm-comparisonUnits">
          {data.units}
      </span>
    {/if}
    <button
      class="txcm-comparisonCancel"
      on:click={onCancelClick}>
        <Int
          key="Убрать показатель" />
    </button>
</div>
