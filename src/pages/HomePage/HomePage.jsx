import React, { useEffect, useState } from 'react';
import * as documentsAPI from "../../utilities/documents-api";

export default function HomePage() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [processed, setProcessed] = useState(false);
    const [query, setQuery] = useState('');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);

    const allowedFileTypes = ['application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/csv'];
  
    const handleFileChange = (event) => {
      const file = event.target.files[0];
      
      if (file && allowedFileTypes.includes(file.type)) {
        setSelectedFile(file);
      } else {
        setSelectedFile(null);
        alert('Please select a valid file type: .txt, .doc, .docx, .csv, or .pdf');
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
        console.log('result: ', result)
      } else {
        alert('Please select a file to upload.');
      }
    };
  
    const sendQuery = async () => {
      if (!query) return
      setResult('')
      setLoading(true)
    }

    return (
      <>
        <div>
          <h1>Welcome to DocuChat!</h1>
          <input type="file" accept=".txt,.doc,.docx,.csv,.pdf" onChange={handleFileChange} />
          <button onClick={handleUpload}>Process</button>
        </div>
        <div>
          {processed && (
            <div>
              <input/>
              <button>Ask</button>
            </div>
          )}
        </div>
      </>
    );
}