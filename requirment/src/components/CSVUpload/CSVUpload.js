import React, { useState } from 'react';
import axios from 'axios';

function CSVUpload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    if (!file) {
      setMessage('Please select a CSV file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/csv-upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage(response.data.success || response.data.error);
      console.log(response.data.error);

      // Automatically refresh the page after 3 seconds (3000 milliseconds)
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (error) {
      setMessage('An error occurred during upload.');
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Upload CSV File</h2>
      <form onSubmit={handleUpload}>
        <input type="file" accept=".csv" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default CSVUpload;
