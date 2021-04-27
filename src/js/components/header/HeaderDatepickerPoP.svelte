<script>
  import { getContext } from 'svelte';
  import { subtractYear } from 'utilities/date';
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
  const yoyMode = getDashboardState('yoyMode');

  let value;
  let precisionValue;
  let isActive;

  $: pick = $datePoP;
  $: precisionPick = $datePrecision;
  $: updatePrecisionPick($datePrecision);
  $: changeYoY($date, pick, $yoyMode);
  $: mode = dashboard === 'financial' ? 1 : 0;
  $: note = updateNote($yoyMode);

  function updatePrecisionPick() {
    if (precisionPick !== $datePrecision) precisionPick = $datePrecision;
  }

  function changeYoY() {
    if ($yoyMode) {
      value = subtractYear($date);
      $datePoP = value;
    }
  }

  function updateNote() {
    if ($yoyMode) return 'YoY';
    return 'PoP';
  }

  function pickValue() {
    $datePoP = value;
    $datePrecision = precisionValue;
    isActive = false;
  }

  function onSubmitPOPClick() {
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
  name="datePoP"
  {mode}
  {note}>
    <button
      class="txcm-datepickerSubmit"
      on:click|preventDefault={onSubmitPOPClick}>
        <Int
          key="Выбрать PoP" />
    </button>
</Datepicker>
