<script>
  import { getDashboardState } from 'state/dashboard';
  import { renderPreciseCellDate } from 'utilities/date';
  import { getUIState } from 'state/ui';
  import TableHeaderCell from 'components/tableHeader/TableHeaderCell.svelte';
  import Int from 'components/core/internationalization/Int.svelte';

  const datePoP = getDashboardState('datePoP');
  const datePrecision = getDashboardState('datePrecision');
  const locale = getUIState('locale');

  $: label = renderPreciseCellDate($datePoP, $datePrecision, $locale);
</script>

<TableHeaderCell>
  <slot />
  <div
    class="txcm-tableHeaderCellColumn">
      <span>
        <Int key="∆ от"/>
      </span>
      <span style="margin-top: -4px;">
        {label}
      </span>      
  </div>
  <div
    class="txcm-tableHeaderCellColumn">
      <span>
        <Int key="∆ от"/>
      </span>      
      <span style="margin-top: -4px;">
        <Int key="плана"/>
      </span>
      
  </div>
</TableHeaderCell>
