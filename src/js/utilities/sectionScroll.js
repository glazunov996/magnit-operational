/* eslint max-lines-per-function: 'off' */

import { updateUI } from 'state/ui';

function detectPointerPosition(event) {
  if (event.touches) return event.touches[0].clientX;
  return event.clientX;
}

export function sectionScroll(object, shoudUpdateUI) {
  const node = object;

  let scrollStart;
  let pointerClientXStart;

  function updateSectionScroll(scroll) {
    node.scrollLeft = scroll;
    if (shoudUpdateUI) updateUI({ sectionScrollX: scroll });
  }

  function resetPointer() {
    pointerClientXStart = null;
  }

  function onWheel(event) {
    const { deltaX } = event;
    if (Math.abs(deltaX) > 0) {
      event.preventDefault();
      updateSectionScroll(node.scrollLeft + deltaX);
    }
  }

  function onPointerMove(event) {
    const clientX = detectPointerPosition(event);
    const deltaX = pointerClientXStart - clientX;
    updateSectionScroll(scrollStart + deltaX);
  }

  function onPointerUp() {
    resetPointer();
    unsubscribeWindow();
  }

  function subscribeWindow() {
    window.addEventListener('touchmove', onPointerMove);
    window.addEventListener('touchend', onPointerUp);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
  }

  function unsubscribeWindow() {
    window.removeEventListener('touchmove', onPointerMove);
    window.removeEventListener('touchend', onPointerUp);
    window.removeEventListener('mousemove', onPointerMove);
    window.removeEventListener('mouseup', onPointerUp);
  }

  function onPointerDown(event) {
    pointerClientXStart = detectPointerPosition(event);
    scrollStart = node.scrollLeft;
    subscribeWindow();
  }

  function subscribe() {
    node.addEventListener('wheel', onWheel);
    node.addEventListener('mousedown', onPointerDown);
    node.addEventListener('touchstart', onPointerDown);
  }

  function unsubscribe() {
    node.removeEventListener('wheel', onWheel);
    node.removeEventListener('mousedown', onPointerDown);
    node.removeEventListener('touchstart', onPointerDown);
  }

  function init() {
    subscribe();
  }

  function destroy() {
    unsubscribe();
  }

  init();

  return {
    destroy,
  };
}
