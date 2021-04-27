<script>
  import Int from '../core/internationalization/Int.svelte';
  import GraphKindOptionsDetails from './GraphKindOptionsDetails.svelte';
  import GraphOptionsDetails from './GraphOptionsDetails.svelte';
  import { getGraphsState } from 'state/graphs';

  export let indicator;

</script>

<div
  class="txcm-graphOptions"
  class:txcm-graphOptions-is-kind={indicator && indicator.id == '5'}
  >
    {#if !indicator || indicator.id != '5'}
      <div class="txcm-tableHeaderCellLabel">YoY</div>
    {/if}
    {#if indicator && indicator.id == '5'}
      <GraphKindOptionsDetails {indicator} />
    {/if}
    <GraphOptionsDetails {indicator} />
</div>
