import { useRef, useState } from 'react';
import './App.css';
import DrawingComponent from './DrawingComponent';
import Mathfield from './mathview'

import useAxios from './auth/useAxios'
import PrivateRoute from './auth/privateRoute';

import { BASE_URL } from './backend_urls';

const TESTMODE=false;

function App() {

  const canvasRef = useRef(null);
  const mathviewRef = useRef(null);
  const [math_exp, setMath_exp] = useState('')
  const [cor_math_exp, setCorMath_exp] = useState('')
  const [cor_flag, setCor_flag] = useState(false);

  const mathpad = <DrawingComponent ref={canvasRef} />
  const mathview = <Mathfield value={math_exp} ref={mathviewRef}  setCorMath_exp={setCorMath_exp} editRespFunc = {handleMathfieldEdit}/>
  // console.log(mathviewRef)

  const ax_inst = useAxios();

  function handleSubmit(event){
    // console.log(canvasRef.current)
    var img_data = canvasRef.current.getDataURL();
    var data = {
      img_file:img_data.split('base64,')[1]
    }

    if(!TESTMODE)
      //sending a request
      fetch(`${BASE_URL}procImg/`,{
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
                },  
            body: JSON.stringify(data)

        }).then((response)=>{
          return response.json();
        }).then((data)=>{
          console.log(data);

          setMath_exp(data.latex_exp.replace(/\s+/g, ''));
          setCor_flag(false);
          setCorMath_exp('');
          mathviewRef.current.value=data.latex_exp;
        })
    else{
      //for testing purposes, data is a dummy response

    }

  }
  function handleCorrection(event){
    console.log('correction submitted',cor_math_exp);
    var img_data = canvasRef.current.getDataURL();
    var data = {
      img_file:img_data.split('base64,')[1],
      correct_exp:cor_math_exp
    }
    ax_inst.post(`${BASE_URL}saveAnnot/`, data).catch((error)=>{
      console.log(error);
    })
  }

  function handleMathfieldEdit(event){
    let cor_math_exp_latest = event.target.value;
    setCorMath_exp(cor_math_exp_latest);
    // console.log('editing',math_exp,cor_math_exp);
    if (cor_math_exp_latest==math_exp || cor_math_exp_latest==''){
      // console.log('no correction');
      setCor_flag(false);
      return;
    }
    setCor_flag(true);
  }

  return (
    <div className="App">
      <div className='mathpad-container'>{mathpad}</div>
      <br/>
      <div>
        <button onClick={handleSubmit}>Recognize</button> 
      </div>
      {mathview}
      <PrivateRoute>
        <div>
        <button onClick={cor_flag?handleCorrection:()=>{}} className={(cor_flag?'active':'')+' correction_submit'}>Submit Correction</button> 
        </div>
      </PrivateRoute>
    </div>
  );
}

export default App;
