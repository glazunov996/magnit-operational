<script>
  import Int from 'components/core/internationalization/Int.svelte';

  export let value = null;
  export let name;
  export let label = null;
  export let disabled = false;
  export let valid = true;
  export let error = null;
  export let theme = '';
  export let attrs = {
    required: false,
    type: 'text',
  };

  function renderClass(key) {
    const baseClass = `txcm-${key}`;
    if (theme) return `baseClass ${baseClass}${theme}`;
    return baseClass;
  }

  function renderInputClasses() {
    const baseClasses = ['txcm-input'];
    if (value) baseClasses.push('txcm-input-is-filled');
    if (error) baseClasses.push('txcm-input-has-error');
    if (valid) baseClasses.push('txcm-input-is-valid');
    if (disabled) baseClasses.push('txcm-input-is-disabled');
    if (attrs.required) baseClasses.push('txcm-input-is-required');
    if (theme) {
      return [
        ...baseClasses,
        ...baseClasses.map(baseClass => baseClass.replace(baseClasses[0], `${baseClasses[0]}${theme}`))].join(' ');
    }
    return baseClasses.join(' ');
  }
</script>

<div
  class={renderClass('inputHolder')}>
    <input
      class={renderInputClasses(value, error, valid, disabled)}
      { ...attrs }
      {disabled}
      id={name}
      bind:value />
    {#if label}
      <label
        class={renderClass('inputLabel')}
        for={name}>
          <Int
            key={label} />
      </label>
    {/if}
    {#if error}
      <div
        class={renderClass('inputError')}>
          <Int
            key={error} />
      </div>
    {/if}
</div>
