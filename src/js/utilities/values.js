export function findIndex(array, value) {
  const index = array.findIndex(item => item.value === value);
  return index !== -1 ? index : null;
}

export function findIndexes(array, values) {
  return values.map(value => findIndex(array, value));
}

function findGroupedIndex(array, value) {
  const groupIndex = array.findIndex(group => group.options.some(option => option.value === value));
  if (groupIndex === -1) return null;
  const optionIndex = array[groupIndex].options.findIndex(option => option.value === value);
  if (optionIndex === -1) return null;
  return `${groupIndex}-${optionIndex}`;
}

export function findGroupedIndexes(array, values) {
  return values.map(value => findGroupedIndex(array, value));
}

export function findValue(array, index) {
  if (index !== null) return array[index].value;
  return null;
}

export function findValues(array, indexes) {
  return indexes.map(index => findValue(array, index));
}

function findGroupedValue(array, index) {
  const indexElements = index.split('-');
  const groupIndex = parseInt(indexElements[0], 10);
  const optionIndex = parseInt(indexElements[1], 10);
  if (index !== null) return array[groupIndex].options[optionIndex].value;
  return null;
}

export function findGroupedValues(array, indexes) {
  return indexes.map(index => findGroupedValue(array, index));
}
