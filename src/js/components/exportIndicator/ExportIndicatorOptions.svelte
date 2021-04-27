<script>
  import Stepper from 'components/core/stepper/Stepper.svelte';

  export let indicator;

  const name = `exportIndicator-${indicator.id}`;
  const options = generateOptions();

  let pick = options[0].value;

  function generateOptions() {
    return [{
      label: '',
      value: `${indicator.id}-0`,
    }, {
      label: 'млрд руб.',
      value: `${indicator.id}-1`,
    }];
  }
</script>

<Stepper
  bind:pick
  {name}
  {options}
  theme="txcm-stepper-export" />
