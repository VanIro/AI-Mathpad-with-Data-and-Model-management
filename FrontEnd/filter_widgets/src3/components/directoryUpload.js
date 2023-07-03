import React, { useState } from 'react';
import { deflate } from 'pako';

const DirectoryUpload = ({ onUpload }) => {
  const [progress, setProgress] = useState(0);
  const [totalFiles, setTotalFiles] = useState(0);
  const [compressedFiles, setCompressedFiles] = useState(0);

  const handleUpload = async (event) => {
    const files = event.target.files || event.dataTransfer.files;

    const fileList = Array.from(files);

    setTotalFiles(fileList.length);

    const compressedFilesPromises = fileList.map(async (file) => {
        // console.log('webkitRelativePath',file,file.webkitRelativePath)
      if (file.webkitRelativePath) {
        // Directory entry
        const entries = await readDirectoryEntries(file);
        const compressedDir = await compressDirectory(entries); // Rename the variable to compressedDir
        return compressedDir;
      } else {
        console.log('webkitRelativePath is falsy',file,file.webkitRelativePath)
        // Individual file entry
        const compressedData = deflate(await file.arrayBuffer());

        const compressedFile = {
          name: file.name,
          data: compressedData,
          size: compressedData.length,
        };

        // Update progress
        setCompressedFiles((prevCount) => prevCount + 1);
        setProgress(((prevCount + 1) / totalFiles) * 100);

        return compressedFile;
      }
    });

    Promise.all(compressedFilesPromises).then((compressedFiles) => {
      const flattenedFiles = compressedFiles.flat();

      onUpload(flattenedFiles);
    });
  };

  const readDirectoryEntries = (directory) => {
    return new Promise((resolve) => {
      const reader = new FileReader();

      reader.onload = () => {
        const entries = reader.result;
        resolve(entries);
      };

      reader.readAsArrayBuffer(directory);
    });
  };

  const compressDirectory = async (entries) => {
    const entriesArray = Array.from(entries);

    const compressedFilesPromises = entriesArray.map(async (entry) => {
      if (entry.isDirectory) {
        const subEntries = await readDirectoryEntries(entry);
        return await compressDirectory(subEntries);
      } else {
        const file = entry;
        const compressedData = deflate(await file.arrayBuffer());

        const compressedFile = {
          name: file.webkitRelativePath,
          data: compressedData,
          size: compressedData.length,
        };

        // Update progress
        setCompressedFiles((prevCount) => prevCount + 1);
        setProgress(((prevCount + 1) / totalFiles) * 100);

        return compressedFile;
      }
    });

    return Promise.all(compressedFilesPromises);
  };

  return (
    <div>
      <div
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
      </div>
      <div>
        <input
          type="file"
          multiple
          directory=""
          webkitdirectory=""
          onChange={handleUpload}
          onClick={(event) => (event.target.value = null)} // Clear selected files on click to allow reselection of directories
        />
      </div>
      <div>{`${progress.toFixed(2)}% (${compressedFiles}/${totalFiles}) files compressed`}</div>
      <progress value={progress} max="100" />
    </div>
  );
};

export default DirectoryUpload;
