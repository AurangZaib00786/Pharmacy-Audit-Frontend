import {useReducer, createContext , useEffect} from 'react'

export const AddheaderContext = createContext();

const addheaderreducer=(state , action)=>{
    switch (action.type){
        case 'Set_selected_branch' :
            const branch=action.payload.current_user?.projects_list?.filter((item)=>
            item.name===action.payload.value)
            return {
                selected_branch:branch[0],
                current_user:state.current_user
            };
        case 'Set_selected_branch_first':
            
            return {
                selected_branch:action.payload,
                current_user:state.current_user
            };
        case 'Set_Current_user' :

            return {
                selected_branch:state.selected_branch,
                current_user:action.payload
            };

        default:
            return{
                state
            };
    }

}

export const AddheaderProvider=({children})=>{
    const branch = JSON.parse(localStorage.getItem("selected_branch"));
    if (branch){
        var uservalue=branch
    }else{
        uservalue=null
    }

    const [state , dispatch] = useReducer(addheaderreducer,{
        selected_branch :uservalue,
        current_user:null
    })

    

    return(
        <AddheaderContext.Provider value={{...state, dispatch}}>{children}</AddheaderContext.Provider>
    )
}



