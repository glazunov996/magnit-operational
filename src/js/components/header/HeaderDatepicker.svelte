<script>
  import { getContext } from 'svelte';
  import { getDashboardState } from 'state/dashboard';
  import Int from 'components/core/internationalization/Int.svelte';
  import Datepicker from 'components/datepicker/Datepicker.svelte';

  export let dashboard;
  export let disabled;

  const { dateMin } = getContext('app').getAppConfig();
  const { dateMax } = getContext('app').getAppConfig();
  const date = getDashboardState('date');
  const datePoP = getDashboardState('datePoP');
  const datePrecision = getDashboardState('datePrecision');

  let value;
  let precisionValue;
  let isActive;

  $: pick = $date;
  $: precisionPick = $datePrecision;
  $: updatePick($date);
  $: updatePrecisionPick($datePrecision);
  $: mode = dashboard === 'financial' ? 1 : 0;

  function updatePick() {
    if (pick !== $date) pick = $date;
  }

  function updatePrecisionPick() {
    if (precisionPick !== $datePrecision) precisionPick = $datePrecision;
  }

  function pickValue() {
    $date = value;
    $datePrecision = precisionValue;
    isActive = false;
  }

  function onSubmitClick() {
    pickValue();
  }
</script>

<Datepicker
  bind:pick
  bind:precisionPick
  bind:value
  bind:precisionValue
  bind:isActive
  lowerLimit={dateMin}
  upperLimit={dateMax}
  disabledAll={disabled}
  name="date"
  {mode}>
    <button
      class="txcm-datepickerSubmit"
      on:click|preventDefault={onSubmitClick}>
        <Int
          key="Выбрать" />
    </button>
</Datepicker>
