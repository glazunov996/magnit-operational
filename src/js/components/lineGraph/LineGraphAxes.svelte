<script>
  export let padding;
</script>

<line
  class="txcm-lineGraphAxis"
  x1="0"
  y1={padding}
  x2="100%"
  y2={padding}
  transform="translate(0 0.5)" />
<line
  class="txcm-lineGraphAxis"
  x1="0"
  y1="50%"
  x2="100%"
  y2="50%"
  transform="translate(0 0.5)" />
<line
  class="txcm-lineGraphAxis"
  x1="0"
  y1="100%"
  x2="100%"
  y2="100%"
  transform={`translate(0 ${-padding + 0.5})`} />
