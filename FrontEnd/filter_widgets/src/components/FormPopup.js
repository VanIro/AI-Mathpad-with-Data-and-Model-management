import React, { useState, useEffect, useRef } from 'react';

const FormPopup = React.forwardRef((props,ref) => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [datasetName, setDatasetName] = useState('');
  const [datasetDesc, setDatasetDesc] = useState('');
  const formRef = ref;//useRef(null);

  const datasetNameChanged= (event) => {
    setDatasetName(event.target.value);
  }
  const datasetDescChanged= (event) => {
    setDatasetDesc(event.target.value);
  }
  const handleSubmit = () => {
    if(formRef){
      // console.log(formRef.current);
    }
    // console.log(datasetName);
    setIsFormVisible(false);
    props.handleSubmit({datasetName,datasetDesc});
  }

  const handleButtonClick = () => {
    setIsFormVisible(true);
  };

  const handleClickOutside = (event) => {
    if (formRef.current && !formRef.current.contains(event.target)) {
      setIsFormVisible(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Escape') {
      setIsFormVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  return (
    <div>
      {isFormVisible ? (
        <div ref={formRef}>
          <input type="text" placeholder="Dataset Name" onChange={datasetNameChanged} value={datasetName}/><br/>
          <input type="text" placeholder="Description" onChange={datasetDescChanged} value={datasetDesc}/>
          <button onClick={handleSubmit}>Submit</button>
        </div>
      ):(
        <button onClick={handleButtonClick}>{props.label}</button>
      )}
    </div>
  );
});

export default FormPopup;
