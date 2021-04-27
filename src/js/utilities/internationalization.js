import Int from 'components/core/internationalization/Int.svelte';

export function i18n(object) {
  function mountComponent() {
    const node = object;
    const key = node.textContent.trim();
    node.textContent = '';
    return new Int({
      target: node,
      props: { key },
    });
  }

  mountComponent();

  return {};
}
