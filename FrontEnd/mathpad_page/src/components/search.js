import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './search.css'

function Search(props){
    let navigate = useNavigate();
    const [hide_sug,setHide_sug] = useState(false);

    function searchTodo(value,e=undefined){
        // console.log('requesting backend...', e.target.value )
        props.fillSugList(value);
    }

    function sugItemClickHandler(e){
        console.log('clicked',e.target.id);
        let id = e.target.id.split('-')[1]
        navigate('/todoApp/detail/'+id);
    }
    
    
    let suggestions_list = props.sugList.map((item,i)=>{
        return <div className="sugItem" onClick={sugItemClickHandler} key={i} id={'sugItem-'+item['id']}>
            {item['title']}
        </div>
    })

    return <>

        <div className="flexbox">
        <div className="search">
            <h1>Search from titles.</h1>
            <h3>Click on search icon, then type your keyword.</h3>
            <div style={{overflow:'visible',position:'relative'}}>
                {/* {search_inp} */}
                <input type="text" id='todo-search-input' placeholder="Search . . ." onChange={(e)=>searchTodo(e.target.value)} 
                    onBlur={(e)=>{
                        // console.log("blur event...")
                        if(!e.relatedTarget || e.relatedTarget.className.trim()!=='suggestions'){
                            setHide_sug(true);
                        }
                    }}
                    onFocus={(e)=>{
                        setHide_sug(false);
                    }}

                ></input>
                { suggestions_list.length > 0 && 
                <div className={'suggestions '+(hide_sug?'hide':'')} tabIndex='-1' style={{position:'absolute'}} onClick={
                    ()=>{
                        console.log("Clicked ni ta..",document.activeElement)
                    }}
                    onBlur={(e)=>{
                        if(!e.relatedTarget || e.relatedTarget.id.trim()!=='todo-search-input'){
                            setHide_sug(true);
                        }
                    }}
                >
                    <div style={{fontSize:'small'}}>Search results...</div>
                    {suggestions_list}
                </div>
            }
            </div>
        </div>
        </div>
    </>
}

export default Search;