let currentRequest;

function resetRequest() {
  currentRequest = null;
}

export function requestUpdate(dashboard, indicator, detail, filters, type, id) {
  console.log("REQUEST UPDATE")
  const promise = new Promise((resolve, reject) => {
    function onDataResponse(response) {
      window.removeEventListener('dataresponse', onDataResponse);
      window.removeEventListener('error', onDataError);
      resetRequest();
      resolve(response.detail);
    }

    function onDataError() {
      window.removeEventListener('dataresponse', onDataResponse);
      window.removeEventListener('error', onDataError);
      resetRequest();
      reject(new Error('an error occured while fetching data'));
    }

    window.addEventListener('dataresponse', onDataResponse);
    window.addEventListener('error', onDataError);
  });
  currentRequest = { detail: { dashboard, indicator, detail, filters, type, id } };
  const event = new CustomEvent('datarequest', currentRequest);
  window.dispatchEvent(event);
  return promise;
}
