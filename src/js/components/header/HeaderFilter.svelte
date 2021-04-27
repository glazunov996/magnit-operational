<script>
  import { getUIState } from 'state/ui';
  import { getExportState } from 'state/export';
  import HeaderDatepicker from './HeaderDatepicker.svelte';
  import HeaderDatepickerPoP from './HeaderDatepickerPoP.svelte';
  import HeaderUnits from './HeaderUnits.svelte';

  export let dashboard;
  export let variant;

  const updating = getUIState('updating');
  const downloading = getExportState('downloading');

  $: isUnitsActive = dashboard === 'financial';
  $: isDisabled = $updating > 0 || $downloading > 0;
</script>

<HeaderDatepicker
  {dashboard}
  disabled={isDisabled} />
<HeaderDatepickerPoP
  {dashboard}
  disabled={isDisabled} />
{#if isUnitsActive}
  <HeaderUnits
    {variant}
    disabled={isDisabled} />
{/if}
