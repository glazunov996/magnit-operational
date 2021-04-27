function cleanNumber(number) {
  return number
    .replace(/\s/u, '')
    .replace(/,/u, '.');
}

export function parseFloatFromData(number) {
  const value = cleanNumber(number);
  return parseFloat(value);
}
