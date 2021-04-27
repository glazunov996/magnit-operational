<script>
  import { getContext } from 'svelte';
  import { getDashboardState } from 'state/dashboard';
  import { renderPreciseTableMonth, renderPreciseCellDate, renderPreciseCellMonth } from 'utilities/date';
  import ColumnOptions from 'components/columnOptions/ColumnOptions.svelte';
  import GraphOptions from 'components/graphOptions/GraphOptions.svelte';
  import GraphHeader from 'components/graphHeader/GraphHeader.svelte';
  import TableHeader from 'components/tableHeader/TableHeader.svelte';
  import TableHeaderGraph from 'components/tableHeader/TableHeaderGraph.svelte';
  import TableHeaderCellFinancialOverview from './TableHeaderCellFinOverview.svelte';

  const appConfig = getContext('app').getAppConfig();
  const { dateMax } = appConfig;
  const date = getDashboardState('date');
  const datePoP = getDashboardState('datePoP');
  const datePrecision = getDashboardState('datePrecision');

  $: label = renderPreciseTableMonth($date, $datePrecision, dateMax);
  $: column1Date = renderPreciseCellMonth($datePoP, $datePrecision, dateMax);
  $: column2Date = renderPreciseCellDate($datePoP, $datePrecision, dateMax);
</script>

<TableHeader>
  <TableHeaderCellFinancialOverview
    date={column1Date}>
      <div
        class="txcm-tableHeaderCellLabel">
          {label}
      </div>
  </TableHeaderCellFinancialOverview>
  <TableHeaderCellFinancialOverview
    date={column2Date}>
      <div
        class="txcm-tableHeaderCellLabel">
          <ColumnOptions />
      </div>
  </TableHeaderCellFinancialOverview>
  <TableHeaderGraph>
    <GraphOptions />
    <GraphHeader />
  </TableHeaderGraph>
</TableHeader>
