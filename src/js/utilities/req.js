import { v4 as uuidv4 } from 'uuid';

export async function executeRequest(key, data) {  
  const uuid = uuidv4();
  const promise = new Promise((resolve, reject) => {
    window.addEventListener(uuid, ({detail}) => {
      if (detail.hasOwnProperty('error')) {
        reject(detail.error);
        return;
      }
      resolve(detail)
    }, { once: true });    
  })  
  const event = new CustomEvent('eventrequest', {detail: { key, uuid, ...data }});
  window.dispatchEvent(event);  
  return await promise;
}