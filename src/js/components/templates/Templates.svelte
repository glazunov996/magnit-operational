<script>
  import { getUIState } from 'state/ui';
  import Int from 'components/core/internationalization/Int.svelte';
  import Template from 'components/template/Template.svelte';
  import TemplatesForm from './TemplatesForm.svelte';

  const templates = getUIState('templates');
  const updating = getUIState('updating');
  const updatingMeta = getUIState('updatingMeta');

  $: isDisabled = checkDisabled($updatingMeta, $updating);

  function checkDisabled() {
    return $updatingMeta > 0 || $updating > 0;
  }
</script>

{#if $templates}
  <div
    class="txcm-templates">
      <div
        class="txcm-templatesHeader">
          <Int
            key="Шаблоны" />
      </div>
      <ul
        class="txcm-templateList">
          {#each $templates as template (template.id)}
            <Template
              data={template}
              {isDisabled} />
          {/each}
      </ul>
      <TemplatesForm
        {isDisabled} />
  </div>
{/if}
