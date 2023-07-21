import React, { useState } from 'react';

import Viewer from '../../src3/components/viewer';
import Visualization from '../../src/components/visualization';

const dataset_info = JSON.parse(document.getElementById('dataset-info').textContent)

const App2 = () => {

  return (
    <div>
      <h1><u>Dataset : {dataset_info.name}</u></h1>

      {/* <br/> */}

      <h3>Info</h3>
      <Viewer list_id='dataset-info' 
        columns={['name','created_at','creator','modified_at','modifier']}
      />
      <hr/>
        <h3>Description</h3>
        <div>{dataset_info.description}</div>
      <hr/>
      <div>
        <h3>Visualizations</h3>
        <Visualization data={dataset_info.pickled_stats}/>
      </div>
    </div>
  );
};

export default App2;
