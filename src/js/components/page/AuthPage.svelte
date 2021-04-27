<script>
  import AuthForm from 'components/auth/AuthForm.svelte';
  import AuthHelp from 'components/auth/AuthHelp.svelte';
</script>

<main class="txcm-authPage">
  <svg
    class="txcm-authLogo">
      <use
        xlink:href="#txspt-icons-logo" />
  </svg>
  <AuthForm />
  <AuthHelp />
</main>
<svelte:head>
  <title>
    Авторизация
  </title>
</svelte:head>
