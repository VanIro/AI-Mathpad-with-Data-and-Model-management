import './createModelDataset.css'

import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import axios from 'axios';

import Viewer from '../../components/viewer';
import OverlayComponent from './overlay';
// import {} from '../backend_urls';


function CreateModelDataset(props) {
    const [chooseDataset, setChooseDataset] = useState(false);

    const handleClick=()=>{
        console.log("setting chooseDataset to true")
        setChooseDataset(true);
    }

    const handleCancel=()=>{
        setChooseDataset(false);
    }
    const handleOk=(src)=>{
        setChooseDataset(false);
        try{
            console.log('src: ',src,src.replaceAll(/^\/+|\/+$/g,'').split('/'));
            const dataset_pk = Number.parseInt(src.replaceAll(/^\/+|\/+$/g,'').split('/').slice(-1)[0]);
            console.log('dataset_pk: ',dataset_pk);

            if(dataset_pk){
                const form = document.getElementById('model-dataset-create-form');
                const csrfmiddlewaretoken = form.children[0].value;

                const formData = new FormData();
                
                formData.append('action','create dataset for a model');
                formData.append('model',props.model_info.id);
                formData.append('dataset_pk',dataset_pk);

                const responseProm = axios.post('', formData, {
                    headers: {
                      'X-CSRFToken': csrfmiddlewaretoken,
                    }
                });

                responseProm.then((response)=>{
                    if (response.status === 200) {
                        console.log('Creation successful!');
                        // Handle successful creation of dataset
                        toast.success('Created Successfully 👌');
                        setTimeout(() => {
                            window.location.reload();
                          }, 2000);
                        // if (response.headers.get('content-type').includes('text/html')) {
                        //     const data = response.data;
                        //     const parser = new DOMParser();
                        //     const htmlDoc = parser.parseFromString(data, 'text/html');

                        //     // Find elements with type="application/json"
                        //     const jsonElements = htmlDoc.querySelectorAll('script[type="application/json"]');
                            
                        //     // Iterate over the JSON elements and update the target elements accordingly
                        //     jsonElements.forEach((element) => {
                        //         const id = element.id;
                        //         const jsonData = JSON.parse(element.textContent);
                                
                        //         // Update the target elements using the id and JSON data
                        //         const targetElement = document.getElementById(id);
                        //         if (targetElement) {
                        //             // Perform the necessary updates using jsonData
                        //             targetElement.textContent = jsonData.propertyName;
                        //         }
                        //     });
                        // }
                      } else {
                        console.log('Creation failed.');
                        // Handle creation failure
                        toast.error('Err.. Some error occured.. 🤯\n'+ `Status: ${resp.status}`)
                      }
                }).catch((err)=>{
                    console.log('Error: ',err);
                    toast.error('Err.. Some error occured.. 🤯\n'+ `'${err.message}'`)
                });

                
                toast.promise(
                    responseProm,
                    {
                        pending: 'Creating Dataset',
                        // success: 'Created Successfully 👌',
                        // error: 'Some error occured.. 🤯'
                    }
                )
            
                  
            }
            else{
                toast.error('Err.. Please select a dataset and press ok. ');
            }


        }catch(err){
            console.log('Error: ',err);
            toast.error('Err.. Please select a dataset and press ok. ')
        }
    }


    return (
        <div className="createModelDataset">
            
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
            {<OverlayComponent overlayVisible={chooseDataset} src={`${window.location.origin}/dataAdmin/datasets`} title={'Datasets'}
                {...{handleCancel, handleOk}}
            />}
            <button className="createModelDatasetButton" onClick={handleClick}>Create Model Dataset</button>
        </div>
    )
}

export default CreateModelDataset;