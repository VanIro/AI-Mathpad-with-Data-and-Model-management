import { forwardRef } from 'react';
import './options.css';

const Options = forwardRef((props,ref)=>{
    const options_rows = props.options.map((option,i) => {
        return <div key={i} className='option-item' id={`optionItem_${i}`}
                    onClick={props.handleOptionClick || ( ()=>{console.log('no function for option click...')} ) }
                >
                    {option}
                </div>
    });
    return <>
        <div className='options-container' ref={ref} style={{
            position:'absolute',left:props.position.x, top:props.position.y
        }}>
            {options_rows}
        </div>
    </>
});

export default Options;