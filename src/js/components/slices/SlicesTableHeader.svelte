<script>
  import { getUIState } from 'state/ui';
  import TableHeaderFinancialOverview from 'components/tableHeader/financial/overview/TableHeaderFinOverview.svelte';
  import TableHeaderOperationalOverview from 'components/tableHeader/operational/overview/TableHeaderOpOverview.svelte';

  const TABLE_HEADERS = {
    financial: TableHeaderFinancialOverview,
    operational: TableHeaderOperationalOverview,
  };

  export let dashboard;
  export let indicator;

  let props;

  const sectionScrollX = getUIState('sectionScrollX');

  let node;

  $: updateScroll($sectionScrollX);
  $: updateProps(indicator);

  function updateProps() {
    props = { indicator: indicator }
  }

  function pickHeader() {
    if (TABLE_HEADERS[dashboard]) return TABLE_HEADERS[dashboard];
    return TABLE_HEADERS.financial;
  }

  function updateScroll() {
    if (node) node.scrollLeft = $sectionScrollX;
  }
</script>

<div
  bind:this={node}
  class="txcm-slicesHeader">
    <svelte:component
      this={pickHeader(dashboard)} {...props} />
</div>
