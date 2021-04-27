import { qlikClientStart, qlikRequestMeta, qlikRequest, qlikRequestExport, qlikRequestTemplateAction } from 'client/client';

function dispatchResponseEvent(data, name) {
  const event = new CustomEvent(name, { detail: data });
  window.dispatchEvent(event);
}

function dispatchErrorEvent(error) {
  const event = new CustomEvent('error', { detail: error });
  window.dispatchEvent(event);
}

function dispatchReadyEvent() {
  const event = new CustomEvent('proxyready');
  window.dispatchEvent(event);
}

function sendResponse(data, name = 'dataresponse') {
  dispatchResponseEvent(data, name);
}

function sendDataResponse(data) {
  sendResponse(data);
}

function sendMetaResponse(data) {
  sendResponse(data, 'metaresponse');
}

function sendExportResponse(data) {
  sendResponse(data, 'exportresponse');
}

function sendTemplateActionResponse(data) {
  sendResponse(data, 'templateactionresponse');
}

function sendError(error) {
  dispatchErrorEvent(error);
  console.error(error);
}

async function onEventRequest({ detail }) {
  const { uuid, key, ...data } = detail;
  try {
    const response = await qlikRequest(data);
    sendResponse(response, uuid);
  } catch(e) {
    const error = { error: e }
    sendResponse(error, uuid)
  }
}

function onDataRequest({ detail }) {
  qlikRequest(detail)
    .then(sendDataResponse)
    .catch(sendError);
}

function onMetaRequest() {
  qlikRequestMeta()
    .then(sendMetaResponse)
    .catch(sendError);
}

function onExportRequest({ detail }) {
  qlikRequestExport(detail)
    .then(sendExportResponse)
    .catch(sendError);
}

function onTemplateActionRequest({ detail }) {
  qlikRequestTemplateAction(detail)
    .then(sendTemplateActionResponse)
    .catch(sendError);
}

function subscribeRequests() {
  window.addEventListener('eventrequest', onEventRequest)
  window.addEventListener('datarequest', onDataRequest);
  window.addEventListener('metarequest', onMetaRequest);
  window.addEventListener('exportrequest', onExportRequest);
  window.addEventListener('templateactionrequest', onTemplateActionRequest);
}

function initProxy() {
  subscribeRequests();
  qlikClientStart()
    .then(dispatchReadyEvent);
}

initProxy();
