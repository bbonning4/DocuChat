import React, { useEffect, useState } from 'react';
import * as langAPI from "../../utilities/langchain-api";

export default function HomePage() {
    const [selectedFile, setSelectedFile] = useState(null);
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
        // Perform your upload logic here
        const status = await langAPI.processDocument(selectedFile);
        console.log(status);
      } else {
        alert('Please select a file to upload.');
      }
    };
  
    return (
      <div>
        <h1>Welcome to DocuChat!</h1>
        <input type="file" accept=".txt,.doc,.docx,.csv,.pdf" onChange={handleFileChange} />
        <button onClick={handleUpload}>Process</button>
      </div>
    );
}