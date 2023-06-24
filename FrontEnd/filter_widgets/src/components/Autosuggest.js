import './Autosuggest.css'

import {useState} from 'react';

function Autosuggest(props){
    const [dispSuggestions, setDispSuggestions] = useState(false);

    const handleKeyChanged = event=>{
        props.onKeyChange(event);
        setDispSuggestions(true);
    }

    const handleSugClicked = event=>{
        props.onSuggestionClick(event);
        setDispSuggestions(false);
    }
    const handleSearchBlur = event=>{
        // console.log(event.target,event.relatedTarget, document.activeElement);
        if(event.relatedTarget && event.relatedTarget.className.includes('suggestion'))
            return;
        setDispSuggestions(false);
    }

    return(
        <div className ='search-container'>
            <input className='search-input' type="text" placeholder="Search" 
                onChange={handleKeyChanged} onBlur={handleSearchBlur}
                onFocus={(props.suggestions.length>0 && !dispSuggestions)?()=>setDispSuggestions(true):()=>{}}
            />
            
            { dispSuggestions && 
                <table>
                <tbody className='suggestions' >
                    {props.suggestions.map((suggestion, index) => {
                        return <tr key={index}><td><div key={index} className='suggestion' tabIndex='-1' onClick={handleSugClicked} style={{zIndex:300}}>{suggestion}</div></td></tr>
                    })}
                </tbody>
                </table>
                
            }
        </div>
    )

}

export default Autosuggest;