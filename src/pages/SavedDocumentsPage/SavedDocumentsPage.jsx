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
    <div key={doc._id}>
      <label>
        <input
          type="checkbox"
          checked={selectedDocs.includes(doc._id)}
          onChange={() => toggleSelection(doc._id)}
        />
        {doc.name}
      </label>
      <div className="divider"></div>
    </div>
  ));

  return (
    <>
      {chatting && (
        <div>
          <form autoComplete="off" onSubmit={sendQuery}>
            <input
              name="query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="btn" type="submit">
              Chat
            </button>
          </form>
          {loading && <p>Asking question...</p>}
          {result && <p>{result}</p>}
        </div>
      )}
      {docs.length ? (
        <>
          {processing && <p>Processing, please wait...</p>}
          <button className="btn" onClick={deleteSelectedDocs}>
            Delete Selected
          </button>
          <button className="btn" onClick={chatWithDocs}>
            Chat With Selected Documents
          </button>
          {docsList}
        </>
      ) : (
        <p>No saved documents.</p>
      )}
    </>
  );
}
