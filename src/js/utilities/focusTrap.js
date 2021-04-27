function isFocusElsewhere(elements) {
  return !elements.some(element => element === document.activeElement);
}

function isFocusChangeKey(keyCode) {
  return keyCode === 9;
}

function isFocusForwardKey(shiftKey) {
  return !shiftKey;
}

function isFocusBackKey(shiftKey) {
  return shiftKey;
}

function focusFirst() {
  return 0;
}

function findFocus(elements) {
  return elements.indexOf(document.activeElement);
}


function focusNext(index, elements, max) {
  return index === max ? 0 : index + 1;
}

function focusPrev(index, elements, max) {
  return index === 0 ? max : index - 1;
}

export function focusTrap(node) {
  const elements = [].slice.call(node.querySelectorAll('a, input, button, textarea, [contenteditable], [tabindex="0"]'));
  const max = elements.length - 1;

  let index;

  function updateIndex(shiftKey) {
    if (isFocusElsewhere(elements)) index = focusFirst();
    else {
      if (isNaN(index)) index = findFocus(elements);
      if (isFocusForwardKey(shiftKey)) index = focusNext(index, elements, max);
      else if (isFocusBackKey(shiftKey)) index = focusPrev(index, elements, max);
    }
  }

  function updateFocus() {
    elements[index].focus();
  }

  function trapFocus(shiftKey) {
    updateIndex(shiftKey);
    updateFocus();
  }

  function onDocumentKeyDown(event) {
    const { keyCode, shiftKey } = event;
    if (isFocusChangeKey(keyCode)) {
      event.preventDefault();
      trapFocus(shiftKey);
    }
  }

  function init() {
    document.addEventListener('keydown', onDocumentKeyDown);
  }

  function destroy() {
    document.removeEventListener('keydown', onDocumentKeyDown);
  }

  init();

  return {
    destroy,
  };
}
