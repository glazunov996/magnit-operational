<script>
  import { checkDynamics } from 'utilities/indicator';

  export let data;
  export let graph;

  function renderDynamicsClass() {
    const dynamics = checkDynamics(data);
    if (dynamics === -2) return ' txcm-factorDiagramRectBase-is-decreasing';
    return '';
  }
</script>

<div
  class="txcm-factorDiagram">
    {#if data}
      <svg
        width="100%"
        height="20"
        class="txcm-factorDiagramSVG">
          <rect
            class={`txcm-factorDiagramRectBase${renderDynamicsClass(data)}`}
            x={`${(graph.min + graph.shift) * 100}%`}
            y="0.5"
            width={`${graph.width * 100}%`}
            height="19px"
            rx="3"
            ry="3"
            transform="translate(0.5 0)" />
      </svg>
    {/if}
</div>
