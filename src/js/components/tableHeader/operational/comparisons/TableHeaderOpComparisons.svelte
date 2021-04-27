<script>
  import { getDashboardState } from 'state/dashboard';
  import { renderPreciseTableDate } from 'utilities/date';
  import ColumnOptions from 'components/columnOptions/ColumnOptions.svelte';
  import GraphOptions from 'components/graphOptions/GraphOptions.svelte';
  import GraphHeader from 'components/graphHeader/GraphHeader.svelte';
  import TableHeader from 'components/tableHeader/TableHeader.svelte';
  import TableHeaderGraph from 'components/tableHeader/TableHeaderGraph.svelte';
  import TableHeaderCellOperationalComparisons from './TableHeaderCellOpComparisons.svelte';

  const date = getDashboardState('date');
  const datePrecision = getDashboardState('datePrecision');

  $: label = renderPreciseTableDate($date, $datePrecision);
</script>

<TableHeader>
  <TableHeaderCellOperationalComparisons>
    <div
      class="txcm-tableHeaderCellLabel">
        {label}
    </div>
  </TableHeaderCellOperationalComparisons>
  <TableHeaderCellOperationalComparisons>
    <div
      class="txcm-tableHeaderCellLabel">
        <ColumnOptions />
    </div>
  </TableHeaderCellOperationalComparisons>
  <TableHeaderGraph>
    <GraphOptions />
    <GraphHeader />
  </TableHeaderGraph>
</TableHeader>
