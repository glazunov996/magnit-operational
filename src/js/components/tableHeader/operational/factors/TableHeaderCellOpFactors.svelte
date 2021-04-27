<script>
  import { getDashboardState } from 'state/dashboard';
  import { renderPreciseCellDate } from 'utilities/date';
  import { getUIState } from 'state/ui';
  import TableHeaderCell from 'components/tableHeader/TableHeaderCell.svelte';
  import Int from 'components/core/internationalization/Int.svelte';

  export let indicator;
  export let inflationText;

  const datePoP = getDashboardState('datePoP');
  const datePrecision = getDashboardState('datePrecision');
  const locale = getUIState('locale');

  $: label = renderPreciseCellDate($datePoP, $datePrecision, $locale);

</script>

<TableHeaderCell>
  <slot />
  <div
    class="txcm-tableHeaderCellWideColumn">
      <span>
        <Int key="∆ (ppt)"/>
      </span>
      <span style="margin-top: -4px;">
        {label}
      </span>      
  </div>  
  {#if indicator.id === '20'}
    <div
      class="txcm-tableHeaderCellWideColumn">
        <Int key={inflationText}/><br>
    </div>
  {/if}
</TableHeaderCell>
