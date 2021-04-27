<script>
  import Slice from 'components/slice/Slice.svelte';

  export let data;
  export let units;
  export let indicator;
  export let isInverted;

  export let hasData;

  let fragment;

  $: updateFragment(data);

  function checkValues(value) {
    return value && value.qNum !== null && (value.qNum !== 'NaN' || !isNaN(value.qNum));
  }

  function checkColumnData(column) {
    return ['fact', 'factVsPpPercent', 'factVsBudgetPercent'].some(key => checkValues(column[key]));
  }

  function filterRow(row) {
    return ['column1', 'column2'].some(key => checkColumnData(row[key]));
  }

  function updateFragment() {
    fragment = data.filter(filterRow);
    hasData = fragment && fragment.length > 0;
  }
</script>

{#each fragment as row (row.name)}
  <Slice
    {isInverted}
    {indicator}
    {units}
    {row} />
{/each}
