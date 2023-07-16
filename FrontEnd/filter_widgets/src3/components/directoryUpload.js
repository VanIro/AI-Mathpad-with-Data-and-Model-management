import './directoryUpload.css'

import React, { useState,useEffect } from 'react';
import ProgressBar from '@ramonak/react-progress-bar';

import Worker from 'worker-loader!@worker';
import Worker2 from 'worker-loader!./finalCompressionWorker.js';

const ExcludeUpload = ['__pycache__', '/.']
const MAX_CHUNK_SIZE = 10 * 1024 * 1024; // Maximum chunk size in bytes

const work_time_limit = 1000*3; // milliseconds
const break_time = 100*10; // milleseconds
const periodicBreaks = () => {
    return setInterval(async ()=> {
        console.log('break time',break_time)
        const ret_val = await new Promise((resolve) =>setTimeout(resolve, break_time) );
        console.log('break over ;(',work_time_limit);
        return ret_val;
    }, work_time_limit)
};

const DirectoryUpload = ({ onUpload }) => {
  const [progress, setProgress] = useState(0);
  const [totalFiles, setTotalFiles] = useState(0);
  const [compressedFilesCount, setCompressedFilesCount] = useState(0);
  const [displayProgressString, setDisplayProgressString] = useState(false);
  const [displayProgress, setDisplayProgress] = useState(false);
  const [compressingFiles, setCompressingFiles] = useState([]);
  const [compressionWorker, setCompressionWorker] = useState(null);
  const [compressionWorker2, setCompressionWorker2] = useState(null);
  // const [compressedFiles, setCompressedFiles] = useState([]);

  useEffect(() => {
    const worker = new Worker();
    setCompressionWorker(worker);
    const worker2 = new Worker2();
    setCompressionWorker2(worker2);

    return () => {
      worker.terminate();
    };
  }, []);

  
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

    let compressedFiles = [];
    const compressChunks = async () => {
      
      const intervalId = periodicBreaks();
      console.log('*set interval', intervalId);

      let chunk = [];
      let chunkSize = 0;
      for (const file of fileList2) {
        const fileSize = file.size;
        if (chunkSize + fileSize > MAX_CHUNK_SIZE) {
          // Process the current chunk
          await compressAndUploadChunk(chunk, compressedFiles);
          chunk = [];
          chunkSize = 0;
        }

        chunk.push(file);
        chunkSize += fileSize;
      }
      // Process the remaining files in the last chunk
      if (chunk.length > 0) {
        await compressAndUploadChunk(chunk, compressedFiles);
      }
      compressionWorker2.postMessage(compressedFiles);
      const compressedFurtherFiles = await new Promise((resolve) => {
        compressionWorker2.onmessage = (event) => {
          const compressedFurtherFiles = event.data;
          resolve(compressedFurtherFiles);
        }
      });
      
      console.log('*clear interval', intervalId);
      clearInterval(intervalId);

      setDisplayProgress(false);
      setDisplayProgressString(false);
      setCompressedFilesCount(0);
      // console.log(compressedFiles)
      onUpload(compressedFurtherFiles);

    };

    const compressAndUploadChunk = async (chunk, compressedFiles) => {
      setCompressingFiles(chunk.map((file) => file.webkitRelativePath || file.name));

      const fileDataPromises = chunk.map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const arrayBuffer = reader.result;
            resolve({
              name: file.webkitRelativePath || file.name,
              data: arrayBuffer,
            });
          };
          reader.readAsArrayBuffer(file);
        });
      });
      const fileData = await Promise.all(fileDataPromises);

      compressionWorker.postMessage(fileData);

      const compressedFilesChunk = await new Promise((resolve) => {
        compressionWorker.onmessage = (event) => {
          const compressedFilesChunk = event.data;
          // console.log('compressedFilesChunk',compressedFilesChunk)
          setCompressedFilesCount((prevCount) => {
            return prevCount + compressedFilesChunk.length
          });
          setCompressingFiles((prevFiles) =>{
            prevFiles.filter((prevFile) => !compressedFilesChunk.some((file) => file.name === prevFile))
          });
          
          resolve(compressedFilesChunk);
        };
      });

      compressedFiles.push(...compressedFilesChunk);

      // Call the onUpload callback for each chunk
      // compressedFilesChunk.forEach((file) => onUpload(file));
    };
    
    compressChunks();

  };

  const calculateProgress = () => {
    if (totalFiles === 0) return 0;
    return ((compressedFilesCount / totalFiles) * 100).toFixed(2);
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
      {displayProgress &&<div className='progress-container-compress'>
        <div className='progress-compress'>
          {displayProgressString && 
            <div>{`${calculateProgress()}% (${compressedFilesCount}/${totalFiles}) files compressed`}</div>
          }
          <ProgressBar completed={calculateProgress()} transitionDuration='0.6s'/>
          {displayProgressString && 
            <div>Compressing {compressingFiles} ...</div>
          }
        </div>
      </div>}
    </div>
  );
};

export default DirectoryUpload;
