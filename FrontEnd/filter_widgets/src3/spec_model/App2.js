import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';

import Viewer from '../components/viewer';
import CreateModelDataset from './components/createModelDataset';
import Options from './components/options';


import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

let model_info = JSON.parse(document.getElementById('model-info').textContent)

const App2 = () => {
  const [reloadTrigger, setReloadTrigger] = useState(false);
  const [selectedModelDataset, setSelectedModelDataset] = useState(null);
  const [clickPosition, setClickPosition] = useState(null);
  const optionRootRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionRootRef.current && !optionRootRef.current.contains(event.target)) {
        handleHideOptions();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const itemOptions = ['Train'];

  const handleDataChange = () => {
    model_info = JSON.parse(document.getElementById('model-info').textContent)
    setReloadTrigger(!reloadTrigger);
  };

  const handleModelDatasetSelect = (e)=>{
    const modelDatasetId = e.currentTarget.id.split('_')[2];
    let clickPosition1 = {x:e.clientX,y:e.clientY};

    if(optionRootRef.current){
      const parentRect = optionRootRef.current.getBoundingClientRect();
      // console.log(parentRect);
      clickPosition1.x = clickPosition1.x - parentRect.left;
      // clickPosition1.y = clickPosition1.y - parentRect.top;
    }
    setClickPosition(clickPosition1); 
    setSelectedModelDataset(modelDatasetId);
    // console.log(modelDatasetId,e.target, clickPosition1);
  }

  const handleOptionSelect = (e)=>{
    const option = e.currentTarget.textContent;
    handleHideOptions();
    toast.info('Training started... Check live results in the mlfow UI.')
    console.log(option);
    const form = document.getElementById('model-dataset-create-form');
    const csrfmiddlewaretoken = form.children[0].value;
    const formData = new FormData();
    formData.append('action',option);
    formData.append('model_dataset_id',selectedModelDataset);
    formData.append('model_id',model_info.id)
    const responseProm = axios.post('', formData, {
      headers: {
        'X-CSRFToken': csrfmiddlewaretoken,
      }
    });
    responseProm.then((response)=>{
      
    });
  }

  const handleHideOptions = () => {
    // console.log('handleHideOptions')
    setClickPosition(null);
    setSelectedModelDataset(null);
  }



  return (
    <div>
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
      <h1>Model {model_info.name}</h1>
      {/* <button ></button> */}
      <CreateModelDataset model_info={model_info} reloadTrigger={reloadTrigger} handleDataChange={handleDataChange}/>

      <br/>
      <Viewer list_id='model_datasets_list' 
        columns={['name','created_at','creator','modified_at','modifier']}
        reloadTrigger={reloadTrigger}
        id_pre='model_dataset'
        handleRowClick={handleModelDatasetSelect}
      />
      <div ref={optionRootRef} onBlur={handleHideOptions}>
        {selectedModelDataset && <Options
          options={itemOptions} 
          position={clickPosition}
          handleOptionClick={handleOptionSelect}
          
          // ref = {optionRootRef}
        />}
      </div>

    </div>
  );
};

export default App2;
