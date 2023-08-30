import sendRequest from "./send-request";
const BASE_URL = "/api/documents";

export async function processDocument(doc) {
  return sendRequest(`${BASE_URL}/process`, 'POST', doc, true);
}
export async function saveDocument(doc) {
  return sendRequest(`${BASE_URL}/save`, 'POST', doc, true);
}

export async function chat(requestData) {
  return sendRequest(`${BASE_URL}/chat`, 'POST', requestData, false);
}

export async function getAll() {
  return sendRequest(`${BASE_URL}`, 'GET');
}

export async function deleteDocs(docs) {
  return sendRequest(`${BASE_URL}/delete`, 'POST', docs, false)
}