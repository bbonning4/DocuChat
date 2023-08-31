import { useState, useEffect } from "react";
import * as documentsAPI from "../../utilities/documents-api";

export default function SavedDocumentsPage() {
  const [docs, setDocs] = useState([]);
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [chatting, setChatting] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState("");

  useEffect(function () {
    async function getAllDocs() {
      const userDocs = await documentsAPI.getAll();
      setDocs(userDocs);
    }
    getAllDocs();
  }, []);

  const toggleSelection = (docId) => {
    if (selectedDocs.includes(docId)) {
      setSelectedDocs(selectedDocs.filter((id) => id !== docId));
    } else {
      setSelectedDocs([...selectedDocs, docId]);
    }
  };

  const deleteSelectedDocs = async () => {
    await documentsAPI.deleteDocs(selectedDocs);
    setDocs(docs.filter((doc) => !selectedDocs.includes(doc._id)));
    setSelectedDocs([]);
  };

  const chatWithDocs = async () => {
    setProcessing(true);
    const processed = await documentsAPI.chatWithDocs(selectedDocs);
    setProcessing(false);
    setChatting(processed);
  };

  const sendQuery = async (e) => {
    e.preventDefault();
    if (!query) return;
    setResult("");
    setLoading(true);
    try {
      const requestData = { query };
      const result = await documentsAPI.chat(requestData);
      setResult(result.response);
      setLoading(false);
      setQuery("");
    } catch (err) {
      console.log("err:", err);
      setLoading(false);
    }
  };

  const docsList = docs.map((doc) => (
    <div
      key={doc._id}
      className={`p-4 rounded-lg mb-4 ${
        selectedDocs.includes(doc._id)
          ? "bg-accent text-black"
          : "bg-primary text-white"
      }`}
      onClick={() => toggleSelection(doc._id)}
    >
      {doc.name}
    </div>
  ));

  return (
    <div className="mx-auto max-w-3xl">
      {chatting && (
        <div className="mb-4">
          <form
            autoComplete="off"
            onSubmit={sendQuery}
            className="flex items-center"
          >
            <input
              name="query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="input input-bordered input-accent w-full"
              placeholder="Ask a question"
            />
            <button className="btn-primary btn ml-2" type="submit">
              Chat
            </button>
          </form>
          {loading && <p className="mt-2">Asking question...</p>}
          {result && (
            <div className="card flex flex-col items-center justify-center mt-4">
              <div className="card-content m-5 rounded border-solid border-white bg-neutral p-8">
                {result}
              </div>
            </div>
          )}
        </div>
      )}
      {docs.length ? (
        <div>
          {processing && <p className="mb-2">Processing, please wait...</p>}
          <button
            className="btn-secondary btn mb-4"
            onClick={deleteSelectedDocs}
          >
            Delete Selected
          </button>
          <div className="mb-6">
            <button className="btn-accent btn mr-2" onClick={chatWithDocs}>
              Chat With Selected Documents
            </button>
          </div>
          {docsList}
        </div>
      ) : (
        <p className="mt-6">No saved documents.</p>
      )}
    </div>
  );
}
