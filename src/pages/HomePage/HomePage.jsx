import React, { useEffect, useState } from "react";
import * as documentsAPI from "../../utilities/documents-api";

export default function HomePage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [processed, setProcessed] = useState(false);
  const [saved, setSaved] = useState(false);
  const [query, setQuery] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const allowedFileTypes = [
    "application/pdf",
    "text/plain",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/csv",
  ];

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file && allowedFileTypes.includes(file.type)) {
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
      alert(
        "Please select a valid file type: .txt, .doc, .docx, .csv, or .pdf"
      );
    }
  };

  const handleUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);
      const result = await documentsAPI.processDocument(formData);
      if (result) {
        setProcessed(true);
      }
      console.log("result: ", result);
    } else {
      alert("Please select a file to upload.");
    }
  };

  const handleSave = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);
      const result = await documentsAPI.saveDocument(formData);
      if (result) {
        setSaved(true);
      }
      console.log("result: ", result);
    } else {
      alert("Please select a file.");
    }
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center justify-center">
      <div className="mx-auto max-w-xs">
        <input
          type="file"
          accept=".txt,.doc,.docx,.csv,.pdf"
          className="file-input file-input-bordered file-input-accent w-full"
          onChange={handleFileChange}
        />
        <button className="btn-primary btn w-full mt-4" onClick={handleUpload}>
          Process
        </button>
        <button className="btn-primary btn w-full mt-2" onClick={handleSave}>
          SAVE
        </button>
      </div>
      <div className="mx-auto max-w-xs">
        {processed ? (
          <div>
            <form autoComplete="off" onSubmit={sendQuery}>
              <input
                name="query"
                value={query}
                placeholder="What would you like to ask?"
                className="input input-bordered input-accent w-full"
                onChange={(e) => setQuery(e.target.value)}
              />
              <button className="btn-primary btn w-full mt-4" type="submit">
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
        ) : (
          <div className="card flex flex-col items-center justify-center mt-4">
            <div className="card-content m-5 rounded border-solid border-white bg-neutral p-8">
              <h1 className="text-center">
                Welcome! To begin, choose a file and process it to begin chatting
                with it, or save the file to chat with it later.
              </h1>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
