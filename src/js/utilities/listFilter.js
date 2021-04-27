import * as _ from 'lodash';

function filterKey(text, filter) {
  return _.lowerCase(text).includes(filter);
}

function filterItem(item, keys, filter) {
  if (Array.isArray(keys)) return keys.some(key => filterKey(item[key], filter));
  return filterKey(item[keys], filter);
}

function filterCategory(categories, category, filter, key, filterMethod) {
  const { label } = category;
  const filtered = category[key].filter(item => filterMethod(item, filter));
  if (filtered.length > 0) categories.push({ label, [key]: filtered });
  return categories;
}

function filterCategories(categories, filter, reduceMethod) {
  if (filter) {
    const normalizedFilter = _.lowerCase(filter);
    return categories.reduce((result, category) => reduceMethod(result, category, normalizedFilter), []);
  }
  return categories;
}

function filterIndicatorItem(item, filter) {
  const keys = ['label', 'value'];
  return filterItem(item, keys, filter);
}

function filterIndicatorCategory(categories, category, filter) {
  return filterCategory(categories, category, filter, 'indicators', filterIndicatorItem);
}

export function filterIndicatorCategories(categories, filter) {
  return filterCategories(categories, filter, filterIndicatorCategory);
}

function filterNavigationItem(item, filter) {
  return filterItem(item, 'label', filter);
}

function filterNavigationCategory(categories, category, filter) {
  return filterCategory(categories, category, filter, 'indicators', filterNavigationItem);
}

export function filterNavigationCategories(categories, filter) {
  return filterCategories(categories, filter, filterNavigationCategory);
}

export function filterComparisonIndicators(data, filter) {
  if (filter) {
    const normalizedFilter = _.lowerCase(filter);
    return data.filter(item => filterItem(item, 'label', normalizedFilter));
  }
  return data;
}

function filterSelectItem(result, item, index, key, filter) {
  const isFiltered = filterKey(item[key], filter);
  if (isFiltered) {
    result.push({
      ...item,
      index,
    });
  }
  return result;
}

export function filterSelectOptions(data, filter, filterOnly = false) {
  if (filter) {
    const normalizedFilter = _.lowerCase(filter);
    return data.reduce((result, item, index) => filterSelectItem(result, item, index, 'label', normalizedFilter), []);
  }
  if (!filterOnly)
    return data;
  return []
}

function filterSelectGroup(categories, category, filter) {
  const { label } = category;
  const options = category.options.reduce((result, item, index) => filterSelectItem(result, item, index, 'label', filter), []);
  if (options.length > 0) categories.push({ label, options });
  return categories;
}

export function filterSelectGroups(data, filter) {
  if (filter) {
    const normalizedFilter = _.lowerCase(filter);
    return data.reduce((result, item) => filterSelectGroup(result, item, normalizedFilter), []);
  }
  return data;
}
