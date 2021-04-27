let currentRequest;

function dispatchRequestEvent() {
  const event = new CustomEvent('exportrequest', currentRequest);
  window.dispatchEvent(event);
}

function resetRequest() {
  currentRequest = null;
}

export function requestExport(dashboard, config, filters, prevFilters) {
  const promise = new Promise((resolve, reject) => {
    function onExportResponse(response) {
      window.removeEventListener('exportresponse', onExportResponse);
      window.removeEventListener('error', onExportError);
      resetRequest();
      resolve(response.detail);
    }

    function onExportError() {
      window.removeEventListener('exportresponse', onExportResponse);
      window.removeEventListener('error', onExportError);
      resetRequest();
      reject(new Error('an error occured while exporting data'));
    }

    window.addEventListener('exportresponse', onExportResponse);
    window.addEventListener('error', onExportError);
  });

  currentRequest = { detail: { dashboard, config, filters, prevFilters } };
  dispatchRequestEvent();
  return promise;
}
