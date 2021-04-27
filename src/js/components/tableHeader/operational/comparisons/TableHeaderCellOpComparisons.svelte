<script>
  import { getDashboardState } from 'state/dashboard';
  import { getUIState } from 'state/ui';
  import { renderPreciseCellDate } from 'utilities/date';
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
      <Int key="% от выр."/><br>
      <Int key="млн. руб"/>
  </div>
  <div
    class="txcm-tableHeaderCellColumn">
      <Int key="∆ (ppt)"/><br>
      {label}
  </div>
  <div
    class="txcm-tableHeaderCellColumn">
      <Int key="∆ (ppt)"/><br>
      <Int key="от план"/><br>
  </div>
</TableHeaderCell>
