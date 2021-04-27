import { default as app } from 'configs/app.json';
import { default as graphs } from 'configs/dashboards/graphs.json';
import { default as financialColumn } from 'configs/dashboards/financial/column.json';
import { default as financialFilter } from 'configs/dashboards/financial/filter.json';
import { default as financialIndicators } from 'configs/dashboards/financial/indicators.json';
import { default as financialExport } from 'configs//dashboards/financial/export.json';
import { default as operationalExport } from 'configs//dashboards/operational/export.json';
import { default as operationalColumn } from 'configs/dashboards/operational/column.json';
import { default as operationalFilter } from 'configs/dashboards/operational/filter.json';
import { default as operationalIndicators } from 'configs/dashboards/operational/indicators.json';

export let CONFIG = {
  ...app,
  graphs,
  dashboards: {
    financial: {
      column: financialColumn,
      filter: financialFilter,
      indicators: financialIndicators,
      export: financialExport,
    },
    operational: {
      column: operationalColumn,
      filter: operationalFilter,
      indicators: operationalIndicators,
      export: operationalExport
    },
  },
};

export function updateConfig(update) {
  CONFIG = { ...CONFIG, ...update };
}
