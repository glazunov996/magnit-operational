<script>
  import StepperOption from './StepperOption.svelte';

  export let pick;
  export let name;
  export let options = [];
  export let cancel = false;
  export let disabled = false;
  export let theme = '';
</script>

<ul
  class={`txcm-stepper ${theme}`}>
    {#each options as option, index}
      <StepperOption
        bind:pick
        {...option}
        {name}
        {cancel}
        {disabled}
        {index} />
    {/each}
</ul>
