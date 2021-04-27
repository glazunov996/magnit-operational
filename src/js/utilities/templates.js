function dispatchRequestEvent(request) {
  const event = new CustomEvent('templateactionrequest', { detail: request });
  window.dispatchEvent(event);
}

export function requestTemplateAction(request) {
  const promise = new Promise((resolve, reject) => {
    function onRequestResponse(response) {
      window.removeEventListener('templateactionresponse', onRequestResponse);
      window.removeEventListener('error', onRequestError);
      resolve(response.detail);
    }

    function onRequestError() {
      window.removeEventListener('templateactionresponse', onRequestResponse);
      window.removeEventListener('error', onRequestError);
      reject(new Error('An error occured while making this request'));
    }

    window.addEventListener('templateactionresponse', onRequestResponse);
    window.addEventListener('error', onRequestError);
  });
  dispatchRequestEvent(request);
  return promise;
}
