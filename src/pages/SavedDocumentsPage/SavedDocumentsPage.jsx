import { useState, useEffect } from "react";
import * as documentsAPI from "../../utilities/documents-api";

export default function SavedDocumentsPage() {
  const [docs, setDocs] = useState([]);

  useEffect(function () {
    async function getAllDocs() {
      const userDocs = await documentsAPI.getAll();
      setDocs(userDocs);
    }
    getAllDocs();
  }, []);

  const docsList = docs.map((doc) => (
    <div key={doc._id}>
      {doc.name}
      <div className="divider"></div>
    </div>
  ))

  return (
    <>
      {docs.length ? docsList : <p>No saved documents.</p>}
    </>
  );
}