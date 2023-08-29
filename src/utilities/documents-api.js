import sendRequest from "./send-request";
const BASE_URL = "/api/documents";

export async function processDocument(doc) {
  return sendRequest(`${BASE_URL}/process`, 'POST', doc, true);
}