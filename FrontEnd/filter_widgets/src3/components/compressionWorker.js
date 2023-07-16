// compressionWorker.js

import { deflate } from 'pako';

const work_time_limit = 1000*3; // milliseconds
const break_time = 100*2; // milleseconds
const periodicBreaks = () => {
    return setInterval(async ()=> {
        // console.log('break time',break_time)
        const ret_val = await new Promise((resolve) =>setTimeout(resolve, break_time) );
        // console.log('break over ;(',work_time_limit);
        return ret_val;
    }, work_time_limit)
};

self.onmessage = async (event) => {
    const intervalId = periodicBreaks();
    // console.log('set interval',intervalId);
    const files = event.data;
    //   console.log('Compression Worker',typeof files[0],files)
    const compressedFiles = await new Promise(async (resolve) => {
        const compressedDataPromises = files.map(async (file) => {
          const compressedData = Array.from(deflate(await file.data, { windowBits: 15 }));
          const compressedFile = {
            name: file.webkitRelativePath || file.name,
            data: compressedData,
            size: compressedData.length,
          };
          return compressedFile;
        });
    
        const compressedFiles = await Promise.all(compressedDataPromises);
        resolve(compressedFiles);
      });
    
    //   console.log(files);
    //   console.log('clear interval', intervalId);
      self.postMessage(compressedFiles);
      clearInterval(intervalId);
};
