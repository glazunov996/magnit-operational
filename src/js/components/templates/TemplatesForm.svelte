<script>
  import { tick } from 'svelte';
  import { getUIState } from 'state/ui';
  import { requestTemplateAction } from 'utilities/templates';
  import Int from 'components/core/internationalization/Int.svelte';

  export let isDisabled;

  const templates = getUIState('templates');
  const updatingMeta = getUIState('updatingMeta');

  let input;
  let value = '';
  let isActive;

  function resetValue() {
    value = '';
  }

  async function show() {
    isActive = true;
    await tick();
    input.focus();
  }

  function hide() {
    resetValue();
    input.blur();
    isActive = false;
  }

  function enable() {
    $updatingMeta -= 1;
  }

  function disable() {
    $updatingMeta += 1;
  }

  function updateState(id) {
    if (id) {
      const template = {
        id,
        label: value,
        description: '',
      };
      const copy = $templates.slice();
      copy.push(template);
      $templates = copy;
    }
  }

  function addTemplate() {
    const request = {
      action: 'add',
      data: {
        name: value,
        description: '',
      },
    };
    requestTemplateAction(request)
      .then(updateState)
      .then(hide)
      .then(enable);
  }

  function createTemplate() {
    addTemplate();
    disable();
  }

  function onAddClick() {
    if (isActive && value) createTemplate();
    else if (!isActive) show();
  }

  function onTemplateSubmit() {
    createTemplate();
  }
</script>

<form
  class="txcm-templateForm"
  class:txcm-templateForm-is-active={isActive}
  on:submit|preventDefault={onTemplateSubmit}>
    <input
      class="txcm-templateInput"
      placeholder="Новый шаблон"
      bind:this={input}
      bind:value
      disabled={isDisabled}>
</form>
<button
  class="txcm-templateAdd"
  on:click={onAddClick}
  disabled={isDisabled}>
    <Int
      key="Добавить в шаблоны" />
</button>
