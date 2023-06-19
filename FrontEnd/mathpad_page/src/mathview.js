import * as React from "react";

import { useEffect, useMemo, useRef } from "react";

import './mathview.css'

const Mathfield = React.forwardRef((props,ref) => {
  const mathfieldRef = ref;
  function handleEdit(event){
    // console.log('----------------',event.target.value);
    // props.setCorMath_exp(event.target.value);
    props.editRespFunc(event);
  }
  const mathliv_el =<math-field ref={ref} onInput={handleEdit}/>
  

  useEffect(() => {
    // mathfieldRef.current.<option> = <value>;
  }, []);

  return (
    <div className='mathfield'>
        {mathliv_el}
    </div>
  );
});

export default Mathfield;