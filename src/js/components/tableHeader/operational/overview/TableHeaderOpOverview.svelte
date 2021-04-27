<script>
  import { getDashboardState } from 'state/dashboard';
  import { renderPreciseTableDate } from 'utilities/date';
  import ColumnOptions from 'components/columnOptions/ColumnOptions.svelte';
  import GraphOptions from 'components/graphOptions/GraphOptions.svelte';
  import GraphHeader from 'components/graphHeader/GraphHeader.svelte';
  import TableHeader from 'components/tableHeader/TableHeader.svelte';
  import TableHeaderGraph from 'components/tableHeader/TableHeaderGraph.svelte';
  import TableHeaderCellOpOverview from './TableHeaderCellOpOverview.svelte';
  import { getUIState } from 'state/ui';

  export let indicator;

  const locale = getUIState('locale');
  const date = getDashboardState('date');
  const datePrecision = getDashboardState('datePrecision');

  $: label = renderPreciseTableDate($date, $datePrecision, $locale);
</script>

<TableHeader>
  <TableHeaderCellOpOverview>
    <div
      class="txcm-tableHeaderCellLabel">
        {label}
    </div>
  </TableHeaderCellOpOverview>
  <TableHeaderCellOpOverview>
    <div
      class="txcm-tableHeaderCellLabel">
        <ColumnOptions />
    </div>
  </TableHeaderCellOpOverview>
  <TableHeaderGraph>
    <GraphOptions {indicator} />
    <GraphHeader />
  </TableHeaderGraph>
</TableHeader>
