import './createModelDataset.css'

import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Viewer from '../../components/viewer';
import OverlayComponent from './overlay';

function CreateModelDataset() {
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

        }catch(err){
            console.log('Error: ',err);
        }
    }


    return (
        <div className="createModelDataset">
            <Router>
                {<OverlayComponent overlayVisible={chooseDataset} src={`${window.location.origin}/dataAdmin/datasets`} title={'Datasets'}
                    {...{handleCancel, handleOk}}
                />}
            </Router>
            <button className="createModelDatasetButton" onClick={handleClick}>Create Model Dataset</button>
        </div>
    )
}

export default CreateModelDataset;