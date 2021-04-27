<script>
  import { getDashboardState } from 'state/dashboard';
  import { renderPreciseTableDate } from 'utilities/date';
  import ColumnOptions from 'components/columnOptions/ColumnOptions.svelte';
  import TableHeader from 'components/tableHeader/TableHeader.svelte';
  import TableHeaderCellOperationalFactors from './TableHeaderCellOpFactors.svelte';
  import Int from 'components/core/internationalization/Int.svelte';
  import { getUIState } from 'state/ui';

  export let indicator;

  const locale = getUIState('locale');
  const date = getDashboardState('date');
  const datePrecision = getDashboardState('datePrecision');

  $: label = renderPreciseTableDate($date, $datePrecision, $locale);
</script>

<TableHeader
  detail="factors">
    <TableHeaderCellOperationalFactors {indicator} inflationText={'Вклад за счет маржинальности'}>
      <div
        class="txcm-tableHeaderCellLabel">
          {label}
          <div
            class="txcm-tableHeaderCellLabelNote">
              <Int key=""/>
          </div>
      </div>
    </TableHeaderCellOperationalFactors>
    <TableHeaderCellOperationalFactors {indicator} inflationText={'Вклад за счет маржинальности'}>
      <div
        class="txcm-tableHeaderCellLabel">
          <ColumnOptions />
          <div
            class="txcm-tableHeaderCellLabelNote">
              <Int key=""/>
          </div>
      </div>
    </TableHeaderCellOperationalFactors>
</TableHeader>
