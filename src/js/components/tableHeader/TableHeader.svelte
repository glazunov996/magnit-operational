<script>
  export let detail = null;

  function renderDetailClass() {
    if (detail) return ` txcm-tableHeader-${detail}`;
    return '';
  }
</script>

<div
  class={`txcm-tableHeader${renderDetailClass(detail)}`}>
    <slot />
</div>
