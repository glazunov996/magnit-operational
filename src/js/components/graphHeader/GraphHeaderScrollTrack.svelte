<script>
  import { getGraphsState } from 'state/graphs';

  const THUMB_WIDTH = 80;
  const CLICK_SHIFT = 50;

  let trackWidth;
  let scrollStart;
  let thumbPositionStart;

  const scroll = getGraphsState('scroll');
  const scrollMax = getGraphsState('scrollMax');

  $: thumbDistance = calculateThumbDistance(trackWidth);
  $: thumbPosition = calculateThumbPosition(trackWidth, $scroll, $scrollMax);

  function calculateThumbPosition() {
    const ratio = $scroll / $scrollMax;
    return (trackWidth - THUMB_WIDTH) * ratio;
  }

  function calculateThumbDistance() {
    return trackWidth - THUMB_WIDTH;
  }

  function updateDragScroll(clientX) {
    const thumbPositionDiff = clientX - thumbPositionStart;
    const ratio = thumbPositionDiff / thumbDistance;
    const scrollDelta = $scrollMax * ratio;
    if ((scrollStart + scrollDelta) <= 0) $scroll = 0;
    else if ((scrollStart + scrollDelta) >= $scrollMax) $scroll = $scrollMax;
    else $scroll = scrollStart + scrollDelta;
  }

  function updateClickSroll(offsetX) {
    const diff = offsetX - thumbPosition;
    if (diff > 0) {
      const direction = Math.abs(diff) / diff;
      const scrollDelta = CLICK_SHIFT * direction;
      if (($scroll + scrollDelta) <= 0) $scroll = 0;
      else if (($scroll + scrollDelta) >= $scrollMax) $scroll = $scrollMax;
      else $scroll += scrollDelta;
    }
  }

  function onScrollClick({ offsetX }) {
    updateClickSroll(offsetX);
  }

  function onThumbPointerMove(event) {
    const { clientX } = event.touches ? event.touches[0] : event;
    updateDragScroll(clientX);
  }

  function onThumbPointerUp(event) {
    event.preventDefault();
    unsubscribeWindow();
  }

  function onThumbPointerDown(event) {
    const { clientX } = event.touches ? event.touches[0] : event;
    scrollStart = $scroll;
    thumbPositionStart = clientX;
    subscribeWindow();
  }

  function subscribeWindow() {
    window.addEventListener('mousemove', onThumbPointerMove);
    window.addEventListener('touchmove', onThumbPointerMove);
    window.addEventListener('mouseup', onThumbPointerUp);
    window.addEventListener('touchend', onThumbPointerUp);
  }

  function unsubscribeWindow() {
    window.removeEventListener('mousemove', onThumbPointerMove);
    window.removeEventListener('touchmove', onThumbPointerMove);
    window.removeEventListener('mouseup', onThumbPointerUp);
    window.removeEventListener('touchend', onThumbPointerUp);
  }
</script>

<div
  class="txcm-graphScroll"
  bind:clientWidth={trackWidth}
  on:click|preventDefault|stopPropagation={onScrollClick}
  on:mousedown|preventDefault|stopPropagation
  on:touchstart|preventDefault|stopPropagation>
    <div
      class="txcm-graphScrollThumb"
      style="transform: translateX({thumbPosition}px);"
      on:click|preventDefault|stopPropagation
      on:mousedown|preventDefault={onThumbPointerDown}
      on:touchstart|preventDefault={onThumbPointerDown}>
    </div>
</div>
