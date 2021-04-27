<script>
  import { getUIState } from 'state/ui';
  import { translate } from 'utilities/dictionary';

  export let key;

  const locale = getUIState('locale');

  $: label = translate(key, $locale);
</script>

{label}
