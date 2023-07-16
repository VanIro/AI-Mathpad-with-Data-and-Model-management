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
    const compressedZips = event.data;
    // console.log('Final Compression Worker',compressedZips)
    const finalCompressedZip = await new Promise(async (resolve) => {
        const finalCompressedZip = deflate(JSON.stringify(compressedZips), { windowBits: 15 });
        resolve(finalCompressedZip);
      });
    
    //   console.log(files);
    //   console.log('clear interval', intervalId);
      self.postMessage(finalCompressedZip);
      clearInterval(intervalId);
};
