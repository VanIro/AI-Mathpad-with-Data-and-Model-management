import {useEffect, useState} from 'react';

import './viewer.css';

let current_page = 1
let total_pages = 1

try{
    current_page = JSON.parse(document.getElementById('current-page').textContent);
    total_pages = JSON.parse(document.getElementById('total-pages').textContent);
}
catch(err){
    console.log('no current page or total pages')
}


function Viewer(props,children){
    const [filterKey, setFilterKey] = useState('');
    const [isOneItem, setIsOneItem] = useState(false);
    const [items_list, setItemsList] = useState([])

    
    
    useEffect(() => {
        let items_list2 = JSON.parse(document.getElementById(props.list_id).textContent)
        if(items_list){}
        if((typeof items_list2)===(typeof {}) && !Array.from(items_list2).length){
            // console.log('useEffect in Viewer: ',items_list, Array.from(items_list))
            if(Object.keys(items_list2).length>0){
                setItemsList ( [items_list2] );
                setIsOneItem(true);
            }
        }
        else{
            setIsOneItem(false);
            setItemsList ( items_list2 );
        }
    },[props.reloadTrigger])
    // console.log(items_list, Array.from(items_list))

    const header_columns = props.columns.map((column,i) => {
        return <div key={i} className='header-row row-item'>{column}</div>
    });

    const rows = items_list.filter(
            item=>(isOneItem||item.name.toLowerCase().includes(filterKey.toLowerCase()))
        ).map((item,i) => {
        return <div  key={i} id={`${props.id_pre}_${item.id}`} className='viewer-body row_style' 
                    onClick={props.handleRowClick || ( ()=>{console.log('no function for row click...')} ) }
                >
                <div className='row-item'>{i+1+(current_page-1)*10}</div>
                    {props.columns.map((column,j) => {
                        return <div key={j}  className='row-item'>{
                            column.includes('_at')?new Date(item[column]).toLocaleString():
                                item[column]
                        }
                        </div>
                    })}
                </div>
    });
    return (
        <div className="viewer">
            {!isOneItem && <div className="filter-container">
                <input type="text" placeholder="Search by name..." onChange={(e) => setFilterKey(e.target.value)} />
            </div>}
            <div className="viewer-header row_style">
                <div className='header-row row-item'>#</div>
                {header_columns}
            </div>
            <div className="viewer-body">
                {rows}
            </div>
        </div>
    );
}

export default Viewer;
