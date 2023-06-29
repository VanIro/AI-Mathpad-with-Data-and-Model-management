import { useRef, useState } from 'react';
import './App.css';
import DrawingComponent from './DrawingComponent';
import CustomMathfield from './mathview'
import { BASE_URL } from './backend_urls';

import useAxios from './auth/useAxios'
import PrivateRoute from './auth/privateRoute';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const TESTMODE=false;

function App() {

  const canvasRef = useRef(null);
  const mathviewRef = useRef(null);
  const [math_exp, setMath_exp] = useState('')
  const [cor_math_exp, setCorMath_exp] = useState('')
  const [cor_flag, setCor_flag] = useState(false);

  const mathpad = <DrawingComponent ref={canvasRef} clearMathview={()=>{
    console.log('clearing mathview');
    setMath_exp('');
    if(mathviewRef)
      mathviewRef.current.value='';
    setCorMath_exp('');
  }}/>
  console.log('math_exp',math_exp);
  const mathview = <CustomMathfield value={math_exp} ref={mathviewRef}  setCorMath_exp={setCorMath_exp} editRespFunc = {handleMathfieldEdit}/>
  // console.log(mathviewRef)

  const ax_inst = useAxios();

  function handleSubmit(event){
    // console.log(canvasRef.current)
    var img_data = canvasRef.current.getDataURL();
    var data = {
      img_file:img_data.split('base64,')[1]
    }

    if(!TESTMODE){
      //sending a request
      var  recProm = fetch(`${BASE_URL}procImg/`,{
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
        toast.promise(
          recProm,
          {
            pending: 'Recognizing',
            success: 'Done 👌',
            error: 'Some error occured.. 🤯 Please try again'
          }
        );
    }
    else{
      //for testing purposes, data is a dummy response

    }

  }
  function handleCorrection(event){
    var img_data = canvasRef.current.getDataURL();
    var data = {
      img_file:img_data.split('base64,')[1],
      correct_exp:cor_math_exp
    }
    const subCor_prom = ax_inst.post(`${BASE_URL}saveAnnot/`, data).
    then((resp)=>{
      console.log('correction submitted',cor_math_exp,resp.status);

    }).
    catch((error)=>{
      console.log(error);
    })
    toast.promise(
      subCor_prom,
      {
        pending: 'Submitting your Correct Annotation',
        success: 'Submitted Successfully 👌',
        error: 'Some error occured.. 🤯'
      }
    )
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
      <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
      />
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
