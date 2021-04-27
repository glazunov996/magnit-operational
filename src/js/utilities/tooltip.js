/* eslint max-lines-per-function: 'off' */

import { updateUI } from 'state/ui';

function show(content, side, position, theme) {
  updateUI({ tooltip: { content, side, position, theme } });
}

function hide() {
  updateUI({ tooltip: null });
}

function calculateVerticalPosition(vertical, left, right, shift = 0) {
  return {
    x: left + ((right - left) / 2),
    y: vertical + shift,
  };
}

function calculateHorizontalPosition(horizontal, top, bottom, shift = 0) {
  return {
    x: horizontal + shift,
    y: top + ((bottom - top) / 2),
  };
}

function calculatePosition(node, side) {
  const rect = node.getBoundingClientRect();
  const { top, right, bottom, left } = rect;
  if (side === 'bottom') return calculateVerticalPosition(bottom, left, right, -18);
  else if (side === 'right') return calculateHorizontalPosition(right, top, bottom, -18);
  else if (side === 'left') return calculateHorizontalPosition(left, top, bottom, 18);
  return calculateVerticalPosition(top, left, right, 18);
}

export function tooltip(node, data) {
  let { content, side, theme } = data;

  function onNodeMouseOver() {
    const position = calculatePosition(node, side);
    show(content, side, position, theme);
  }

  function onNodeMouseOut() {
    if (!document.activeElement || document.activeElement !== node) hide();
  }

  function onNodeFocus() {
    const position = calculatePosition(node);
    show(content, side, position, theme);
  }

  function onNodeBlur() {
    hide();
  }

  function subscribe() {
    node.addEventListener('mouseenter', onNodeMouseOver);
    node.addEventListener('mouseleave', onNodeMouseOut);
    node.addEventListener('focus', onNodeFocus);
    node.addEventListener('blur', onNodeBlur);
  }

  function unsubscribe() {
    node.removeEventListener('mouseenter', onNodeMouseOver);
    node.removeEventListener('mouseleave', onNodeMouseOut);
    node.removeEventListener('focus', onNodeFocus);
    node.removeEventListener('blur', onNodeBlur);
  }

  function init() {
    if (content.data && content.component) subscribe();
  }

  function destroy() {
    unsubscribe();
  }

  function update(newData) {
    ({ content, side, theme } = newData);
    if (content.data && content.component) subscribe();
    else unsubscribe();
  }

  init();

  return {
    update,
    destroy,
  };
}
