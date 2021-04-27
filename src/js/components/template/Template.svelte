<script>
  import Int from 'components/core/internationalization/Int.svelte';
  import { getUIState, updateUI } from 'state/ui';
  import { requestTemplateAction } from 'utilities/templates';

  export let data;
  export let isDisabled;

  const templates = getUIState('templates');
  const templateUpdate = getUIState('templateUpdate');
  const updating = getUIState('updating');
  const updatingMeta = getUIState('updatingMeta');

  function enable() {
    $updatingMeta -= 1;
  }

  function updateStateRemove(status) {
    if (status) {
      const copy = $templates.slice();
      const index = copy.findIndex(template => template.id === data.id);
      copy.splice(index, 1);
      $templates = copy;
    }
  }

  function removeTemplate() {
    const request = {
      action: 'remove',
      data: {
        id: data.id,
      },
    };
    requestTemplateAction(request)
      .then(updateStateRemove)
      .then(enable)
      .catch(enable);
  }

  function tryRemoveTemplate() {
    updateUI({
      updatingMeta: $updatingMeta + 1,
      confirmation: {
        header: `Удалить шаблон "${data.label}"?`,
        message: 'Вы действительно хотите удалить шаблон?',
        action: removeTemplate,
        cancel: enable,
      },
    });
  }

  function updateStateApplly(status) {
    if (status) {
      $templateUpdate = Date.now();
    }
  }

  function applyTemplate() {
    $updatingMeta += 1;
    const action = {
      action: 'apply',
      data: {
        id: data.id,
      },
    };
    requestTemplateAction(action)
      .then(updateStateApplly)
      .then(enable)
      .catch(enable);
  }

  function onTemplateClick() {
    applyTemplate();
  }

  function onTemplateDeleteClick() {
    tryRemoveTemplate();
  }
</script>

<li
  class="txcm-templateOption">
    <button
      class="txcm-templateDelete"
      on:click={onTemplateDeleteClick}
      disabled={isDisabled}>
        <Int
          alt="Удалить" />
    </button>
    <button
      class="txcm-template"
      on:click={onTemplateClick}
      disabled={isDisabled}>
        {data.label}
    </button>
</li>

