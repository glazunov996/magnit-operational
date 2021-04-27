<script>
  import { updateUI } from 'state/ui';

  let scrollY;

  $: updateUI({ scrollY });
</script>

<svelte:window
  bind:scrollY={scrollY}/>
