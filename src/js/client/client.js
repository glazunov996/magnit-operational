/* global require */
/* eslint global-require: 'off' */

import { default as config } from 'configs/client.json';
import { qlikRequestDates } from './requests/operational/dates';
import { qlikRequestOperationalOverview } from './requests/operational/overview';
import { qlikRequestOperationalSlices } from './requests/operational/slices';
import { qlikRequestOperationalFactors } from './requests/operational/factors';
import { qlikRequestTemplates, qlikRequestApplyTemplate, qlikRequestCreateTemplate, qlikRequestRemoveTemplate } from './requests/financial/templates';
import { qlikRequestOperationalExportData, qlikRequestOperationalExport } from './requests/operational/export';

let app;

function qlikRequestSlices(indicator, filters, type) {
  return qlikRequestOperationalSlices(app, indicator, filters, type);
}

function qlikRequestFactors(indicator, filters, type) {
  return qlikRequestOperationalFactors(app, indicator, filters, type);
}

function qlikRequestDetail(indicator, detail, filters, type) {
  if (detail === 'factors') return qlikRequestFactors(indicator, filters, type);
  return qlikRequestSlices(indicator, filters, type);
}

function qlikRequestOverview(filters, type, idIndicator) {
  return qlikRequestOperationalOverview(app, filters, type, idIndicator);
}

function qlikRequestExportData() {
  return qlikRequestOperationalExportData(app);
}

export function qlikRequest({ indicator, detail, filters, type, idIndicator }) {
  if (detail) return qlikRequestDetail(indicator, detail, filters, type)
  else if (indicator && indicator === 'export') return qlikRequestExportData();
  else if (indicator) return qlikRequestSlices(indicator, filters, type)
  return qlikRequestOverview(filters, type, idIndicator);
}

export function qlikRequestMeta() {
  console.log("qlikRequestMeta")
  return Promise.all([
    qlikRequestTemplates(app),
    qlikRequestDates(app),
  ]);
}

export function qlikRequestTemplateAction({ action, data }) {
  if (action === 'add') return qlikRequestCreateTemplate(app, data);
  else if (action === 'remove') return qlikRequestRemoveTemplate(app, data);
  return qlikRequestApplyTemplate(app, data);
}

export function qlikRequestExport({ config, filters, prevFilters }) {
  return qlikRequestOperationalExport(app, config, filters, prevFilters);
}

export function qlikClientStart() {
  return new Promise((resolve) => {
    let prefix = window.location.pathname.substr(0, window.location.pathname.toLowerCase().lastIndexOf("/extensions" ) + 1)
    if (prefix.length === 0) prefix = '/';    
    const hostname = window.location.hostname;
    const host = hostname.includes('corp.tander.ru') ? hostname : "qsense.corp.tander.ru";    
    const connection = { 
      host: host,      
      prefix: prefix,
      port: 443,
      isSecure: window.location.protocol === "https:",
    }
    const port = `:${connection.port}`;
    const baseUrl = `https://${host}${port}${prefix}resources/`;
    require.config({ baseUrl });
    console.log("STARTED", connection)
    require(['js/qlik'], (qlik) => {
      qlik.setOnError(error => console.log(error))
      app = qlik.openApp(config.id, connection);
      resolve();
    });
  });
}
