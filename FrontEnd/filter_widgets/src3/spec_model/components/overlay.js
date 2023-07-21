import './overlay.css'

import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const OverlayComponent = (props) => {

  const [iframeHists, setIframeHists] = useState([]);

  const iframeRef = useRef(null);
  const iframeRef2 = useRef(null);

  const handleBack = () => {
    if(iframeHists.length<=1){
      handleCancel();
    }
    const destSrc = iframeHists[iframeHists.length - 2];
    setIframeHists(iframeHists.slice(0, iframeHists.length - 1));
    iframeRef.current.contentWindow.location.href = destSrc;
  };

  const handleOk = () => {
    console.log('Current src:',iframeHists[iframeHists.length-1]);
    const srcSend = iframeHists[iframeHists.length-1]
    handleCancel();
    props.handleOk(srcSend);
  };

  const handleCancel = () => {
    setIframeHists([]);
    props.handleCancel();
  };
  

  const handleIframeLoad = (event) => {
    // console.log('in handle load')

    const newSrc = event.target.contentWindow.location.href;
    console.log(newSrc,iframeHists, newSrc!==iframeHists.slice(-1)[0])
    if(newSrc!==iframeHists.slice(-1)[0]){
      setIframeHists((prevHists) => {
        const newHists = [...prevHists, newSrc];
        console.log('newHists: ',newHists)
        return newHists;
      });
      // console.log('newHists: ',newHists, newHists===iframeHists);
      // setIframeHists(newHists);
    }
    console.log('newSrc: ',newSrc);


    const iframeContent = event.target.contentDocument;
    const iframeContainer = document.getElementById('iframeContainer');
    iframeContainer.innerHTML='';

    const cont = document.createElement('div');
    cont.appendChild(iframeContent.getElementById('content-wrapper').cloneNode(true));

    // Restore the React scripts
    const scriptElements = Array.from(
      iframeContent.querySelectorAll("script[src]")
    );
    scriptElements.forEach((script) => {
      const newScript = document.createElement("script");
      newScript.innerHTML = script.innerHTML;
      newScript.src = script.src;
      cont.appendChild(newScript);
    });
    const iframe2 = document.createElement('iframe');
    //use cont contents as srcdoc of iframe2
    iframe2.srcdoc = cont.innerHTML;
    iframe2.onload = ()=>{iframe2.onload=handleIframeLoad};
    iframe2.id = 'iframe2'
    iframeRef2.current = iframe2;
    iframeContainer.appendChild(iframe2);
    
    // console.log(iframeHists)

  };
  const iframe = <iframe id="datasetIframe" ref={iframeRef} src={props.src} title={props.title} onLoad={handleIframeLoad} style={{display:'none'}}/>;

  return (
    <>
        {props.overlayVisible && (
            
          
            <div className="overlay_cust">
              <div className="button-container">
                <button onClick={handleBack}>Back</button>
                <button onClick={handleOk}>OK</button>
                <button onClick={handleCancel}>Cancel</button>
              </div>

              {/* Your embedded page */}
              <div id='iframeContainer'></div>
              {iframe}
            </div>
        )}
    </>
  );
};

export default OverlayComponent;
