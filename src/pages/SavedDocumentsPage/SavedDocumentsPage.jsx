import { useState, useEffect } from "react";
import * as documentsAPI from "../../utilities/documents-api";

export default function SavedDocumentsPage() {
  const [docs, setDocs] = useState([]);
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [chatting, setChatting] = useState(false);

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
    const processed = await documentsAPI.chatWithDocs(selectedDocs);
    setChatting(processed);
  }

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
      {docs.length ? (
        <>
          <button className="btn" onClick={deleteSelectedDocs}>Delete Selected</button>
          <button className="btn" onClick={chatWithDocs}>Chat With Selected Documents</button>
          {docsList}
        </>
      ) : (
        <p>No saved documents.</p>
      )}
    </>
  );
}
