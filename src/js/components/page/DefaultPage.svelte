<script>
  import { onMount } from 'svelte';
  import { replace} from 'svelte-spa-router'

  export let location;

  onMount(() => replace('/dashboard/operational'));
</script>

<svelte:head>
  <title>
    Редирект...
  </title>
</svelte:head>
