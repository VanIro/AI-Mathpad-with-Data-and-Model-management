import './App.css';

import React, { useState } from 'react';
import DirectoryUpload from './components/directoryUpload';
import ProgressBar from '@ramonak/react-progress-bar';
import { deflate } from 'pako';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Viewer from './components/viewer';

const TransitionDuration = 1;//seconds

const App = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [displayUpload, setDisplayUpload] = useState(false);
  const [reloadTrigger, setReloadTrigger] = useState(false);

  const handleUpload = async (compressed_further) => {
    // Create a FormData object to send the compressed file
    // const compressed_further = deflate(JSON.stringify(compressedZip), { windowBits: 15 });
    const blob = new Blob([compressed_further], { type: 'application/json' });
    const form = document.getElementById('model-repo-upload-form');
    const csrfmiddlewaretoken = form.children[0].value;

    const formData = new FormData();
    formData.append('model_repo', blob);

    setDisplayUpload(true);

      // Make API request to upload the compressed file to Django view using Axios
      const responseP = axios.post('', formData, {
        headers: {
          'X-CSRFToken': csrfmiddlewaretoken,
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
          setUploadProgress(progress);
          if(progress==100){
            setTimeout(()=>setDisplayUpload(false),1.5*TransitionDuration*1000);
            // setDisplayUpload(false);
            // toast.info('Processing..');
          }
        },
      });

      toast.promise(responseP, {
        pending: 'Server is Processing...',
      });

      responseP.then((response)=>{
        
        if (response.status === 200) {
          let message="Success..."
          // Handle successful upload
          if (response.headers.get('content-type').includes('text/html')) {
            message+='\nRepo saved and MlFLow experiment created !';
            const data = response.data;
            const parser = new DOMParser();
            const htmlDoc = parser.parseFromString(data, 'text/html');

            // Find elements with type="application/json"
            const jsonElements = htmlDoc.querySelectorAll('script[type="application/json"]');
            
            // Iterate over the JSON elements and update the target elements accordingly

            jsonElements.forEach((element) => {
                const id = element.id;
                // const jsonData = JSON.parse(element.textContent);
                
                // // Update the target elements using the id and JSON data
                const targetElement = document.getElementById(id);
                if (targetElement) {
                    // Perform the necessary updates using jsonData
                    targetElement.textContent = element.textContent;
                }
                setReloadTrigger(!reloadTrigger);
            });
          }
          else{
            message=message+"\n"+response.data;
          }
          toast.success(message);
        } else {
          const message="Err.. Something went wrong"
          if(response.status==500){
            message=message+"\n"+response.data;
          }
          toast.error(message)
          // Handle upload failure
        }
      });
      responseP.catch((error)=>{
        console.log(error)
        const message="Err.. Something went wrong. \n"+`'${error.response.data}'`
        toast.error(message)
      });

      // await responseP;
    responseP.finally (()=>{
      setDisplayUpload(false);
      setUploadProgress(0);
    });
  };

  return (
    <div style={{textAlign:'center'}}>
      <h1>Models</h1>
      <DirectoryUpload onUpload={handleUpload} />
      <br />
      <br />
      {displayUpload && (
        <div className='progress-container-upload'>
          <div className='progress-upload'>
            Upload Progress:
            <ProgressBar completed={uploadProgress} transitionDuration={`${TransitionDuration}s`}/>
          </div>
        </div>
      )}
      <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                // pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
      />
      
      <Viewer list_id='models-list' 
        columns={['name','created_at','creator','modified_at','modifier']}
        id_pre='model'
        handleRowClick={(e)=>{
          const model_id = e.currentTarget.id.split('_')[1]
          window.location.href = `/dataAdmin/models/${model_id}`
        }}

        reloadTrigger={reloadTrigger}
      />
    </div>
  );
};

export default App;
