import React, { useState } from 'react';
import DirectoryUpload from './components/directoryUpload';
import ProgressBar from '@ramonak/react-progress-bar';
import { deflate } from 'pako';
import axios from 'axios';

import Viewer from './components/viewer';

const App = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [displayUpload, setDisplayUpload] = useState(false);

  const handleUpload = async (compressedZip) => {
    // Create a FormData object to send the compressed file
    const compressed_further = deflate(JSON.stringify(compressedZip), { windowBits: 15 });
    const blob = new Blob([compressed_further], { type: 'application/json' });
    const form = document.getElementById('model-repo-upload-form');
    const csrfmiddlewaretoken = form.children[0].value;

    const formData = new FormData();
    formData.append('model_repo', blob);

    setDisplayUpload(true);

    try {
      // Make API request to upload the compressed file to Django view using Axios
      const response = await axios.post('', formData, {
        headers: {
          'X-CSRFToken': csrfmiddlewaretoken,
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
          setUploadProgress(progress);
        },
      });

      if (response.status === 200) {
        console.log('File upload successful!');
        // Handle successful upload
      } else {
        console.log('File upload failed.');
        // Handle upload failure
      }
    } catch (error) {
      console.error('An error occurred during file upload:', error);
      // Handle error
    } finally {
      setDisplayUpload(false);
      setUploadProgress(0);
    }
  };

  return (
    <div>
      <h1>Models</h1>
      <DirectoryUpload onUpload={handleUpload} />

      <br />
      <br />
      {displayUpload && (
        <div>
          Upload Progress:
          <ProgressBar completed={uploadProgress} />
        </div>
      )}
      
      <Viewer list_id='models-list' 
        columns={['name','created_at','creator','modified_at','modifier']}
        id_pre='model'
        handleRowClick={(e)=>{
          const model_id = e.currentTarget.id.split('_')[1]
          window.location.href = `/dataAdmin/models/${model_id}`
        }}
      />
    </div>
  );
};

export default App;
