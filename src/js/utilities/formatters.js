let numberFormatter;
let percentageFormatter;

export function initFormatters() {
  numberFormatter = new Intl.NumberFormat('en-US');
  percentageFormatter = new Intl.NumberFormat('en-US', { style: 'unit', unit: 'percent' });
}

export function formatNumber(value) {
  return numberFormatter.format(value);
}

export function formatPercentage(value) {
  return percentageFormatter.format(value);
}
