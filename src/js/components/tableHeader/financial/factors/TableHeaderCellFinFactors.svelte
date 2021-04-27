<script>
  import TableHeaderCell from 'components/tableHeader/TableHeaderCell.svelte';

  export let date;
</script>

<TableHeaderCell>
  <slot />
  <div
    class="txcm-tableHeaderCellWideColumn">
      ∆ (ppt)<br>
      {date}
  </div>
  <div
    class="txcm-tableHeaderCellWideColumn">
      ∆ (ppt)<br>
      от план
  </div>  
</TableHeaderCell>
