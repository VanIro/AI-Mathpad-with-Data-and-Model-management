import './mathview.css'

import * as React from "react";
import { useEffect, useMemo, useRef } from "react";
import { MathfieldElement } from 'mathlive';


const CustomMathfield = React.forwardRef((props, ref) => {
  const mathfieldRef = ref;
  function handleEdit(event){
    // console.log('----------------',event.target.value);
    // props.setCorMath_exp(event.target.value);
    props.editRespFunc(event);
  }
  const mathliv_el = <math-field ref={mathfieldRef} contentEditable="true" onInput={handleEdit}/>
  // mathliv_el.addEventListener('input',handleEdit);
  // console.log(mathliv_el);

  useEffect(() => {
    // mathfieldRef.current.<option> = <value>;
  }, []);

  return (
    <div className='mathview'>
      <div className='mathfield-container'>
        {mathliv_el}
      </div>
    </div>
  );
});

export default CustomMathfield;