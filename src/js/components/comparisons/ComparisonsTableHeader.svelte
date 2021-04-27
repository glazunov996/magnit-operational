<script>
  import { getUIState } from 'state/ui';
  import TableHeaderOpComparisons from 'components/tableHeader/operational/comparisons/TableHeaderOpComparisons.svelte';

  const sectionScrollX = getUIState('sectionScrollX');

  let node;

  $: updateScroll($sectionScrollX);

  function updateScroll() {
    if (node) node.scrollLeft = $sectionScrollX;
  }
</script>

<div
  bind:this={node}
  class="txcm-overviewHeader">
    <TableHeaderOpComparisons />
</div>
