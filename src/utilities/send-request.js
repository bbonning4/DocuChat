import { getToken } from './users-service';

export default async function sendRequest(url, method = 'GET', payload = null, payloadIsFormData = false) {
  const options = { method };
  if (payload) {
    options.headers = payloadIsFormData ? {} : { 'Content-Type': 'application/json' };
    options.body = payloadIsFormData ? payload : JSON.stringify(payload);
  }
  const token = getToken();
  if (token) {
    options.headers ||= {};
    options.headers.Authorization = `Bearer ${token}`;
  }
  
  try {
    const res = await fetch(url, options);

    if (res.ok) {
      return res.json();
    } else {
      // Capture the response data for error analysis
      const responseData = await res.json();
      throw new Error(`Request failed with status ${res.status}: ${JSON.stringify(responseData)}`);
    }
  } catch (error) {
    throw new Error(`Network error: ${error.message}`);
  }
}