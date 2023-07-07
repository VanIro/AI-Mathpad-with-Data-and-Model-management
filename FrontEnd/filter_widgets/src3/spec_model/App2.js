import React, { useState } from 'react';

import Viewer from '../components/viewer';
import CreateModelDataset from './components/createModelDataset';

const model_info = JSON.parse(document.getElementById('model-info').textContent)

const App2 = () => {

  return (
    <div>
      <h1>Model {model_info.name}</h1>
      <CreateModelDataset />

      <br/>
      <Viewer list_id='model_datasets_list' 
        columns={['name','created_at','creator','modified_at','modifier']}
      />
    </div>
  );
};

export default App2;
