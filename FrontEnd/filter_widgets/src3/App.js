

import React from 'react';
import DirectoryUpload from './components/directoryUpload';

const App = () => {
    const handleUpload = (compressedZip) => {
        // Perform upload logic here
        console.log('Compressed zip:', compressedZip);
        // Make API request to upload the compressed file to Django view
        // ...
      };
    
      return (
        <div>
          <h1>Model App</h1>
          <DirectoryUpload onUpload={handleUpload} />
        </div>
      );
};

export default App;