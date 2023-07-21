import React, { useState } from 'react';

import Viewer from '../components/viewer';
import CreateModelDataset from './components/createModelDataset';

let model_info = JSON.parse(document.getElementById('model-info').textContent)

const App2 = () => {
  const [reloadTrigger, setReloadTrigger] = useState(false);

  const handleDataChange = () => {
    model_info = JSON.parse(document.getElementById('model-info').textContent)
    setReloadTrigger(!reloadTrigger);
  };

  return (
    <div>
      <h1>Model {model_info.name}</h1>
      <CreateModelDataset model_info={model_info} reloadTrigger={reloadTrigger} handleDataChange={handleDataChange}/>

      <br/>
      <Viewer list_id='model_datasets_list' 
        columns={['name','created_at','creator','modified_at','modifier']}
        reloadTrigger={reloadTrigger}
      />
    </div>
  );
};

export default App2;
