import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../auth/AuthContext";

import './todoList.css'
function TodoList(props){
    let navigate = useNavigate();
    // const {user} = useContext(AuthContext)

    // console.log(props.todoList)

    function listItemClickHandler(e){
        // console.log('--clicked',e.currentTarget.id);
        let id = e.currentTarget.id.split('-')[2]
        navigate('/todoApp/detail/'+id);
    }
    
    let listContents = props.todoList.map((item,i)=>{
        return  <div className="todoItem"  key={i} id={'todoItem-'+item['id']}>
                    <div className="done-check" style={{width:'1cm',height:'1.5cm',display:'inline-block',transform:'translateY(-60%)'}}>
                        <input type='checkbox' style={{transform:'translateX(120%)'}}/>
                    </div>
                    <div className="todoItem-content" id={'todoItem-content-'+item['id']} onClick={listItemClickHandler}> 
                        <div className="todoItem-title"> 
                            {item['title']} 
                        </div>
                        <div className="todoItem-meta">
                            Added by <b>{user['username']}</b>, last modified <b>{item['date']}</b>.
                        </div>
                    </div>
                </div>
                //</li>
    })

    
    let add_button = <div className="add-wrapper">
            <span className="circle" htmlFor="toogle" onClick={()=>navigate('/todoApp/new_todo')}>
                <img src="https://ssl.gstatic.com/bt/C3341AA7A1A076756462EE2E5CD71C11/2x/btw_ic_speeddial_white_24dp_2x.png" alt="" />
            </span>
        </div>

    return <>
        <div className='todoListCont'>
            <div className="todo-header">
                {add_button}
                <h1 style={{
                    display:'inline-block',
                    marginLeft:'0.4cm',
                    // height:'100%',
                    // width:'max-content',
                    transform: 'translateY(-50%)'
                }}>
                    My Posts:
                </h1>
            </div>

            <div className="todo-body">
                    { listContents.length > 0 && 
                            listContents
                    }
                    { listContents.length == 0 && 
                        <li>'No items in the list..'</li>
                    }
            </div>
            
            
        </div>
    </>
}

export default TodoList;