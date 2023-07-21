import './directoryUpload.css'

import React, { useState } from 'react';
import { deflate } from 'pako';
import ProgressBar from '@ramonak/react-progress-bar';

const ExcludeUpload = ['__pycache__', '/.']

const DirectoryUpload = ({ onUpload }) => {
  const [progress, setProgress] = useState(0);
  const [totalFiles, setTotalFiles] = useState(0);
  const [compressedFiles, setCompressedFiles] = useState(0);
  const [displayProgressString, setDisplayProgressString] = useState(false);
  const [displayProgress, setDisplayProgress] = useState(false);
  const [compressingFiles, setCompressingFiles] = useState([]);

  const handleUpload = async (event) => {
    const files = event.target.files || event.dataTransfer.files;

    const fileList = Array.from(files);

    setDisplayProgress(true);
    const fileList2 = fileList.filter((file)=>{

      for (let key of ExcludeUpload)
        if(file.webkitRelativePath.includes(key)) {
            return false;
        }
      return true;
    });

    setTotalFiles(fileList2.length);
    setDisplayProgressString(true);

    // console.log('fileList2', fileList2);

    const compressedFilesPromises = fileList2.map(async (file) => {
    //   console.log('webkitRelativePath is falsy', file, file.webkitRelativePath);
      // Individual file entry
      setCompressingFiles((prevFiles) => [...prevFiles, file.webkitRelativePath || file.name]);
      const compressedData = Array.from(deflate(await file.arrayBuffer(),{windowBits: 15}));
      // console.log(Array.from(compressedData))
      const compressedFile = {
        name: file.webkitRelativePath || file.name,
        data: compressedData,
        size: compressedData.length,
      };
      

      // Update compressed files count
      setCompressedFiles((prevCount) => prevCount + 1);
      setCompressingFiles((prevFiles) => prevFiles.filter((prevFile) => prevFile !== (file.webkitRelativePath || file.name)));

      return compressedFile;
    });

    Promise.all(compressedFilesPromises).then((compressedFiles) => {
      const flattenedFiles = compressedFiles.flat();
      setDisplayProgress(false);
      onUpload(flattenedFiles);
      setDisplayProgressString(false);
      setCompressedFiles(0);
    });
  };

  const calculateProgress = () => {
    if (totalFiles === 0) return 0;
    return ((compressedFiles / totalFiles) * 100).toFixed(2);
  };

  return (
    <div>
      {/* <div
        onDrop={handleUpload}
        onDragOver={(event) => event.preventDefault()}
        style={{
          width: '300px',
          height: '200px',
          border: '2px dashed black',
          textAlign: 'center',
          lineHeight: '200px',
        }}
      >
        Drop Files and Directories Here
      </div> */}
      <div className='dir-upload-container'>
        <div>
          <h4>Upload New Model </h4>
        </div>

        <input
          type="file"
          multiple
          directory=""
          webkitdirectory=""
          onChange={handleUpload}
          onClick={(event) => (event.target.value = null)} // Clear selected files on click to allow reselection of directories
        />
      </div>
      {displayProgressString && 
        <div>{`${calculateProgress()}% (${compressedFiles}/${totalFiles}) files compressed`}</div>
      }
      {displayProgress && <ProgressBar completed={calculateProgress()} transitionDuration='0.6s'/>}
      {displayProgressString && 
        <div>Compressing {compressingFiles} ...</div>
      }
    </div>
  );
};

export default DirectoryUpload;
