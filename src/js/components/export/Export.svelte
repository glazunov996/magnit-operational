<script>
  import ExportSlices from 'components/exportSlices/ExportSlices.svelte';
  import ExportIndicators from 'components/exportIndicators/ExportIndicators.svelte';
  import ExportControls from './ExportControls.svelte';

  export let data;
  export let dashboard;
  export let conditions;
</script>

<section
  class="txcm-exportSection">
    <ExportSlices
      {data}
      {dashboard} />
    <ExportIndicators
      {dashboard} />
    <ExportControls
      {dashboard}
      {conditions} />
</section>
