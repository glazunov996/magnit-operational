<script>
  import { getContext } from 'svelte';
  import { getDashboardState } from 'state/dashboard';
  import { renderPreciseTableDate, renderPreciseCellDate } from 'utilities/date';
  import ColumnOptions from 'components/columnOptions/ColumnOptions.svelte';
  import TableHeader from 'components/tableHeader/TableHeader.svelte';
  import TableHeaderCellFinancialFactors from './TableHeaderCellFinFactors.svelte';

  const appConfig = getContext('app').getAppConfig();
  const { dateMax } = appConfig;
  const date = getDashboardState('date');
  const datePoP = getDashboardState('datePoP');
  const datePrecision = getDashboardState('datePrecision');

  $: label = renderPreciseTableDate($date, $datePrecision);
  $: column1Date = renderPreciseCellDate($datePoP, $datePrecision, dateMax);
  $: column2Date = renderPreciseCellDate($datePoP, $datePrecision, dateMax);
</script>

<TableHeader
  detail="factors">
    <TableHeaderCellFinancialFactors
      date={column1Date}>
        <div
          class="txcm-tableHeaderCellLabel">
            {label}
            <div
              class="txcm-tableHeaderCellLabelNote">
                % от выр.
            </div>
        </div>
    </TableHeaderCellFinancialFactors>
    <TableHeaderCellFinancialFactors
      date={column2Date}>
        <div
          class="txcm-tableHeaderCellLabel">
            <ColumnOptions />
            <div
              class="txcm-tableHeaderCellLabelNote">
                % от выр.
            </div>
        </div>
    </TableHeaderCellFinancialFactors>
</TableHeader>
