<script>
  import TableHeaderCell from 'components/tableHeader/TableHeaderCell.svelte';

  export let date;
</script>

<TableHeaderCell>
  <slot />
  <div
    class="txcm-tableHeaderCellColumn">
      % от выр.<br>
      млн. руб
  </div>
  <div
    class="txcm-tableHeaderCellColumn">
      ∆ (ppt)<br>
      {date}
  </div>
  <div
    class="txcm-tableHeaderCellColumn">
      ∆ (ppt)<br>
      от план
  </div>
</TableHeaderCell>
