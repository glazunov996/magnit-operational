<script>
  import { getUIState } from 'state/ui';
  import TableHeaderOperationalFactors from 'components/tableHeader/operational/factors/TableHeaderOpFactors.svelte';
  import FactorsLabel from './FactorsLabel.svelte'

  export let dashboard;
  export let indicator;

  const sectionScrollX = getUIState('sectionScrollX');

  let node;

  $: updateScroll($sectionScrollX);

  function updateScroll() {
    if (node) node.scrollLeft = $sectionScrollX;
  }
</script>

<div
  bind:this={node}
  class="txcm-factorsHeader">
    <FactorsLabel {indicator} />
    <TableHeaderOperationalFactors {indicator} />
</div>
