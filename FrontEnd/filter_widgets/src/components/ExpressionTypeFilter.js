import './ExpressionTypeFilter.css'

// import { useState } from 'react';
import BinaryToggle from './BInaryToggle';

const expressionChars = JSON.parse(document.getElementById('expression-chars').innerHTML);
function ExpressionTypeFilter(props){

    const handleSelection = event=>{
        const value = event.target.innerHTML;
        props.onExpressionTypeChoicesChange(value);
    }

    const {expressionTypeUse:selectedValue,setExpressionTypeUse:setSelectedValue} = props;

    return (
        <div className='expression-type-filter-widget'>
            
            <div className='expression-type-filter-header-container'><div className='expression-type-filter-header'>Expression Type Selector</div></div>
            <div style={{
                width:'100%', textAlign:'left'
            }}><BinaryToggle selectedValue={selectedValue} setSelectedValue={setSelectedValue}/></div>
            <div className='expression-type-choices-container'>
                {['Simple',...expressionChars].map((expressionChar, index) => {
                    return <div key={index} className={'expression-type-choice'+ (props.expressionTypeChoices.includes(expressionChar)?' selected':'')}
                                tabIndex='-1' onClick={handleSelection}
                            >
                                {expressionChar}
                            </div>
                })}
            </div>
        </div>
      );
}

export default ExpressionTypeFilter;