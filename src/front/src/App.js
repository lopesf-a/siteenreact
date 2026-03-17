import Input from './componants/input';
import { useState } from 'react';
import './App.css';

function App() {

  const [file, setFile] = useState(undefined);

  const [data, setData] = useState({
    fileName: "",
    contentType: ""
  });

  const [jobId, setJobId] = useState("");

  const [pdfUrl, setPdfUrl] = useState("");

  const handleChange = (e) => {

    if (e.target.type === "file") {
      const selectedFile = e.target.files[0];

      setFile(selectedFile);

      setData({
        ...data,
        fileName: selectedFile.name,
        contentType: selectedFile.type
      });

    } else {
      setData({
        ...data,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleSubmit = async () => {

    try {

      console.log(`${process.env.REACT_APP_API_URL}/jobs`);

      // 1️⃣ créer le job
      const response = await fetch(`${process.env.REACT_APP_API_URL}/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      console.log("Job created:", result);

      const id = result.jobId;
      const uploadUrl = result.uploadUrl;

      setJobId(id);

      // 2️⃣ upload du PDF vers Azure Blob
      await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "x-ms-blob-type": "BlockBlob",
          "Content-Type": file.type
        },
        body: file
      });

      console.log("PDF uploaded to Azure Blob");

      // 3️⃣ récupérer le job
      const jobResponse = await fetch(`${process.env.REACT_APP_API_URL}/jobs/${id}`);

      const jobResult = await jobResponse.json();

      console.log("Job Result:", jobResult);

    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="App">

      <Input
        label="PDF"
        type="file"
        name="fileName"
        onChange={handleChange}
      />

      <Input
        label="Content Type"
        type="text"
        name="contentType"
        value={data.contentType}
        onChange={handleChange}
      />

      <button onClick={handleSubmit}>Submit</button>

      {jobId && <p>Job ID: {jobId}</p>}

    </div>
  );
}

export default App;